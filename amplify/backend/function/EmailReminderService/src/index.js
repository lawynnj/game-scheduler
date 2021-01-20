const AWS = require("aws-sdk");
const rest = require("/opt/nodejs/rest");
const ses = new AWS.SES({ region: process.env.AWS_REGION });

exports.handler = async function (event) {
  console.log("## CONTEXT: " + rest.serialize(context));
  console.log("## EVENT: " + rest.serialize(event));

  const res = await sendEmails(records);

  return res;
};

async function sendEmails(records) {
  const promises = [];

  for (const record of records) {
    // get recipients, subject and body for email
    const message = JSON.parse(record.Sns.Message);
    const recipients = message.recipients;
    const subject = message.subject ? message.subject : "No Subject";
    const body = message.body ? message.body : "";
    const emails = recipients.map((recipient) => recipient.email);

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
    promises.push(ses.sendEmail(params).promise());
  }

  try {
    await Promise.all(promises);
    return rest.formatSuccess();
  } catch (error) {
    return rest.formatError(error);
  }
}
