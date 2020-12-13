/* Amplify Params - DO NOT EDIT
	API_POKERGAME_GRAPHQLAPIIDOUTPUT
	API_POKERGAME_USERTABLE_ARN
	API_POKERGAME_USERTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const AWS = require("aws-sdk");
const ARN = process.env.AWS_CWE_ARN_POKER_GAME;
const LAMBDA_ARN = process.env.LAMBDA_ARN_POKER_GAME;

function initCloudWatchEvents(modifiedGames) {
  const cwe = new AWS.CloudWatchEvents();
  return (
    modifiedGames
      // filter for games that are newly completed
      .filter(
        ({ newImage, oldImage }) =>
          newImage.status === "COMPLETED" && oldImage.status !== newImage.status
      )
      .map(async ({ newImage }) => {
        try {
          console.log("Creating rule...");
          if (!newImage.eventTime) {
            throw new Error("Invalid value eventTime:", newImage.eventTime);
          }
          // configure rule to run on the event time
          const fullDate = new Date(newImage.eventTime);
          const min = fullDate.getMinutes();
          const hour = fullDate.getHours();
          const date = fullDate.getDate();
          const month = fullDate.getMonth() + 1;
          const year = fullDate.getFullYear();
          const schedule = `cron(${min} ${hour} ${date} ${month} ? ${year})`;
          const ruleName = "poker-game-" + newImage.id;
          const ruleParams = {
            Name: ruleName,
            Description: "Email notification for game:" + newImage.id,
            RoleArn: ARN,
            ScheduleExpression: schedule,
            State: "ENABLED",
          };
          await cwe.putRule(ruleParams).promise();

          // Set lambda fn as the rule target
          console.log("Setting targets...");
          const targetParams = {
            Rule: "poker-game-" + newImage.id,
            Targets: [
              {
                Arn: LAMBDA_ARN,
                Id: "Send-emails",
                Input: JSON.stringify({
                  gameId: newImage.id,
                  ruleName,
                  targetId: "Send-emails",
                }),
              },
            ],
          };
          await cwe.putTargets(targetParams).promise();
        } catch (error) {
          console.log("Error", error);
        }
      })
  );
}
exports.handler = async (event) => {
  //eslint-disable-line
  console.log("EVENT\n" + JSON.stringify(event, null, 2));

  // map DDB objects to JSON
  const modifiedRecords = event.Records.filter(
    (record) => record.eventName === "MODIFY"
  ).map((record) => {
    return {
      newImage: AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage),
      oldImage: AWS.DynamoDB.Converter.unmarshall(record.dynamodb.OldImage),
    };
  });
  try {
    await Promise.all(initCloudWatchEvents(modifiedRecords));
  } catch (error) {
    console.log("Error", error);
  }
};
