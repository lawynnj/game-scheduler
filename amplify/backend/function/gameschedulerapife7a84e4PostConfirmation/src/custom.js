const aws = require("aws-sdk");
const lambda = new aws.Lambda({
  region: process.env.AWS_REGION,
});

const addUserToTable = function (event, context) {
  // Call function to add user to table Users
  const params = {
    FunctionName: "createUser-" + process.env.ENV,
    InvocationType: "RequestResponse",
    Payload: JSON.stringify(event, context),
  };

  lambda.invoke(params, function (err, data) {
    if (err) {
      console.error(err);
    } else {
      console.log(params.FunctionName + ": " + data.Payload);
    }
  });
};

exports.handler = (event, context, callback) => {
  // insert code to be executed by your lambda trigger
  addUserToTable(event, context);
  callback(null, event);
};
