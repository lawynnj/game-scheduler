import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum GameStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  CANCELLED = "CANCELLED"
}

export declare class Player {
  readonly name: string;
  readonly email?: string;
  constructor(init: ModelInit<Player>);
}

export declare class BuyInOptions {
  readonly amount: number;
  readonly votes: number;
  constructor(init: ModelInit<BuyInOptions>);
}

export declare class DateOptions {
  readonly date: string;
  readonly votes: number;
  constructor(init: ModelInit<DateOptions>);
}

export declare class TimeOptions {
  readonly time: string;
  readonly votes: number;
  constructor(init: ModelInit<TimeOptions>);
}

export declare class Game {
  readonly id: string;
  readonly title: string;
  readonly type?: string;
  readonly buyIn?: number;
  readonly eventTime?: string;
  readonly players?: (Player | null)[];
  readonly buyInOptions?: (BuyInOptions | null)[];
  readonly dateOptions?: (DateOptions | null)[];
  readonly timeOptions?: (TimeOptions | null)[];
  readonly ipAddresses?: (string | null)[];
  readonly status?: GameStatus | keyof typeof GameStatus;
  readonly hostId: string;
  readonly host: User;
  constructor(init: ModelInit<Game>);
  static copyOf(source: Game, mutator: (draft: MutableModel<Game>) => MutableModel<Game> | void): Game;
}

export declare class User {
  readonly id: string;
  readonly username?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly email?: string;
  readonly image?: string;
  readonly games?: (Game | null)[];
  constructor(init: ModelInit<User>);
  static copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}