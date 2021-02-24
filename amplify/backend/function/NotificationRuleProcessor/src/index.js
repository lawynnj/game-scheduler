/* Amplify Params - DO NOT EDIT
	API_POKERGAME_GAMETABLE_ARN
	API_POKERGAME_GAMETABLE_NAME
	API_POKERGAME_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const AWS = require("aws-sdk");
const createError = require("http-errors");
const rest = require("/opt/nodejs/rest");

const docClient = new AWS.DynamoDB.DocumentClient();
const cwe = new AWS.CloudWatchEvents();
const sns = new AWS.SNS();

exports.handler = async (event, context) => {
  try {
    console.log("## CONTEXT: " + rest.serialize(context));
    console.log("## EVENT: " + rest.serialize(event));

    await publishSnsMessage(event);
    return rest.formatResponse("success");
  } catch (error) {
    return rest.formatError(error);
  }
};

async function getGame(gameId) {
  try {
    const params = {
      TableName: process.env.API_POKERGAME_GAMETABLE_NAME,
      Key: {
        id: gameId,
      },
    };

    const game = await docClient.get(params).promise();

    if (!game.hasOwnProperty("Item")) {
      throw createError.BadRequest(`Game with id: ${gameId} does not exist`);
    }
    return game;
  } catch (error) {
    throw error;
  }
}

async function publishSnsMessage({ gameId, ruleName, targetId }) {
  try {
    const game = await getGame(gameId);

    const params = {
      Message: JSON.stringify({
        subject: `Poker game:${game.Item.title}`,
        body: `The poker game: ${game.Item.title} is today at ${game.Item.eventTime}`,
        recipients: game.Item.players,
      }),
      TopicArn: process.env.SNS_POKERGAME_TOPIC_ARN,
      Subject: process.env.SNS_SUBJECT || "Game Complete",
    };

    console.log("Publishing message");
    await sns.publish(params).promise();

    // remove targets
    console.log("Removing targets");
    await cwe
      .removeTargets({
        Rule: ruleName,
        Ids: [targetId],
      })
      .promise();

    // delete rule
    console.log("Deleting rule");
    await cwe
      .deleteRule({
        Name: ruleName,
      })
      .promise();
  } catch (error) {
    throw error;
  }
}
