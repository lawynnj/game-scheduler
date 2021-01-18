/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type GameInput = {
  id?: string | null,
  hostId?: string | null,
  title?: string | null,
  type?: string | null,
  buyIn?: number | null,
  eventTime?: string | null,
  players?: Array< PlayerInput | null > | null,
  buyInOptions?: Array< BuyInOptionsInput | null > | null,
  dateOptions?: Array< DateOptionsInput | null > | null,
  timeOptions?: Array< TimeOptionsInput | null > | null,
  ipAddresses?: Array< string | null > | null,
  status?: GameStatus | null,
};

export type PlayerInput = {
  name: string,
  email?: string | null,
  uuid: string,
};

export type BuyInOptionsInput = {
  amount: number,
  votes: number,
  uuid: string,
};

export type DateOptionsInput = {
  date: string,
  votes: number,
  uuid: string,
};

export type TimeOptionsInput = {
  time: string,
  votes: number,
  uuid: string,
};

export enum GameStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
}


export type GameVote = {
  id: string,
  hostId: string,
  buyInOptions: Array< BuyInOptionsInput | null >,
  dateOptions: Array< DateOptionsInput | null >,
  timeOptions: Array< TimeOptionsInput | null >,
};

export type CreateUserInput = {
  id?: string | null,
  username?: string | null,
  firstName?: string | null,
  lastName?: string | null,
  email?: string | null,
  image?: string | null,
};

