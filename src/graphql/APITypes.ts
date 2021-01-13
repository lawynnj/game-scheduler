import { DeepOmit } from "./DeepOmit";
import { GetGameQuery, ListGamesQuery } from "../API";

export type GameType = DeepOmit<
  Exclude<GetGameQuery["getGame"], null>,
  "__typename"
>;
