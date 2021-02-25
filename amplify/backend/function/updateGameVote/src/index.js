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

function generateUpdateParams(key, item, email) {
  let updateExpression = "set";
  let ExpressionAttributeNames = {};
  let ExpressionAttributeValues = {};

  // update email list
  // race condition, if two people simultaneously vote it will skew the results
  // we need to increment the date, time and buy in votes instead of updating the entire objects
  for (const property in item) {
    updateExpression += ` #${property} = :${property} ,`;
    ExpressionAttributeNames["#" + property] = property;
    ExpressionAttributeValues[":" + property] = item[property];
  }

  updateExpression = updateExpression.slice(0, -1);

  // append a player to the list of players
  if (email) {
    ExpressionAttributeNames["#players"] = "players";
    ExpressionAttributeValues[":new_email"] = [email];
    ExpressionAttributeValues[":empty_list"] = [];
    // if players property is null then set it as an empty list and append new player
    updateExpression += `, #players = list_append(if_not_exists(#players, :empty_list), :new_email) `;
  }

  // ensure record exists
  const ConditionExpression = "attribute_exists(id)";

  const params = {
    TableName: process.env.API_POKERGAME_GAMETABLE_NAME,
    Key: key,
    ConditionExpression: ConditionExpression,
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
      const { id, buyInOptions, hostId, dateOptions, timeOptions, email } = event.arguments.input;
      const item = {
        hostId,
        buyInOptions,
        dateOptions,
        timeOptions,
      };
      const key = { id };

      const params = generateUpdateParams(key, item, email);

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
