import React, { useEffect, useState } from "react";
import {
  DeleteGameMutation,
  GameStatus,
  ListGamesQuery,
  UpdateGameMutation,
  UpdateGameMutationVariables,
} from "../API";
import Games from "../components/Home/Games";
import { GameType } from "../graphql/APITypes";
import * as mutations from "../graphql/mutations";
import * as queries from "../graphql/queries";
import { mapListGames } from "../models/game";
import { gqlOp } from "../utils/gqlOp";

type HomeProps = {
  // eslint-disable-next-line
  user: any;
};

export default function Home(props: HomeProps): JSX.Element {
  const { user } = props;
  const [games, setGames] = useState<Partial<GameType>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await gqlOp<ListGamesQuery>(queries.listGames, {
          filter: {
            hostId: {
              eq: user.attributes.sub,
            },
          },
        });

        setGames(mapListGames(res));
      } catch (error) {
        alert("Something went wrong!");
      } finally {
        setLoading(false);
      }
    }
    fetchGames();
  }, [user.attributes.sub]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      try {
        await gqlOp<DeleteGameMutation>(mutations.deleteGame, {
          input: {
            id,
          },
        });
        const filtered: Partial<GameType>[] = games.filter((game) => game.id !== id);
        setGames(filtered);
        alert("Deleted");
      } catch (error) {
        alert("Something went wrong!");
      }
    }
  };

  const updateGameStatus = async (id: string, status: string) => {
    try {
      const data = await gqlOp<UpdateGameMutation>(mutations.updateGame, {
        input: {
          id: id,
          status: status,
        },
      } as UpdateGameMutationVariables);

      const updatedGame = data?.updateGame;

      if (updatedGame) {
        const tmp: Partial<GameType> = {
          id: updatedGame.id,
          status: updatedGame.status,
          title: updatedGame.title,
          createdAt: updatedGame.createdAt,
        };
        const filtered = games.filter((item) => item.id !== id) || [];
        setGames([...filtered, tmp]);
      }
    } catch (error) {
      alert("Something went wrong!");
    }
  };

  const handleMakeActive = (game: GameType) => {
    updateGameStatus(game.id, GameStatus.ACTIVE);
  };

  const handleClosePoll = (game: GameType) => {
    updateGameStatus(game.id, GameStatus.COMPLETED);
  };

  return (
    <Games
      onDelete={handleDelete}
      onMakeActive={handleMakeActive}
      onClosePoll={handleClosePoll}
      games={games}
      loading={loading}
    />
  );
}
