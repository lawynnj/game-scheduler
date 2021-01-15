import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  ListGamesQuery,
  UpdateGameMutation,
  UpdateGameMutationVariables,
  GameStatus,
} from "../API";
import * as mutations from "../graphql/mutations";
import * as queries from "../graphql/queries";
import IGame, { mapListGames } from "../models/game";
import callGraphQL from "../utils/callGraphQl";
import Games from "../components/Home/Games";

type HomeProps = {
  user: any;
};

export default function Home({ user }: HomeProps) {
  const [games, setGames] = useState<IGame[]>([]);
  const history = useHistory();

  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await callGraphQL<ListGamesQuery>(queries.listGames, {
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

  const handleMakeActive = async (game: IGame) => {
    try {
      const { data } = await callGraphQL<UpdateGameMutation>(
        mutations.updateGame,
        {
          input: {
            id: game.id,
            status: GameStatus.ACTIVE,
          },
        } as UpdateGameMutationVariables
      );

      const updatedGame = data?.updateGame;

      if (updatedGame) {
        const tmp: IGame = {
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
      <Button
        style={{ marginTop: 5 }}
        color="primary"
        variant="contained"
        onClick={() => history.push("/create")}
      >
        Create Game Settings
      </Button>
      {games ? (
        <Games handleMakeActive={handleMakeActive} games={games} />
      ) : (
        <p>You do not have any games</p>
      )}
    </Box>
  );
}
