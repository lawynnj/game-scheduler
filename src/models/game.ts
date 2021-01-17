import { ListGamesQuery } from "../API";
import { GameType } from "../graphql/APITypes";

export interface DateOptions {
  date: string;
  votes: number;
  uuid: string;
}
export interface TimeOptions {
  time: string;
  votes: number;
  uuid: string;
}
export interface BuyInOptions {
  amount: number;
  votes: number;
  uuid: string;
}

function mapListGamesQuery(listGamesQuery: ListGamesQuery): Partial<GameType>[] {
  return (
    listGamesQuery.listGames?.items?.map(
      (game) =>
        ({
          id: game?.id,
          title: game?.title,
          status: game?.status,
          createdAt: game?.createdAt,
        } as Partial<GameType>),
    ) || []
  );
}

export { mapListGamesQuery as mapListGames };
