const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const params = {
  TableName: process.env.GAME_TABLE_NAME,
  /* Item properties will depend on your application concerns */
  KeyConditionExpression: "#eventTime = :eventTime",
  ExpressionAttributeNames: {
    "#eventTime": "eventTime",
  },
};

async function getGames() {
  try {
    // const eventTime = new Date();
    // params.ExpressionAttributeValues = {
    //   ":eventTime": { S: eventTime },
    // };
    const data = [];
    // const data = await docClient.get(params).promise();
    return data;
  } catch (err) {
    return err;
  }
}

exports.handler = async (event, context, callback) => {
  // fetch games that start today
  // trigger an SES message passing array of emails
  try {
    const games = await getGames();
  } catch (error) {}
  //   console.log("Received event:", JSON.stringify(event, null, 2));
  callback(null, "Finished");
};