export type ModelUserConditionInput = {
  username?: ModelStringInput | null,
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  email?: ModelStringInput | null,
  image?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type UpdateUserInput = {
  id: string,
  username?: string | null,
  firstName?: string | null,
  lastName?: string | null,
  email?: string | null,
  image?: string | null,
};

export type DeleteUserInput = {
  id?: string | null,
};

export type CreateGameInput = {
  id?: string | null,
  title: string,
  type?: string | null,
  buyIn?: number | null,
  eventTime?: string | null,
  players?: Array< PlayerInput | null > | null,
  buyInOptions?: Array< BuyInOptionsInput | null > | null,
  dateOptions?: Array< DateOptionsInput | null > | null,
  timeOptions?: Array< TimeOptionsInput | null > | null,
  ipAddresses?: Array< string | null > | null,
  status?: GameStatus | null,
  hostId: string,
};

export type ModelGameConditionInput = {
  title?: ModelStringInput | null,
  type?: ModelStringInput | null,
  buyIn?: ModelIntInput | null,
  eventTime?: ModelStringInput | null,
  ipAddresses?: ModelStringInput | null,
  status?: ModelGameStatusInput | null,
  hostId?: ModelIDInput | null,
  and?: Array< ModelGameConditionInput | null > | null,
  or?: Array< ModelGameConditionInput | null > | null,
  not?: ModelGameConditionInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelGameStatusInput = {
  eq?: GameStatus | null,
  ne?: GameStatus | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type UpdateGameInput = {
  id: string,
  title?: string | null,
  type?: string | null,
  buyIn?: number | null,
  eventTime?: string | null,
  players?: Array< PlayerInput | null > | null,
  buyInOptions?: Array< BuyInOptionsInput | null > | null,
  dateOptions?: Array< DateOptionsInput | null > | null,
  timeOptions?: Array< TimeOptionsInput | null > | null,
  ipAddresses?: Array< string | null > | null,
  status?: GameStatus | null,
  hostId?: string | null,
};

export type DeleteGameInput = {
  id?: string | null,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  username?: ModelStringInput | null,
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  email?: ModelStringInput | null,
  image?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelGameFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  type?: ModelStringInput | null,
  buyIn?: ModelIntInput | null,
  eventTime?: ModelStringInput | null,
  ipAddresses?: ModelStringInput | null,
  status?: ModelGameStatusInput | null,
  hostId?: ModelIDInput | null,
  and?: Array< ModelGameFilterInput | null > | null,
  or?: Array< ModelGameFilterInput | null > | null,
  not?: ModelGameFilterInput | null,
};

export type UpdateGameStrictMutationVariables = {
  input?: GameInput | null,
  nextToken?: string | null,
};

export type UpdateGameStrictMutation = {
  updateGameStrict:  {
    __typename: "Game",
    id: string,
    title: string,
    type: string | null,
    buyIn: number | null,
    eventTime: string | null,
    players:  Array< {
      __typename: "Player",
      name: string,
      email: string | null,
      uuid: string,
    } | null > | null,
    buyInOptions:  Array< {
      __typename: "BuyInOptions",
      amount: number,
      votes: number,
      uuid: string,
    } | null > | null,
    dateOptions:  Array< {
      __typename: "DateOptions",
      date: string,
      votes: number,
      uuid: string,
    } | null > | null,
    timeOptions:  Array< {
      __typename: "TimeOptions",
      time: string,
      votes: number,
      uuid: string,
    } | null > | null,
    ipAddresses: Array< string | null > | null,
    status: GameStatus | null,
    hostId: string,
    host:  {
      __typename: "User",
      id: string,
      username: string | null,
      firstName: string | null,
      lastName: string | null,
      email: string | null,
      image: string | null,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    },
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type UpdateGameVoteMutationVariables = {
  input?: GameVote | null,
};

export type UpdateGameVoteMutation = {
  updateGameVote:  {
    __typename: "Game",
    id: string,
    title: string,
    type: string | null,
    buyIn: number | null,
    eventTime: string | null,
    players:  Array< {
      __typename: "Player",
      name: string,
      email: string | null,
      uuid: string,
    } | null > | null,
    buyInOptions:  Array< {
      __typename: "BuyInOptions",
      amount: number,
      votes: number,
      uuid: string,
    } | null > | null,
    dateOptions:  Array< {
      __typename: "DateOptions",
      date: string,
      votes: number,
      uuid: string,
    } | null > | null,
    timeOptions:  Array< {
      __typename: "TimeOptions",
      time: string,
      votes: number,
      uuid: string,
    } | null > | null,
    ipAddresses: Array< string | null > | null,
    status: GameStatus | null,
    hostId: string,
    host:  {
      __typename: "User",
      id: string,
      username: string | null,
      firstName: string | null,
      lastName: string | null,
      email: string | null,
      image: string | null,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    },
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser:  {
    __typename: "User",
    id: string,
    username: string | null,
    firstName: string | null,
    lastName: string | null,
    email: string | null,
    image: string | null,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
    games:  {
      __typename: "ModelGameConnection",
      nextToken: string | null,
    } | null,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser:  {
    __typename: "User",
    id: string,
    username: string | null,
    firstName: string | null,
    lastName: string | null,
    email: string | null,
    image: string | null,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
    games:  {
      __typename: "ModelGameConnection",
      nextToken: string | null,
    } | null,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser:  {
    __typename: "User",
    id: string,
    username: string | null,
    firstName: string | null,
    lastName: string | null,
    email: string | null,
    image: string | null,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
    games:  {
      __typename: "ModelGameConnection",
      nextToken: string | null,
    } | null,
  } | null,
};

export type CreateGameMutationVariables = {
  input: CreateGameInput,
  condition?: ModelGameConditionInput | null,
};

export type CreateGameMutation = {
  createGame:  {
    __typename: "Game",
    id: string,
    title: string,
    type: string | null,
    buyIn: number | null,
    eventTime: string | null,
    players:  Array< {
      __typename: "Player",
      name: string,
      email: string | null,
      uuid: string,
    } | null > | null,
    buyInOptions:  Array< {
      __typename: "BuyInOptions",
      amount: number,
      votes: number,
      uuid: string,
    } | null > | null,
    dateOptions:  Array< {
      __typename: "DateOptions",
      date: string,
      votes: number,
      uuid: string,
    } | null > | null,
    timeOptions:  Array< {
      __typename: "TimeOptions",
      time: string,
      votes: number,
      uuid: string,
    } | null > | null,
    ipAddresses: Array< string | null > | null,
    status: GameStatus | null,
    hostId: string,
    host:  {
      __typename: "User",
      id: string,
      username: string | null,
      firstName: string | null,
      lastName: string | null,
      email: string | null,
      image: string | null,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    },
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type UpdateGameMutationVariables = {
  input: UpdateGameInput,
  condition?: ModelGameConditionInput | null,
};

export type UpdateGameMutation = {
  updateGame:  {
    __typename: "Game",
    id: string,
    title: string,
    type: string | null,
    buyIn: number | null,
    eventTime: string | null,
    players:  Array< {
      __typename: "Player",
      name: string,
      email: string | null,
      uuid: string,
    } | null > | null,
    buyInOptions:  Array< {
      __typename: "BuyInOptions",
      amount: number,
      votes: number,
      uuid: string,
    } | null > | null,
    dateOptions:  Array< {
      __typename: "DateOptions",
      date: string,
      votes: number,
      uuid: string,
    } | null > | null,
    timeOptions:  Array< {
      __typename: "TimeOptions",
      time: string,
      votes: number,
      uuid: string,
    } | null > | null,
    ipAddresses: Array< string | null > | null,
    status: GameStatus | null,
    hostId: string,
    host:  {
      __typename: "User",
      id: string,
      username: string | null,
      firstName: string | null,
      lastName: string | null,
      email: string | null,
      image: string | null,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    },
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type DeleteGameMutationVariables = {
  input: DeleteGameInput,
  condition?: ModelGameConditionInput | null,
};

export type DeleteGameMutation = {
  deleteGame:  {
    __typename: "Game",
    id: string,
    title: string,
    type: string | null,
    buyIn: number | null,
    eventTime: string | null,
    players:  Array< {
      __typename: "Player",
      name: string,
      email: string | null,
      uuid: string,
    } | null > | null,
    buyInOptions:  Array< {
      __typename: "BuyInOptions",
      amount: number,
      votes: number,
      uuid: string,
    } | null > | null,
    dateOptions:  Array< {
      __typename: "DateOptions",
      date: string,
      votes: number,
      uuid: string,
    } | null > | null,
    timeOptions:  Array< {
      __typename: "TimeOptions",
      time: string,
      votes: number,
      uuid: string,
    } | null > | null,
    ipAddresses: Array< string | null > | null,
    status: GameStatus | null,
    hostId: string,
    host:  {
      __typename: "User",
      id: string,
      username: string | null,
      firstName: string | null,
      lastName: string | null,
      email: string | null,
      image: string | null,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    },
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser:  {
    __typename: "User",
    id: string,
    username: string | null,
    firstName: string | null,
    lastName: string | null,
    email: string | null,
    image: string | null,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
    games:  {
      __typename: "ModelGameConnection",
      nextToken: string | null,
    } | null,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      username: string | null,
      firstName: string | null,
      lastName: string | null,
      email: string | null,
      image: string | null,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetGameQueryVariables = {
  id: string,
};

export type GetGameQuery = {
  getGame:  {
    __typename: "Game",
    id: string,
    title: string,
    type: string | null,
    buyIn: number | null,
    eventTime: string | null,
    players:  Array< {
      __typename: "Player",
      name: string,
      email: string | null,
      uuid: string,
    } | null > | null,
    buyInOptions:  Array< {
      __typename: "BuyInOptions",
      amount: number,
      votes: number,
      uuid: string,
    } | null > | null,
    dateOptions:  Array< {
      __typename: "DateOptions",
      date: string,
      votes: number,
      uuid: string,
    } | null > | null,
    timeOptions:  Array< {
      __typename: "TimeOptions",
      time: string,
      votes: number,
      uuid: string,
    } | null > | null,
    ipAddresses: Array< string | null > | null,
    status: GameStatus | null,
    hostId: string,
    host:  {
      __typename: "User",
      id: string,
      username: string | null,
      firstName: string | null,
      lastName: string | null,
      email: string | null,
      image: string | null,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    },
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type ListGamesQueryVariables = {
  filter?: ModelGameFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGamesQuery = {
  listGames:  {
    __typename: "ModelGameConnection",
    items:  Array< {
      __typename: "Game",
      id: string,
      title: string,
      type: string | null,
      buyIn: number | null,
      eventTime: string | null,
      ipAddresses: Array< string | null > | null,
      status: GameStatus | null,
      hostId: string,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  owner?: string | null,
};

export type OnCreateUserSubscription = {
  onCreateUser:  {
    __typename: "User",
    id: string,
    username: string | null,
    firstName: string | null,
    lastName: string | null,
    email: string | null,
    image: string | null,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
    games:  {
      __typename: "ModelGameConnection",
      nextToken: string | null,
    } | null,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  owner?: string | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser:  {
    __typename: "User",
    id: string,
    username: string | null,
    firstName: string | null,
    lastName: string | null,
    email: string | null,
    image: string | null,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
    games:  {
      __typename: "ModelGameConnection",
      nextToken: string | null,
    } | null,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  owner?: string | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser:  {
    __typename: "User",
    id: string,
    username: string | null,
    firstName: string | null,
    lastName: string | null,
    email: string | null,
    image: string | null,
    createdAt: string,
    updatedAt: string,
    owner: string | null,
    games:  {
      __typename: "ModelGameConnection",
      nextToken: string | null,
    } | null,
  } | null,
};

export type OnCreateGameSubscription = {
  onCreateGame:  {
    __typename: "Game",
    id: string,
    title: string,
    type: string | null,
    buyIn: number | null,
    eventTime: string | null,
    players:  Array< {
      __typename: "Player",
      name: string,
      email: string | null,
      uuid: string,
    } | null > | null,
    buyInOptions:  Array< {
      __typename: "BuyInOptions",
      amount: number,
      votes: number,
      uuid: string,
    } | null > | null,
    dateOptions:  Array< {
      __typename: "DateOptions",
      date: string,
      votes: number,
      uuid: string,
    } | null > | null,
    timeOptions:  Array< {
      __typename: "TimeOptions",
      time: string,
      votes: number,
      uuid: string,
    } | null > | null,
    ipAddresses: Array< string | null > | null,
    status: GameStatus | null,
    hostId: string,
    host:  {
      __typename: "User",
      id: string,
      username: string | null,
      firstName: string | null,
      lastName: string | null,
      email: string | null,
      image: string | null,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    },
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type OnUpdateGameSubscription = {
  onUpdateGame:  {
    __typename: "Game",
    id: string,
    title: string,
    type: string | null,
    buyIn: number | null,
    eventTime: string | null,
    players:  Array< {
      __typename: "Player",
      name: string,
      email: string | null,
      uuid: string,
    } | null > | null,
    buyInOptions:  Array< {
      __typename: "BuyInOptions",
      amount: number,
      votes: number,
      uuid: string,
    } | null > | null,
    dateOptions:  Array< {
      __typename: "DateOptions",
      date: string,
      votes: number,
      uuid: string,
    } | null > | null,
    timeOptions:  Array< {
      __typename: "TimeOptions",
      time: string,
      votes: number,
      uuid: string,
    } | null > | null,
    ipAddresses: Array< string | null > | null,
    status: GameStatus | null,
    hostId: string,
    host:  {
      __typename: "User",
      id: string,
      username: string | null,
      firstName: string | null,
      lastName: string | null,
      email: string | null,
      image: string | null,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    },
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};

export type OnDeleteGameSubscription = {
  onDeleteGame:  {
    __typename: "Game",
    id: string,
    title: string,
    type: string | null,
    buyIn: number | null,
    eventTime: string | null,
    players:  Array< {
      __typename: "Player",
      name: string,
      email: string | null,
      uuid: string,
    } | null > | null,
    buyInOptions:  Array< {
      __typename: "BuyInOptions",
      amount: number,
      votes: number,
      uuid: string,
    } | null > | null,
    dateOptions:  Array< {
      __typename: "DateOptions",
      date: string,
      votes: number,
      uuid: string,
    } | null > | null,
    timeOptions:  Array< {
      __typename: "TimeOptions",
      time: string,
      votes: number,
      uuid: string,
    } | null > | null,
    ipAddresses: Array< string | null > | null,
    status: GameStatus | null,
    hostId: string,
    host:  {
      __typename: "User",
      id: string,
      username: string | null,
      firstName: string | null,
      lastName: string | null,
      email: string | null,
      image: string | null,
      createdAt: string,
      updatedAt: string,
      owner: string | null,
    },
    createdAt: string,
    updatedAt: string,
    owner: string | null,
  } | null,
};
