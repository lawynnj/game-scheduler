# Intro

This is a work in progress application bootstrapped with `create-react-app` and `AWS Amplify`. I took up this project to familiarize myself with AWS technologies such as dynamodb, lambda, simple notification service, simple email service, event bridge, cloud watch events, graphQL, etc.


# Core Functionality

The purpose of the application is to allow a user to create a poll to schedule a `date, time and buy in amount` for a poker game. 

A user can create a poll, copy a shareable link and send it to other users to vote (who can optionally provide an email for notifications). After voting is finished the creator must "close" the poll.

Closing a poll will:
  1. send email notifications to voters about the date, time and buy in amount of the game (based on votes).
  2. create a scheduled Cloud Watch Rule that will trigger on the day of the game. The rule will trigger a Lambda function that sends email notification.


`Tech stack`: AWS DynamoDb, Cognito, Lambda (functions and layers), Simple notification service, Simple email service, Cloud watch events, GraphQL, AppSync, React and Typescript. 

# Code 

The `back-end` code is located in the `amplify` folder. Lambda functions are in [amplify/backend/function](https://github.com/lawynnj/game-scheduler/tree/master/amplify/backend/function) folder. The bulk of the code for a given lambda is in `amplify/backend/function/{SOME_LAMBDA_FN}/src/index.js`. A [lambda layer](https://github.com/lawynnj/game-scheduler/tree/master/amplify/backend/function/restApi) also exists to share some functionality across the lambdas.

Example: A lambda that is triggered by a DynamoDB stream and creates a cloud watch event rule [amplify/backend/function/EmailReminderCron/src/index.js](https://github.com/lawynnj/game-scheduler/blob/master/amplify/backend/function/EmailReminderCron/src/index.js)

The `front-end` code is located in the [src](https://github.com/lawynnj/game-scheduler/tree/master/src) folder.


# Architecture
![alt text](https://raw.githubusercontent.com/lawynnj/game-scheduler/master/Poker%20game%20settings%20-%20SD2.0%20-2.png)

Status: The majority of this has been implemented except for the Simple queue service functionality.
