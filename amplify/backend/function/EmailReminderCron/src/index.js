/* Amplify Params - DO NOT EDIT
	API_POKERGAME_GRAPHQLAPIIDOUTPUT
	API_POKERGAME_USERTABLE_ARN
	API_POKERGAME_USERTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const AWS = require("aws-sdk");
const createError = require("http-errors");
const CWE_ROLE_ARN = process.env.AWS_CWE_ARN_POKER_GAME;
const LAMBDA_ARN = process.env.AWS_CWE_LAMBDA_TARGET_ARN;
const cwe = new AWS.CloudWatchEvents();

exports.handler = async (event, context) => {
  console.log("## CONTEXT: " + serialize(context));
  console.log("## EVENT: " + serialize(event));

  try {
    // map DDB objects to JSON
    const modifiedRecords = event.Records.filter((record) => record.eventName === "MODIFY").map((record) => {
      return {
        newImage: AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage),
        oldImage: AWS.DynamoDB.Converter.unmarshall(record.dynamodb.OldImage),
      };
    });
    await Promise.all(initCloudWatchEvents(modifiedRecords));

    return formatResponse(serialize({ success: true }));
  } catch (error) {
    return formatError(error);
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
      throw createError.BadRequest("Invalid value eventTime:", game.eventTime);
    }

    // configure rule to run on the event time
    console.log("Creating rule...");
    const schedule = getSchedule(game.eventTime);
    const ruleName = "poker-game-" + game.id;
    const ruleParams = getPutRuleParams(game.id, CWE_ROLE_ARN, ruleName, schedule);
    await cwe.putRule(ruleParams).promise();

    // Set lambda fn as the rule target
    console.log("Setting targets...");
    const targetParams = getPutTargetParams(game.id, LAMBDA_ARN, ruleName);

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

function formatResponse(body) {
  var response = {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  };

  return response;
}

function formatError(error) {
  const errorCode = error.code || error.name || "Internal Server Error";
  const response = {
    statusCode: error.statusCode || 500,
    headers: {
      "Content-Type": "text/plain",
      "x-amzn-ErrorType": errorCode,
    },
    body: errorCode + ": " + error.message,
  };

  return response;
}

function serialize(object) {
  return JSON.stringify(object, null, 2);
}
