import { DeepOmit } from "./DeepOmit";
import { GetGameQuery } from "../API";

export type GameType = DeepOmit<
  Exclude<GetGameQuery["getGame"], null>,
  "__typename"
>;
