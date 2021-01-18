/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const gameTableName = process.env.GAME_TABLE_NAME;
const params = {
  TableName: gameTableName,
};

function updateVotes(event) {
  const { id } = event.arguments;
}

exports.handler = async (event) => {
  console.log(event);
  console.log(event.arguments);
  if (event.typeName === "Mutation") {
    console.log("mutation");
    // updateVotes(event);
  }
};
