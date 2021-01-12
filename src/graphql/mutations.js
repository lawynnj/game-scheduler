/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const updateGameStrict = /* GraphQL */ `
  mutation UpdateGameStrict($input: GameInput, $nextToken: String) {
    updateGameStrict(input: $input, nextToken: $nextToken) {
      id
      title
      type
      buyIn
      eventTime
      players {
        name
        email
      }
      buyInOptions {
        amount
        votes
      }
      dateOptions {
        date
        votes
      }
      timeOptions {
        time
        votes
      }
      ipAddresses
      status
      hostId
      createdAt
      updatedAt

      owner
    }
  }
`;
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
      createdAt
      updatedAt
      owner
      games {
        items {
          id
          title
          type
          buyIn
          eventTime
          ipAddresses
          status
          hostId
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
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
      createdAt
      updatedAt
      owner
      games {
        items {
          id
          title
          type
          buyIn
          eventTime
          ipAddresses
          status
          hostId
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
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
      createdAt
      updatedAt
      owner
      games {
        items {
          id
          title
          type
          buyIn
          eventTime
          ipAddresses
          status
          hostId
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
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
      players {
        name
        email
      }
      buyInOptions {
        amount
        votes
      }
      dateOptions {
        date
        votes
      }
      timeOptions {
        time
        votes
      }
      ipAddresses
      status
      hostId
      createdAt
      updatedAt
      owner
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
      players {
        name
        email
      }
      buyInOptions {
        amount
        votes
      }
      dateOptions {
        date
        votes
      }
      timeOptions {
        time
        votes
      }
      ipAddresses
      status
      hostId
      createdAt
      updatedAt
      owner
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
      players {
        name
        email
      }
      buyInOptions {
        amount
        votes
      }
      dateOptions {
        date
        votes
      }
      timeOptions {
        time
        votes
      }
      ipAddresses
      status
      hostId
      createdAt
      updatedAt
      host {
        id
        username
        firstName
        lastName
        email
        image
        createdAt
        updatedAt
        owner
        games {
          nextToken
        }
      }
      owner
    }
  }
`;
