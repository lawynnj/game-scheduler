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
export const onCreateGame = /* GraphQL */ `
  subscription OnCreateGame {
    onCreateGame {
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
export const onUpdateGame = /* GraphQL */ `
  subscription OnUpdateGame {
    onUpdateGame {
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
export const onDeleteGame = /* GraphQL */ `
  subscription OnDeleteGame {
    onDeleteGame {
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
