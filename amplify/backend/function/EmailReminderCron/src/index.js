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

async function initCloudWatchEvents(modifiedGames) {
  const cwe = new AWS.CloudWatchEvents();
  for (const game of modifiedGames) {
    const { oldImage, newImage } = game;

    // Create CloudWatch event when game status is "completed"
    if (
      newImage.status === "COMPLETED" &&
      oldImage.status !== newImage.status
    ) {
      try {
        console.log("Creating rule...");

        if (!newImage.eventTime) {
          throw new Error("Invalid value eventTime:", newImage.eventTime);
        }

        const fullDate = new Date(newImage.eventTime);
        const min = fullDate.getMinutes();
        const hour = fullDate.getHours();
        const date = fullDate.getDate();
        const month = fullDate.getMonth() + 1;
        const year = fullDate.getFullYear();
        const schedule = `cron(${min} ${hour} ${date} ${month} ? ${year})`;
        const ruleParams = {
          Name: "poker-game-" + newImage.id,
          Description: "Email notification for game:" + newImage.id,
          RoleArn: ARN,
          ScheduleExpression: schedule,
          State: "ENABLED",
        };
        await cwe.putRule(ruleParams).promise();

        console.log("Setting targets...");
        const targetParams = {
          Rule: "poker-game-" + newImage.id,
          Targets: [
            {
              Arn: LAMBDA_ARN,
              Id: "1",
              Input: JSON.stringify({ gameId: newImage.id }),
            },
          ],
        };
        await cwe.putTargets(targetParams).promise();
      } catch (error) {
        console.log("Error", error);
      }
    }
  }
}
exports.handler = async (event, context) => {
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

  await initCloudWatchEvents(modifiedRecords);
};
