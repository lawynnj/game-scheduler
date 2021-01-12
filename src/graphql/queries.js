/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
        createdAt
        updatedAt
        owner
        games {
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const getGame = /* GraphQL */ `
  query GetGame($id: ID!) {
    getGame(id: $id) {
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
      nextToken
    }
  }
`;
