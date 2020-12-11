/* Amplify Params - DO NOT EDIT
	API_POKERGAME_GRAPHQLAPIIDOUTPUT
	API_POKERGAME_USERTABLE_ARN
	API_POKERGAME_USERTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const AWS = require("aws-sdk");
const ARN = process.env.AWS_SNS_ARN_POKER_GAME;
const USER_TABLE = process.env.AWS_DDB_USER_TABLE;
const SUBJECT = process.env.SNS_SUBJECT || "Finalized game settings";
const EMAIL_SUBJECT = process.env.EMAIL_SUBJECT || "Poker Game Settings";

AWS.config.update({ region: process.env.AWS_REGION });
const docClient = new AWS.DynamoDB.DocumentClient();

function initSnsEvents(modifiedRecords) {
  const sns = new AWS.SNS();

  return modifiedRecords.map(async ({ oldImage, newImage }) => {
    // Publish SNS message when a game becomes "active"
    if (newImage.status === "ACTIVE" && oldImage.status !== newImage.status) {
      try {
        const user = await getUser(newImage.hostId);
        const params = {
          Message: JSON.stringify({
            subject: EMAIL_SUBJECT,
            body: `Your poker game:${newImage.title} is active!`,
            recipients: [{ email: user.Item.email, name: user.Item.username }],
          }),
          TopicArn: ARN,
          Subject: SUBJECT,
        };
        await sns.publish(params).promise();
      } catch (error) {
        console.log("Error", error);
      }
    }
  });
}

async function getUser(userId) {
  try {
    const params = {
      TableName: USER_TABLE,
      Key: {
        id: userId,
      },
    };
    const user = await docClient.get(params).promise();
    return user;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
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
    console.log("Request: Publishing messages...");
    await Promise.all(initSnsEvents(modifiedRecords));
    console.log("Success: Messages published");
  } catch (error) {
    console.log("Error: Messages not published", error);
  }
};
