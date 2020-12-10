/* Amplify Params - DO NOT EDIT
	API_POKERGAME_GRAPHQLAPIIDOUTPUT
	API_POKERGAME_USERTABLE_ARN
	API_POKERGAME_USERTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const AWS = require("aws-sdk");
const ARN = process.env.AWS_CWE_ARN_POKER_GAME;
const CWE_NAME = process.env.CWE_NAME || "poker-scheduler-email-reminder";
const CWE_DESCRIPTION =
  process.env.CWE_DESCRIPTION || "Send emails notifications for a game";
const CWE_RULE_TAG_KEY = process.env.CWE_RULE_TAG_KEY || "Poker scheduler game";
const CWE_RULE_TAG_VALUE =
  process.env.CWE_RULE_TAG_VALUE || "The app poker game scheduler";
const LAMBDA_ARN = process.env.LAMBDA_ARN_POKER_GAME;
AWS.config.update({ region: process.env.AWS_REGION });

exports.handler = async (event, context) => {
  //eslint-disable-line
  console.log("EVENT\n" + JSON.stringify(event, null, 2));

  // map DDB objects to JSON
  // filter for modified event
  const modifiedGames = event.Records.map((record) => {
    return {
      newImage: AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage),
      oldImage: AWS.DynamoDB.Converter.unmarshall(record.dynamodb.OldImage),
    };
  });

  // const cwRequests = [];
  const cwe = new AWS.CloudWatchEvents();

  for (const game of modifiedGames) {
    const { oldImage, newImage } = game;

    // Create CloudWatch event when game status is "completed"
    // if (newImage.status === "COMPLETED" && oldImage.status !== newImage.status) {
    // create cloudWatchEvent rule

    try {
      // cron(Minutes Hours Day-of-month Month Day-of-week Year)
      const schedule = "cron(0 5 12 12 ? 2020)";

      const ruleParams = {
        Name: CWE_NAME + "-" + newImage.id /* required */,
        Description: CWE_DESCRIPTION,
        RoleArn: ARN,
        ScheduleExpression: schedule,
        State: "ENABLED",
      };
      console.log("Preparing rule creation...");
      await cwe.putRule(ruleParams).promise();

      // add permission to lambda
      const lambda = new AWS.Lambda();
      var lambdaPermission = {
        FunctionName: LAMBDA_ARN,
        StatementId: CWE_NAME + "-" + newImage.id,
        Action: "lambda:*",
        Principal: "events.amazonaws.com",
      };

      console.log("Updating lambda permission...", lambdaPermission);
      const resLambda = await lambda.addPermission(lambdaPermission).promise();
      console.log("Perm. response", resLambda);

      const targetParams = {
        Rule: CWE_NAME + "-" + newImage.id /* required */,
        Targets: [
          {
            Arn: LAMBDA_ARN /* required */,
            Id: "1" /* required */,
            Input: JSON.stringify({ gameId: newImage.id }),
          },
        ],
      };
      console.log("Set targets", targetParams);
      const res = await cwe.putTargets(targetParams).promise();
      console.log("Target resoibse", res);
    } catch (error) {
      console.log("Error", error);
    }

    //   // put targets

    //   const ptRes = await cwe.putTargets().promise();

    //   // update the lambda to subscribe to event
    //   const lambda = AWS.Lambda();
    //   const permissionParams = {
    //     FunctionName: "cloudwatch-trigger",
    //     StatementId: timestamp.toString(),
    //     Action: "lambda:InvokeFunction",
    //     Principal: "events.amazonaws.com",
    //     SourceArn: ruleRes.arn,
    //   };
    //   lambda.addPermission(permissionParams);
  }
  // }
  // }
};
