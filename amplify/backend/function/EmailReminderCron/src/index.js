/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const AWS = require("aws-sdk");
const createError = require("http-errors");
const rest = require("/opt/nodejs/rest");

const CWE_ROLE_ARN = process.env.AWS_CWE_ARN_POKER_GAME;
const LAMBDA_TARGET_ARN = process.env.AWS_CWE_LAMBDA_TARGET_ARN;

const cwe = new AWS.CloudWatchEvents();

exports.handler = async (event, context) => {
  console.log("## CONTEXT: " + rest.serialize(context));
  console.log("## EVENT: " + rest.serialize(event));

  try {
    const records = event.Records;
    const modifiedRecords = records
      .filter((record) => record.eventName === "MODIFY")
      .map((record) => {
        return {
          newImage: AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage),
          oldImage: AWS.DynamoDB.Converter.unmarshall(record.dynamodb.OldImage),
        };
      });

    await Promise.all(initCloudWatchEvents(modifiedRecords));

    return rest.formatResponse(rest.serialize({ success: true }));
  } catch (error) {
    return rest.formatError(error);
  }
};

function getSchedule(datetime) {
  const fullDate = new Date(datetime);
  const min = fullDate.getMinutes();
  const hour = fullDate.getHours();
  const date = fullDate.getDate();
  const month = fullDate.getMonth() + 1;
  const year = fullDate.getFullYear();
  const schedule = `cron(${min} ${hour} ${date} ${month} ? ${year})`;

  return schedule;
}

function getPutTargetParams(gameId, lambdaArn, ruleName) {
  const targetParams = {
    Rule: "poker-game-" + gameId,
    Targets: [
      {
        Arn: lambdaArn,
        Id: "Send-emails",
        Input: JSON.stringify({
          gameId,
          ruleName,
          targetId: "Send-emails",
        }),
      },
    ],
  };

  return targetParams;
}

function getPutRuleParams(gameId, roleArn, ruleName, schedule) {
  const ruleParams = {
    Name: ruleName,
    Description: "Email notification for game:" + gameId,
    RoleArn: roleArn,
    ScheduleExpression: schedule,
    State: "ENABLED",
  };

  return ruleParams;
}

async function createRule({ newImage: game }) {
  try {
    if (!game.eventTime) {
      throw createError.BadRequest("Invalid value for eventTime:", game.eventTime);
    }

    // configure rule to run at the game's event time
    const schedule = getSchedule(game.eventTime);
    const ruleName = "poker-game-" + game.id;
    const ruleParams = getPutRuleParams(game.id, CWE_ROLE_ARN, ruleName, schedule);

    await cwe.putRule(ruleParams).promise();

    // Set lambda fn as the rule target
    const targetParams = getPutTargetParams(game.id, LAMBDA_TARGET_ARN, ruleName);

    await cwe.putTargets(targetParams).promise();
  } catch (error) {
    throw error;
  }
}

function initCloudWatchEvents(modifiedGames) {
  // filter for games that are newly completed
  const completedGamesFilter = ({ newImage, oldImage }) =>
    newImage.status === "COMPLETED" && oldImage.status !== newImage.status;

  const promises = modifiedGames.filter(completedGamesFilter).map(createRule);

  return promises;
}
