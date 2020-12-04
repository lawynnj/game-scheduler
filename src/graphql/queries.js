/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getGame = /* GraphQL */ `
  query GetGame($id: ID!) {
    getGame(id: $id) {
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
export const listGames = /* GraphQL */ `
  query ListGames(
    $filter: ModelGameFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGames(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
        host {
          id
          username
          firstName
          lastName
          email
          image
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
