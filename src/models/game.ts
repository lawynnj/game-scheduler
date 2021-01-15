import { ListGamesQuery, GameStatus } from "../API";
import { GraphQLResult } from "@aws-amplify/api";
import { GameType } from "../graphql/APITypes";
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

function mapListGamesQuery(
  listGamesQuery: GraphQLResult<ListGamesQuery>
): Partial<GameType>[] {
  return (
    listGamesQuery.data?.listGames?.items?.map(
      (game) =>
        ({
          id: game?.id,
          title: game?.title,
          status: game?.status,
          createdAt: game?.createdAt,
        } as Partial<GameType>)
    ) || []
  );
}

export { mapListGamesQuery as mapListGames };
