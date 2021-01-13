import { ListGamesQuery, GameStatus } from "../API";
import { GraphQLResult } from "@aws-amplify/api";

interface IGame {
  id: string;
  title: string;
  status: GameStatus | null;
  createdAt: string;
}

export interface DateOptions {
  date: string;
  votes: number;
}
export interface TimeOptions {
  time: string;
  votes: number;
}
export interface BuyInOptions {
  amount: number;
  votes: number;
}

export interface IGame2 {
  id: string;
  title: string;
  status: GameStatus | null;
  type: string;
  buyIn: string;
  eventTime: string;
  buyInOptions: BuyInOptions[];
  dateOptions: DateOptions[];
  timeOptions: TimeOptions[];
  hostId: string;
  createdAt: string;
  updatedAt: string;
}

function mapListGamesQuery(
  listTodosQuery: GraphQLResult<ListGamesQuery>
): IGame[] {
  return (
    listTodosQuery.data?.listGames?.items?.map(
      (todo) =>
        ({
          id: todo?.id,
          title: todo?.title,
          status: todo?.status,
          createdAt: todo?.createdAt,
        } as IGame)
    ) || []
  );
}

export default IGame;
export { mapListGamesQuery as mapListGames };
