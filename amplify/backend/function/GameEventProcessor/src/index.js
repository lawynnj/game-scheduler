const AWS = require("aws-sdk");

const userTable = process.env.AWS_DDB_USER_TABLE;

AWS.config.update({ region: process.env.AWS_REGION });
const docClient = new AWS.DynamoDB.DocumentClient();
const ARN = process.env.AWS_SNS_ARN_POKER_GAME;

async function getUser(userId) {
  try {
    const params = {
      TableName: userTable,
      Key: {
        id: userId,
      },
    };
    console.log("Fetchign user...");
    console.log(params);
    const user = await docClient.get(params).promise();
    console.log("User", user);
    return user;
  } catch (err) {
    console.log("Error", err);
    return err;
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
      console.log("Returned user", user);
      const params = {
        Message: JSON.stringify({
          subject: "Poker Game Settings",
          body: "Your game has been created",
          recipients: [{ email: user.email, name: user.username }],
        }),
        TopicArn: ARN,
        Subject: "Finalized game settings",
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
