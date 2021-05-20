# Intro

Game Scheduler is a full-stack web application bootstrapped with [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html) and [AWS Amplify](https://aws.amazon.com/amplify). I took up this project to familiarize myself with AWS technologies such as dynamodb, lambda, simple notification service, simple email service, event bridge, cloud watch events, graphQL, etc.


# Core Functionality

The application allows a user to create a poll to schedule a `date, time and buy in amount` for a poker game. 

A user can create a poll, copy a shareable link and send it to other users to vote (who can optionally provide an email for notifications). After voting is finished the creator must "close" the poll.

Closing a poll will:
  1. Send email notifications to voters about the date, time and buy in amount of the game (based on votes).
  2. Create a scheduled Cloud Watch Rule that will execute on the day of the game. The rule will trigger a Lambda function that sends an email notification to anyone who provided an e-mail.


`Tech stack`: AWS DynamoDB, Cognito, Lambda (functions and layers), Simple notification service, Simple email service, Cloud watch events, GraphQL, AppSync, React and Typescript. 

# Source Code 

The code for the `back-end` services is located in the `amplify` folder. Lambda functions are in the [amplify/backend/function](https://github.com/lawynnj/game-scheduler/tree/master/amplify/backend/function) folder. The bulk of the code for a given lambda is in `amplify/backend/function/{SOME_LAMBDA_FN}/src/index.js`. A [lambda layer](https://github.com/lawynnj/game-scheduler/tree/master/amplify/backend/function/restApi) also exists to share some functionality across the lambdas.

Example: A lambda that is triggered by a DynamoDB stream and creates a cloud watch event rule [amplify/backend/function/EmailReminderCron/src/index.js](https://github.com/lawynnj/game-scheduler/blob/master/amplify/backend/function/EmailReminderCron/src/index.js)

The `front-end` code is located in the [src](https://github.com/lawynnj/game-scheduler/tree/master/src) folder.


# Architecture
![alt text](https://raw.githubusercontent.com/lawynnj/game-scheduler/master/architecture.png)

Development Status: All of functionality (aside from SQS and the SQS lambda processor) has been developed. 
