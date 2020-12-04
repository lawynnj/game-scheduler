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
          createdOn
          ipAddresses
          status
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
          createdOn
          ipAddresses
          status
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
          createdOn
          ipAddresses
          status
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
export const onCreateGame = /* GraphQL */ `
  subscription OnCreateGame {
    onCreateGame {
      id
      hostId
      title
      type
      buyIn
      eventTime
      createdOn
      players {
        name
        email
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
    }
  }
`;
export const onUpdateGame = /* GraphQL */ `
  subscription OnUpdateGame {
    onUpdateGame {
      id
      hostId
      title
      type
      buyIn
      eventTime
      createdOn
      players {
        name
        email
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
    }
  }
`;
export const onDeleteGame = /* GraphQL */ `
  subscription OnDeleteGame {
    onDeleteGame {
      id
      hostId
      title
      type
      buyIn
      eventTime
      createdOn
      players {
        name
        email
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
    }
  }
`;
