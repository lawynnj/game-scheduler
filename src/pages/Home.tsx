import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
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
  const history = useHistory();

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

  const handleMakeActive = async (game: GameType) => {
    try {
      const data = await gqlOp<UpdateGameMutation>(mutations.updateGame, {
        input: {
          id: game.id,
          status: GameStatus.ACTIVE,
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
        const filtered = games.filter((item) => item.id !== game.id) || [];
        setGames([...filtered, tmp]);
      }
    } catch (error) {
      alert("Something went wrong!");
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h5">Hi {user.username},</Typography>
      <Button style={{ marginTop: 5 }} color="primary" variant="contained" onClick={() => history.push("/create")}>
        Create Game Settings
      </Button>
      <Games onDelete={handleDelete} onMakeActive={handleMakeActive} games={games} />
    </Box>
  );
}
