/* Amplify Params - DO NOT EDIT
	API_POKERGAME_GAMETABLE_ARN
	API_POKERGAME_GAMETABLE_NAME
	API_POKERGAME_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const AWS = require("aws-sdk");
const rest = require("/opt/nodejs/rest");

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  console.log("## CONTEXT: " + rest.serialize(context));
  console.log("## EVENT: " + rest.serialize(event));

  try {
    let res;
    if (event.typeName === "Mutation") {
      res = await updateVotes(event);
    }
    return res;
  } catch (error) {
    return error;
  }
};

function generateUpdateParams(key, item) {
  let updateExpression = "set";
  let ExpressionAttributeNames = {};
  let ExpressionAttributeValues = {};

  for (const property in item) {
    updateExpression += ` #${property} = :${property} ,`;
    ExpressionAttributeNames["#" + property] = property;
    ExpressionAttributeValues[":" + property] = item[property];
  }

  updateExpression = updateExpression.slice(0, -1);

  const params = {
    TableName: process.env.API_POKERGAME_GAMETABLE_NAME,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: ExpressionAttributeNames,
    ExpressionAttributeValues: ExpressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  return params;
}

async function updateVotes(event) {
  if (event.arguments && event.arguments.input) {
    // check if game exists
    try {
      // add email
      const { id, buyInOptions, hostId, dateOptions, timeOptions, email } = event.arguments.input;
      console.log("EMAIL", email);
      const item = {
        hostId,
        buyInOptions,
        dateOptions,
        timeOptions,
      };
      const key = { id };
      const params = generateUpdateParams(key, item);

      const res = await docClient.update(params).promise();

      const data = {
        ...res.Attributes,
        id,
      };
      return data;
    } catch (e) {
      throw e;
    }
  } else {
    throw Error("Error: Invalid arguments");
  }
}
