/* Amplify Params - DO NOT EDIT
	API_POKERGAME_GAMETABLE_ARN
	API_POKERGAME_GAMETABLE_NAME
	API_POKERGAME_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const AWS = require("aws-sdk");
const GAME_TABLE = process.env.API_POKERGAME_GAMETABLE_NAME;
const ARN = process.env.AWS_SNS_ARN_POKER_GAME;
const SUBJECT = process.env.SNS_SUBJECT || "Game complete";
const docClient = new AWS.DynamoDB.DocumentClient();
const cwe = new AWS.CloudWatchEvents();

async function getGame(gameId) {
  try {
    const params = {
      TableName: GAME_TABLE,
      Key: {
        id: gameId,
      },
    };
    const game = await docClient.get(params).promise();
    return game;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
}

async function initSnsEvent({ gameId, ruleName, targetId }) {
  const sns = new AWS.SNS();

  try {
    const game = await getGame(gameId);
    const recipients = game.Item.players.map((player) => ({
      email: player.email,
      name: player.name,
    }));
    const params = {
      Message: JSON.stringify({
        subject: `Poker game:${game.Item.title}`,
        body: `The poker game: ${game.Item.title} is today at ${game.Item.eventTime}`,
        recipients,
      }),
      TopicArn: ARN,
      Subject: SUBJECT,
    };
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
    console.log("Error", error);
  }
}

exports.handler = async (event) => {
  await initSnsEvent(event);
};
