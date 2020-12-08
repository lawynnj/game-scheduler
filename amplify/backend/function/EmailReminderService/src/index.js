var aws = require("aws-sdk");
var ses = new aws.SES({ region: process.env.AWS_REGION });

exports.handler = async function (event) {
  console.log("EVENT\n" + JSON.stringify(event, null, 2));

  var params = {
    Destination: {
      ToAddresses: ["jlawynn@gmail.com"],
    },
    Message: {
      Body: {
        Text: { Data: "Test" },
      },

      Subject: { Data: "Test Email" },
    },
    Source: process.env.AWS_SES_POKER_APP_EMAIL,
  };

  return ses.sendEmaail(params).promise();
};
