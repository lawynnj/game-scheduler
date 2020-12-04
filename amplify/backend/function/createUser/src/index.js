/* Amplify Params - DO NOT EDIT
	API_POKERGAME_GRAPHQLAPIIDOUTPUT
	API_POKERGAME_USERTABLE_ARN
	API_POKERGAME_USERTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

let aws = require("aws-sdk");
let ddb = new aws.DynamoDB();

exports.handler = async (event, context) => {
  let date = new Date();

  if (event.request.userAttributes.sub) {
    let params = {
      Item: {
        id: { S: event.request.userAttributes.sub },
        __typename: { S: "User" },
        email: { S: event.request.userAttributes.email },
        createdAt: { S: date.toISOString() },
        updatedAt: { S: date.toISOString() },
      },
      TableName: process.env.API_POKERGAME_USERTABLE_NAME,
    };

    // put user item into DynamoDB
    try {
      await ddb.putItem(params).promise();
      console.log("Success: User created!");
    } catch (err) {
      console.log("Error", err);
    }

    console.log("Success: Executed correctly!");
    context.done(null, event);
  } else {
    // Nothing to do, the user's email ID is unknown
    console.log("Error: Something went wrong");
    context.done(null, event);
  }
};
