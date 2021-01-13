import { ListGamesQuery, GameStatus } from "../API";
import { GraphQLResult } from "@aws-amplify/api";

interface IGame {
  id: string;
  title: string;
  status: GameStatus | null;
  createdAt: string;
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
