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

/**
 * Processes a "vote".
 * Updates the votes for time, date and buy-in options.
 * @param {*} event
 * @param {*} context
 */
exports.handler = async (event, context) => {
  console.log("## CONTEXT: " + rest.serialize(context));
  console.log("## EVENT: " + rest.serialize(event));

  try {
    if (event.typeName !== "Mutation") {
      throw new Error("Invalid event type");
    }
    const res = await updateVotes(event);
    return res;
  } catch (error) {
    console.log(error);
    return rest.formatError(error);
  }
};

function generateUpdateParams(key, item, email) {
  const { dateOptionIdx, timeOptionIdx, buyInOptionIdx } = item;
  let updateExpression = "set";
  let ExpressionAttributeValues = {};

  ExpressionAttributeValues[":increment"] = 1;
  updateExpression += ` dateOptions[${dateOptionIdx}].votes = dateOptions[${dateOptionIdx}].votes + :increment ,`;
  updateExpression += ` timeOptions[${timeOptionIdx}].votes = timeOptions[${timeOptionIdx}].votes + :increment , `;
  updateExpression += ` buyInOptions[${buyInOptionIdx}].votes = buyInOptions[${buyInOptionIdx}].votes + :increment `;

  // append a player to the list of players
  let ExpressionAttributeNames = null;
  if (email) {
    ExpressionAttributeNames = {};
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
      const { id, buyInOptionIdx, hostId, dateOptionIdx, timeOptionIdx, email } = event.arguments.input;
      const item = {
        hostId,
        buyInOptionIdx,
        dateOptionIdx,
        timeOptionIdx,
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
