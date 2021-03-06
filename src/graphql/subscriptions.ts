/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($owner: String) {
    onCreateUser(owner: $owner) {
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
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($owner: String) {
    onUpdateUser(owner: $owner) {
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
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($owner: String) {
    onDeleteUser(owner: $owner) {
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
  }
`;
export const onCreateGame = /* GraphQL */ `
  subscription OnCreateGame {
    onCreateGame {
      id
      title
      type
      buyIn
      eventTime
      players
      buyInOptions {
        amount
        votes
        uuid
      }
      dateOptions {
        date
        votes
        uuid
      }
      timeOptions {
        time
        votes
        uuid
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
export const onUpdateGame = /* GraphQL */ `
  subscription OnUpdateGame {
    onUpdateGame {
      id
      title
      type
      buyIn
      eventTime
      players
      buyInOptions {
        amount
        votes
        uuid
      }
      dateOptions {
        date
        votes
        uuid
      }
      timeOptions {
        time
        votes
        uuid
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
export const onDeleteGame = /* GraphQL */ `
  subscription OnDeleteGame {
    onDeleteGame {
      id
      title
      type
      buyIn
      eventTime
      players
      buyInOptions {
        amount
        votes
        uuid
      }
      dateOptions {
        date
        votes
        uuid
      }
      timeOptions {
        time
        votes
        uuid
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
