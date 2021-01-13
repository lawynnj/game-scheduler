import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import format from "date-fns/format";
import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
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

type GameListItem = {
  date?: Date;
  to: string;
  title: string;
};

const RenderItemLink = ({ date, to, title }: GameListItem) => {
  const history = useHistory();
  const d = date
    ? `Created on ${format(date, "EEE MMM dd yyyy 'at' h:m aaaa")}`
    : "";

  return (
    <ListItem button onClick={() => history.push(to)}>
      <ListItemText primary={title} secondary={d} />
    </ListItem>
  );
};

type GamesProps = {
  games: IGame[];
  handleMakeActive: (Game: IGame) => void;
};

const Games = ({ games, handleMakeActive }: GamesProps) => {
  return (
    <>
      <p>Draft Games:</p>
      <List>
        {games
          .filter((game) => game.status === GameStatus.PENDING)
          .map((game) => {
            const date = new Date(game.createdAt);
            return (
              <Box key={game.id} display="flex" flexDirection="row">
                <RenderItemLink
                  date={date}
                  title={game.title}
                  to={`/edit/${game.id}`}
                />
                <Button
                  style={{ width: 150 }}
                  color="primary"
                  onClick={() => handleMakeActive({ ...game })}
                >
                  Make Active
                </Button>
              </Box>
            );
          })}
      </List>
      <Divider style={{ height: 1, marginTop: 10 }} />
      <p>Active Games:</p>
      <List>
        {games
          .filter((game) => game.status === GameStatus.ACTIVE)
          .map((game) => {
            const date = new Date(game.createdAt);
            return (
              <Box display="flex" key={game.id}>
                <RenderItemLink
                  date={date}
                  title={game.title}
                  to={`/shared/${game.id}`}
                />
                <CopyToClipboard
                  text={`${process.env.REACT_APP_DOMAIN}/shared/${game.id}`}
                >
                  <Button style={{ minWidth: 100 }} size="small">
                    Copy link
                  </Button>
                </CopyToClipboard>
              </Box>
            );
          })}
      </List>
      <Divider style={{ height: 1, marginTop: 10 }} />
      <p>Completed Games:</p>
      <List>
        {games
          .filter((game) => game.status === GameStatus.COMPLETED)
          .map((game) => {
            return (
              <RenderItemLink
                key={game.id}
                title={game.title}
                to={`/shared/${game.id}`}
              />
            );
          })}
      </List>
    </>
  );
};

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
  }, []);

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
      {games && <Games handleMakeActive={handleMakeActive} games={games} />}
      {!games && <p>You do not have any games</p>}
    </Box>
  );
}
