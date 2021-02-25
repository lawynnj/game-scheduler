/* Amplify Params - DO NOT EDIT
	API_POKERGAME_GRAPHQLAPIIDOUTPUT
	API_POKERGAME_USERTABLE_ARN
	API_POKERGAME_USERTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const AWS = require("aws-sdk");
const rest = require("/opt/nodejs/rest");
const createError = require("http-errors");

const docClient = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

exports.handler = async (event, context) => {
  console.log("## CONTEXT: " + rest.serialize(context));
  console.log("## EVENT: " + rest.serialize(event));

  // map DDB objects to JSON
  try {
    const modifiedRecords = event.Records.filter((record) => record.eventName === "MODIFY").map((record) => {
      return {
        newImage: AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage),
        oldImage: AWS.DynamoDB.Converter.unmarshall(record.dynamodb.OldImage),
      };
    });

    console.log("Request: Publishing messages...");
    const res = await Promise.all(modifiedRecords.map(publishGameNotification));

    return rest.formatResponse(rest.serialize(res));
  } catch (error) {
    console.log(error);
    return rest.formatError(error);
  }
};

async function publishGameNotification({ oldImage, newImage }) {
  // Publish SNS message when a game becomes "active"
  if (newImage.status === "ACTIVE" && oldImage.status !== newImage.status) {
    const user = await getUser(newImage.hostId);
    const params = {
      Message: JSON.stringify({
        subject: process.env.SNS_EMAIL_SUBJECT || "Poker Game Settings",
        body: `Your poker game:${newImage.title} is active!`,
        recipients: [user.Item.email],
      }),
      TopicArn: process.env.SNS_POKERGAME_TOPIC_ARN,
      Subject: process.env.SNS_SUBJECT || "Finalized game settings",
    };
    const res = await sns.publish(params).promise();
    return res;
  }
}

async function getUser(userId) {
  const params = {
    TableName: process.env.API_POKERGAME_USERTABLE_NAME,
    Key: {
      id: userId,
    },
  };
  const user = await docClient.get(params).promise();
  if (!user.hasOwnProperty("Item")) {
    throw createError.BadRequest(`User with id: ${userId} does not exist`);
  }
  return user;
}
