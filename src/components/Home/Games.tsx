import { Grid, Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useHistory } from "react-router-dom";
import { GameStatus } from "../../API";
import { GameType } from "../../graphql/APITypes";
import RenderItemLink from "./GameListItem";

type GamesProps = {
  games: Partial<GameType>[];
  onMakeActive: (Game: GameType) => void;
  onDelete: (id: string) => void;
};

const Games = (props: GamesProps): JSX.Element => {
  const { games, onMakeActive, onDelete } = props;

  const history = useHistory();
  const filterGames = (status: string) => {
    return games.filter((game) => game.status === status);
  };

  const renderDraftGames = (): JSX.Element | JSX.Element[] => {
    const items = filterGames(GameStatus.PENDING).map((game: GameType) => {
      const date = new Date(game.createdAt ?? "");

      return (
        <Box key={game.id} display="flex" flexDirection="row">
          <RenderItemLink date={date} title={game.title} to={`/edit/${game.id}`} />
          <Button style={{ width: 150 }} color="primary" onClick={() => onMakeActive({ ...game })}>
            Make Active
          </Button>
          <Button color="secondary" variant="contained" onClick={() => onDelete(game.id)}>
            Delete
          </Button>
        </Box>
      );
    });

    return items.length > 0 ? items : <p>No draft games!</p>;
  };

  const renderActiveGames = (): JSX.Element | JSX.Element[] => {
    const items = filterGames(GameStatus.ACTIVE).map((game: GameType) => {
      const date = new Date(game.createdAt ?? "");

      return (
        <Box display="flex" key={game.id}>
          <RenderItemLink date={date} title={game.title} to={`/shared/${game.id}`} />
          <CopyToClipboard text={`${process.env.REACT_APP_DOMAIN}/shared/${game.id}`}>
            <Button style={{ minWidth: 100 }} size="small">
              Copy link
            </Button>
          </CopyToClipboard>
          <Button color="secondary" variant="contained" onClick={() => onDelete(game.id)}>
            Delete
          </Button>
        </Box>
      );
    });

    return items.length > 0 ? items : <p>No active games!</p>;
  };

  const renderCompletedGames = (): JSX.Element | JSX.Element[] => {
    const items = filterGames(GameStatus.ACTIVE).map((game: GameType) => {
      return <RenderItemLink key={game.id} title={game.title} to={`/shared/${game.id}`} />;
    });

    return items.length > 0 ? items : <p>No completed games!</p>;
  };

  return (
    <>
      <Grid container style={{ maxWidth: 500 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h3">Polls</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            size="small"
            style={{ marginTop: 5, float: "right" }}
            color="primary"
            variant="contained"
            onClick={() => history.push("/create")}
          >
            Create A Poll
          </Button>
        </Grid>
        <Grid item xs={12}>
          <p>Draft:</p>
          <List>{renderDraftGames()}</List>
          <Divider style={{ height: 1, marginTop: 10 }} />
        </Grid>

        <Grid item xs={12}>
          <p>Active:</p>
          <List>{renderActiveGames()}</List>
          <Divider style={{ height: 1, marginTop: 10 }} />
        </Grid>

        <Grid item xs={12}>
          <p>Completed:</p>
          <List>{renderCompletedGames()}</List>
        </Grid>
      </Grid>
    </>
  );
};

export default Games;
