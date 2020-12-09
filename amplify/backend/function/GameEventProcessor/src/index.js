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
const EMAIL_BODY = process.env.EMAIL_BODY || "Your game has been created";

AWS.config.update({ region: process.env.AWS_REGION });
const docClient = new AWS.DynamoDB.DocumentClient();

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

exports.handler = async (event, context) => {
  //eslint-disable-line
  console.log("EVENT\n" + JSON.stringify(event, null, 2));

  // map DDB objects to JSON
  const modifiedGames = event.Records.map((record) => {
    return {
      newImage: AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage),
      oldImage: AWS.DynamoDB.Converter.unmarshall(record.dynamodb.OldImage),
    };
  });

  const snsRequests = [];
  const sns = new AWS.SNS();

  for (const game of modifiedGames) {
    const { oldImage, newImage } = game;

    // Publish SNS message when game becomes "active"
    if (newImage.status === "ACTIVE" && oldImage.status !== newImage.status) {
      const user = await getUser(newImage.hostId);
      const params = {
        Message: JSON.stringify({
          subject: EMAIL_SUBJECT,
          body: EMAIL_BODY,
          recipients: [{ email: user.email, name: user.username }],
        }),
        TopicArn: ARN,
        Subject: SUBJECT,
      };
      snsRequests.push(sns.publish(params).promise());
    }
  }

  try {
    console.log("Request: Publishing messages...");
    await Promise.all(snsRequests);
    console.log("Success: Messages published");
  } catch (error) {
    console.log("Error: Messages not published", error);
  }
};
