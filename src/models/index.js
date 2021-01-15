// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const GameStatus = {
  "ACTIVE": "ACTIVE",
  "COMPLETED": "COMPLETED",
  "PENDING": "PENDING",
  "CANCELLED": "CANCELLED"
};

const { Game, User, Player, BuyInOptions, DateOptions, TimeOptions } = initSchema(schema);

export {
  Game,
  User,
  GameStatus,
  Player,
  BuyInOptions,
  DateOptions,
  TimeOptions
};