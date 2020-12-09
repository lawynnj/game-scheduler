/* Amplify Params - DO NOT EDIT
	API_POKERGAME_GRAPHQLAPIIDOUTPUT
	API_POKERGAME_USERTABLE_ARN
	API_POKERGAME_USERTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const AWS = require("aws-sdk");
const ARN = process.env.AWS_CWE_ARN_POKER_GAME;
const CWE_NAME = process.env.CWE_NAME || "Poker-scheduler: Send emails";
const CWE_DESCRIPTION =
  process.env.CWE_DESCRIPTION || "Send emails notifications for a game";
const CWE_RULE_TAG_KEY = process.env.CWE_RULE_TAG_KEY || "Poker scheduler game";
const CWE_RULE_TAG_VALUE =
  process.env.CWE_RULE_TAG_VALUE || "The app poker game scheduler";
const LAMBDA_ARN = process.env.CWE_RULE_TAG_VALUE;
AWS.config.update({ region: process.env.AWS_REGION });

exports.handler = async (event, context) => {
  //eslint-disable-line
  console.log("EVENT\n" + JSON.stringify(event, null, 2));

  // map DDB objects to JSON
  const modifiedGames = event.Records.map((record) => {
    return {
      newImage: AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage),
      oldImage: AWS.DynamoDB.Converter.unmarshall(record.dynamodb.OldImage),
    };
  });

  const cwRequests = [];
  const cwe = new AWS.CloudWatchEvents();

  for (const game of modifiedGames) {
    const { oldImage, newImage } = game;

    // Create CloudWatch event when game status is "completed"
    if (
      newImage.status === "COMPLETED" &&
      oldImage.status !== newImage.status
    ) {
      // create cloudWatchEvent rule
      const ruleParams = {
        Name: CWE_NAME + newImage.id /* required */,
        Description: CWE_DESCRIPTION,
        RoleArn: ARN,
        ScheduleExpression: "cron(0 13 * * ? *)",
        State: "ENABLED",
        Targets: [{}],
        Tags: [
          {
            Key: CWE_RULE_TAG_KEY /* required */,
            Value: CWE_RULE_TAG_VALUE /* required */,
          },
          /* more items */
        ],
      };
      const ruleRes = await cwe.putRule(ruleParams).promise();

      // put targets
      const targetParams = {
        Rule: CWE_NAME + +newImage.id /* required */,
        Targets: [
          /* required */
          {
            Arn: LAMBDA_ARN /* required */,
            Id: "STRING_VALUE" /* required */,
            Input: JSON.stringify({ gameId: newImage.id }),
          },
          /* more items */
        ],
      };
      cwe.putTargets(targetParams, function (err, data) {
        if (err) console.log(err, err.stack);
        // an error occurred
        else console.log(data); // successful response
      });
      const ptRes = await cwe.putTargets().promise();

      // update the lambda to subscribe to event
      const lambda = AWS.Lambda();
      const permissionParams = {
        FunctionName: "cloudwatch-trigger",
        StatementId: timestamp.toString(),
        Action: "lambda:InvokeFunction",
        Principal: "events.amazonaws.com",
        SourceArn: ruleRes.arn,
      };
      lambda.addPermission(permissionParams);
    }
  }

  try {
    console.log("Request: Creating CloudWatch event...");
    await Promise.all(cwRequests);
    console.log("Success: Event Created");
  } catch (error) {
    console.log("Error: Event not created", error);
  }
};
