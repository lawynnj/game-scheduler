/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      username
      firstName
      lastName
      email
      image
      games {
        items {
          id
          title
          type
          buyIn
          eventTime
          createdOn
          cancelled
          players
          dateOptions
          timeOptions
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      username
      firstName
      lastName
      email
      image
      games {
        items {
          id
          title
          type
          buyIn
          eventTime
          createdOn
          cancelled
          players
          dateOptions
          timeOptions
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      username
      firstName
      lastName
      email
      image
      games {
        items {
          id
          title
          type
          buyIn
          eventTime
          createdOn
          cancelled
          players
          dateOptions
          timeOptions
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const createGame = /* GraphQL */ `
  mutation CreateGame(
    $input: CreateGameInput!
    $condition: ModelGameConditionInput
  ) {
    createGame(input: $input, condition: $condition) {
      id
      title
      type
      buyIn
      eventTime
      createdOn
      cancelled
      players
      dateOptions
      timeOptions
      host {
        id
        username
        firstName
        lastName
        email
        image
        games {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateGame = /* GraphQL */ `
  mutation UpdateGame(
    $input: UpdateGameInput!
    $condition: ModelGameConditionInput
  ) {
    updateGame(input: $input, condition: $condition) {
      id
      title
      type
      buyIn
      eventTime
      createdOn
      cancelled
      players
      dateOptions
      timeOptions
      host {
        id
        username
        firstName
        lastName
        email
        image
        games {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteGame = /* GraphQL */ `
  mutation DeleteGame(
    $input: DeleteGameInput!
    $condition: ModelGameConditionInput
  ) {
    deleteGame(input: $input, condition: $condition) {
      id
      title
      type
      buyIn
      eventTime
      createdOn
      cancelled
      players
      dateOptions
      timeOptions
      host {
        id
        username
        firstName
        lastName
        email
        image
        games {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
