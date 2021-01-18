/* Amplify Params - DO NOT EDIT
	API_POKERGAME_GAMETABLE_ARN
	API_POKERGAME_GAMETABLE_NAME
	API_POKERGAME_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const region = process.env.REGION;
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({ region });
const gameTableName = process.env.GAME_TABLE_NAME;

const params = {
  TableName: gameTableName,
};

async function updateVotes(event, callback) {
  if (event.arguments && event.arguments.input) {
    const { id, buyInOptions, dateOptions, timeOptions } = event.arguments.input;
    params.Item = {
      id,
      buyInOptions,
      dateOptions,
      timeOptions,
    };

    try {
      /* code */
      console.log("sending put request");
      const res = await docClient.put(params);
      console.log(res);
    } catch (e) {
      console.log("Error");
      console.log(e);
    }
  } else {
    throw Error("Invalid arguments");
  }
}

exports.handler = async (event, _, callback) => {
  if (event.typeName === "Mutation") {
    updateVotes(event, callback);
  }
};
