const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const GAME_TABLE = process.env.AWS_DDB_GAME_TABLE;

async function getGames() {
  try {
    const params = {
      TableName: GAME_TABLE,
      /* Item properties will depend on your application concerns */
      KeyConditionExpression: "#eventTime = :eventTime",
      ExpressionAttributeNames: {
        "#eventTime": "eventTime",
      },
    };
    const eventTime = new Date();
    params.ExpressionAttributeValues = {
      ":eventTime": { S: eventTime },
    };
    const data = await docClient.get(params).promise();
    return data;
  } catch (err) {
    return err;
  }
}

exports.handler = async (event, context, callback) => {
  // gets triggered by a dynamo db stream
  // if the status is finalized
  //    create an event with game.id as UUID to send emails on game.eventDate date
  // else if the status is cancelled
  //    find all events with id === game.id and delete them
  try {
    const games = await getGames();
  } catch (error) {}
  //   console.log("Received event:", JSON.stringify(event, null, 2));
  callback(null, "Finished");
};
