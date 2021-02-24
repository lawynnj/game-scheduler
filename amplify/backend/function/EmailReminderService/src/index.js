const AWS = require("aws-sdk");
const rest = require("/opt/nodejs/rest");
const ses = new AWS.SES({ region: process.env.AWS_REGION });

exports.handler = async function (event, context) {
  console.log("## CONTEXT: " + rest.serialize(context));
  console.log("## EVENT: " + rest.serialize(event));

  try {
    const response = await Promise.all(event.Records.map(sendEmail));
    return rest.formatResponse(rest.serialize(response));
  } catch (error) {
    return rest.formatError(error);
  }
};

async function sendEmail(record) {
  try {
    // get recipients, subject and body for email
    const message = JSON.parse(record.Sns.Message);
    const emails = message.recipients;
    const subject = message.subject ? message.subject : "No Subject";
    const body = message.body ? message.body : "";

    const params = {
      Destination: {
        ToAddresses: emails,
      },
      Message: {
        Body: {
          Text: { Data: body },
        },
        Subject: { Data: subject },
      },
      Source: process.env.AWS_SES_POKER_APP_EMAIL,
    };

    return await ses.sendEmail(params).promise();
  } catch (error) {
    throw error;
  }
}
