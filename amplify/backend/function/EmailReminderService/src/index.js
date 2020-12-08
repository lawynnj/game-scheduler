const AWS = require("aws-sdk");
const ses = new AWS.SES({ region: process.env.AWS_REGION });

exports.handler = async function (event) {
  console.log("EVENT\n" + JSON.stringify(event, null, 2));

  let subject = "No Subject";
  let body = "";

  const emails = event.Records.reduce((acc, record) => {
    const message = JSON.parse(record.Sns.Message);
    const recipients = message.recipients;
    if (message.subject) {
      subject = message.subject;
    }
    if (message.body) {
      body = message.body;
    }
    const tempEmails = recipients.map((person) => person.email);
    return acc.concat(tempEmails);
  }, []);

  var params = {
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
  try {
    console.log("Sending emails...");
    await ses.sendEmail(params).promise();
  } catch (error) {
    console.log("Error", error);
  }
};
