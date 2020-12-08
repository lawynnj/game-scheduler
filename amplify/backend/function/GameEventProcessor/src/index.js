const AWS = require("aws-sdk");

AWS.config.update({ region: process.env.AWS_REGION });
const ARN = process.env.AWS_SNS_ARN_POKER_GAME;

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
  modifiedGames.forEach(({ oldImage, newImage }) => {
    // Publish SNS message when game becomes "active"
    if (newImage.status === "ACTIVE" && oldImage.status !== newImage.status) {
      const params = {
        Message: JSON.stringify(newImage.players),
        TopicArn: ARN,
        Subject: "Finalized game settings",
      };
      snsRequests.push(sns.publish(params).promise());
    }
  });
  try {
    console.log("Request: Publishing messages...");
    await Promise.all(snsRequests);
    console.log("Success: Messages published");
  } catch (error) {
    console.log("Error: Messages not published", error);
  }
};
