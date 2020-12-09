const AWS = require("aws-sdk");
const ses = new AWS.SES({ region: process.env.AWS_REGION });

exports.handler = async function (event) {
  console.log("EVENT\n" + JSON.stringify(event, null, 2));

  let recNum = 0;
  for (const record of event.Records) {
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
    try {
      console.log("Request: Processing record", recNum);
      await ses.sendEmail(params).promise();
      console.log("Success: Success");
      recNum += 1;
    } catch (error) {
      console.log("Error", error);
    }
  }
};
