/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
      id
      username
      firstName
      lastName
      email
      image
      games {
        items {
          id
          hostId
          title
          type
          buyIn
          eventTime
          ipAddresses
          status
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
      id
      username
      firstName
      lastName
      email
      image
      games {
        items {
          id
          hostId
          title
          type
          buyIn
          eventTime
          ipAddresses
          status
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
      id
      username
      firstName
      lastName
      email
      image
      games {
        items {
          id
          hostId
          title
          type
          buyIn
          eventTime
          ipAddresses
          status
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateGame = /* GraphQL */ `
  subscription OnCreateGame($owner: String!) {
    onCreateGame(owner: $owner) {
      id
      hostId
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
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateGame = /* GraphQL */ `
  subscription OnUpdateGame($owner: String!) {
    onUpdateGame(owner: $owner) {
      id
      hostId
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
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteGame = /* GraphQL */ `
  subscription OnDeleteGame($owner: String!) {
    onDeleteGame(owner: $owner) {
      id
      hostId
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
      createdAt
      updatedAt
      owner
    }
  }
`;
