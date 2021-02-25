const AWS = require("aws-sdk");
const createError = require("http-errors");
const rest = require("/opt/nodejs/rest");
const sns = new AWS.SNS();

exports.handler = (event, context) => {
  console.log("## CONTEXT: " + rest.serialize(context));
  console.log("## EVENT: " + rest.serialize(event));

  try {
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

    await Promise.all(handleCompletedGame(completedGames)) 

  } catch (error) {
    console.log(error)
    return rest.formatError(error);
  }
};

async function handleCompletedGame({ newImage: game }) {
  // use the date and time with the most votes as the scheduled time for the event
  if (!game.timeOptions || !game.dateOptions) {
    throw createError.BadRequest("Invalid value for timeOptions or dateOptions");
  }
  const getMaxOption = (prev, current) => (prev.votes > current.votes ? prev : current);
  const maxVotesTimeOpt = game.timeOptions.reduce(getMaxOption);
  const maxVotesDateOpt = game.dateOptions.reduce(getMaxOption);
  const datetime = maxVotesDateOpt.date + "T" + maxVotesTimeOpt.time;
  await notifyUsers(game, datetime);
}

async function notifyUsers(game, datetime) {
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
