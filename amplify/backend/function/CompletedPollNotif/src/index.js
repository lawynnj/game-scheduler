const AWS = require("aws-sdk");
const createError = require("http-errors");
const rest = require("/opt/nodejs/rest");
const sns = new AWS.SNS();

/**
 * This lambda is triggered by an update to the Game table.
 * When a game's status is set to "completed", send email notifications to the players.
 * @param {*} event
 * @param {*} context
 */
exports.handler = async (event, context) => {
  console.log("## CONTEXT: " + rest.serialize(context));
  console.log("## EVENT: " + rest.serialize(event));

  try {
    const records = event.Records;
    const modifiedRecords = records
      .filter((record) => record.eventName === "MODIFY")
      .map((record) => {
        return {
          newImage: AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage),
          oldImage: AWS.DynamoDB.Converter.unmarshall(record.dynamodb.OldImage),
        };
      });

    // Notify users about completed polls
    const completedGames = modifiedRecords.filter(
      ({ newImage, oldImage }) => newImage.status === "COMPLETED" && oldImage.status !== "COMPLETED",
    );

    await Promise.all(completedGames.map(sendNotifications));
    return rest.formatResponse(rest.serialize({ success: true }));
  } catch (error) {
    console.log(error);
    return rest.formatError(error);
  }
};

async function sendNotifications({ newImage: game }) {
  // use the date and time with the most votes as the scheduled time for the event
  if (!game.timeOptions || !game.dateOptions) {
    throw createError.BadRequest("Invalid value for timeOptions or dateOptions");
  }
  const getMaxOption = (prev, current) => (prev.votes > current.votes ? prev : current);
  const maxVotesTimeOpt = game.timeOptions.reduce(getMaxOption);
  const maxVotesDateOpt = game.dateOptions.reduce(getMaxOption);
  const datetime = maxVotesDateOpt.date + "T" + maxVotesTimeOpt.time;
  const params = {
    Message: JSON.stringify({
      subject: process.env.SNS_EMAIL_SUBJECT || "Poker Game Poll Completed",
      body: `The poker game: ${game.title} starts on ${datetime}!`,
      recipients: game.players,
    }),
    TopicArn: process.env.SNS_POKERGAME_TOPIC_ARN,
    Subject: process.env.SNS_SUBJECT || "Completed game settings",
  };
  await sns.publish(params).promise();
}
