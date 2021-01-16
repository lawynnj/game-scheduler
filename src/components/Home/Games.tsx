import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import RenderItemLink from "./GameListItem";
import { GameStatus } from "../../API";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { GameType } from "../../graphql/APITypes";

type GamesProps = {
  games: Partial<GameType>[];
  handleMakeActive: (Game: GameType) => void;
};

const Games = (props: GamesProps): JSX.Element => {
  const { games, handleMakeActive } = props;

  const filterGames = (status: string) => {
    return games.filter((game) => game.status === status);
  };

  return (
    <>
      <p>Draft Games:</p>
      <List>
        {filterGames(GameStatus.PENDING).map((game: GameType) => {
          const date = new Date(game.createdAt ?? "");

          return (
            <Box key={game.id} display="flex" flexDirection="row">
              <RenderItemLink date={date} title={game.title} to={`/edit/${game.id}`} />
              <Button style={{ width: 150 }} color="primary" onClick={() => handleMakeActive({ ...game })}>
                Make Active
              </Button>
            </Box>
          );
        })}
      </List>
      <Divider style={{ height: 1, marginTop: 10 }} />
      <p>Active Games:</p>
      <List>
        {filterGames(GameStatus.ACTIVE).map((game: GameType) => {
          const date = new Date(game.createdAt ?? "");

          return (
            <Box display="flex" key={game.id}>
              <RenderItemLink date={date} title={game.title} to={`/shared/${game.id}`} />
              <CopyToClipboard text={`${process.env.REACT_APP_DOMAIN}/shared/${game.id}`}>
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
        {filterGames(GameStatus.ACTIVE).map((game: GameType) => {
          return <RenderItemLink key={game.id} title={game.title} to={`/shared/${game.id}`} />;
        })}
      </List>
    </>
  );
};

export default Games;
