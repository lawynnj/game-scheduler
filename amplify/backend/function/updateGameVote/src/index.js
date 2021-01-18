/* Amplify Params - DO NOT EDIT
	API_POKERGAME_GAMETABLE_ARN
	API_POKERGAME_GAMETABLE_NAME
	API_POKERGAME_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const AWS = require("aws-sdk");
const region = process.env.REGION;
const docClient = new AWS.DynamoDB.DocumentClient({ region });
const gameTableName = process.env.API_POKERGAME_GAMETABLE_NAME;

function generateUpdateParams(tablename, key, item) {
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
    TableName: tablename,
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
    try {
      const { id, buyInOptions, hostId, dateOptions, timeOptions } = event.arguments.input;
      const item = {
        hostId,
        buyInOptions,
        dateOptions,
        timeOptions,
      };
      const key = { id };
      const params = generateUpdateParams(gameTableName, key, item);

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

exports.handler = async (event, context, callback) => {
  try {
    let res = {};
    if (event.typeName === "Mutation") {
      res = await updateVotes(event, callback);
    }
    context.succeed(res);
  } catch (error) {
    context.fail(error);
  }
};
