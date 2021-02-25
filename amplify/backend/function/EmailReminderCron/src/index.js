/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const AWS = require("aws-sdk");
const createError = require("http-errors");
const rest = require("/opt/nodejs/rest");

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

    // Create events for games that are "Completed" for the first time
    const completedGames = modifiedRecords.filter(
      ({ newImage, oldImage }) => newImage.status === "COMPLETED" && oldImage.status !== "COMPLETED",
    );
    await Promise.all(completedGames.map(createRule));

    return rest.formatResponse(rest.serialize({ success: true }));
  } catch (error) {
    console.log(error);
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

function getPutTargetParams(gameId, ruleName) {
  const targetParams = {
    Rule: "poker-game-" + gameId,
    Targets: [
      {
        Arn: process.env.CWE_LAMBDA_TARGET_ARN,
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

function getPutRuleParams(gameId, ruleName, schedule) {
  const ruleParams = {
    Name: ruleName,
    Description: "Email notification for game:" + gameId,
    RoleArn: process.env.EVENT_IAM_ROLE_ARN,
    ScheduleExpression: schedule,
    State: "ENABLED",
  };

  return ruleParams;
}

async function createRule({ newImage: game }) {
  // use the date and time with the most votes as the scheduled time for the event
  if (!game.timeOptions || !game.dateOptions) {
    throw createError.BadRequest("Invalid value for timeOptions or dateOptions");
  }

  const getMaxOption = (prev, current) => (prev.votes > current.votes ? prev : current);
  const maxVotesTimeOpt = game.timeOptions.reduce(getMaxOption);
  const maxVotesDateOpt = game.dateOptions.reduce(getMaxOption);

  const datetime = maxVotesDateOpt.date + "T" + maxVotesTimeOpt.time;
  const schedule = getSchedule(datetime);
  const ruleName = "poker-game-" + game.id;
  const ruleParams = getPutRuleParams(game.id, ruleName, schedule);

  await cwe.putRule(ruleParams).promise();

  // Set lambda fn as the rule target
  const targetParams = getPutTargetParams(game.id, ruleName);

  await cwe.putTargets(targetParams).promise();
}
