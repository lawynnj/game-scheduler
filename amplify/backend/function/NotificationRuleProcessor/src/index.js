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

async function getGame(gameId) {
  try {
    const params = {
      TableName: GAME_TABLE,
      Key: {
        id: gameId,
      },
    };
    console.log("Params", params);
    const game = await docClient.get(params).promise();
    return game;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
}

async function initSnsEvent(gameId) {
  const sns = new AWS.SNS();

  try {
    const game = await getGame(gameId);
    const recipients = game.people.map((person) => ({
      email: person.email,
      name: person.name,
    }));
    const params = {
      Message: JSON.stringify({
        subject: `Poker game:${game.title}`,
        body: `The poker game: ${game.title} is today at ${game.eventTime}`,
        recipients,
      }),
      TopicArn: ARN,
      Subject: SUBJECT,
    };
    await sns.publish(params).promise();
  } catch (error) {
    console.log("Error", error);
  }
}

exports.handler = async (event) => {
  // TODO implement
  console.log(event);
  await initSnsEvent(event.gameId);
};
