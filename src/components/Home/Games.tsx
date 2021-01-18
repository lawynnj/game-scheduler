import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useHistory } from "react-router-dom";
import { GameStatus } from "../../API";
import { GameType } from "../../graphql/APITypes";
import GameListItem from "./GameListItem";

type GamesProps = {
  games: Partial<GameType>[];
  onMakeActive: (Game: GameType) => void;
  onDelete: (id: string) => void;
  loading: boolean;
};

const Games = (props: GamesProps): JSX.Element => {
  const { games, onMakeActive, onDelete, loading } = props;
  const history = useHistory();
  const filterGames = (status: string) => {
    return games.filter((game) => game.status === status);
  };

  const renderDraftGames = (): JSX.Element | JSX.Element[] => {
    const items = filterGames(GameStatus.PENDING).map((game: GameType) => {
      const date = new Date(game.createdAt ?? "");

      return (
        <Grid container alignItems="center" justify="center" key={game.id}>
          <Grid item xs={12} md={6}>
            <GameListItem date={date} title={game.title} to={`/edit/${game.id}`} />
          </Grid>
          <Grid item xs={6} md={3}>
            <div style={{ textAlign: "center", alignItems: "center" }}>
              <Button color="primary" variant="contained" onClick={() => onMakeActive({ ...game })} size="small">
                Publish
              </Button>
            </div>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button color="secondary" variant="contained" onClick={() => onDelete(game.id)} size="small">
              Delete
            </Button>
          </Grid>
        </Grid>
      );
    });

    return items.length > 0 ? items : <p>No draft games!</p>;
  };

  const renderActiveGames = (): JSX.Element | JSX.Element[] => {
    const items = filterGames(GameStatus.ACTIVE).map((game: GameType) => {
      const date = new Date(game.createdAt ?? "");

      return (
        <Grid container alignItems="center" justify="center" key={game.id}>
          <Grid item xs={12} md={6}>
            <GameListItem date={date} title={game.title} to={`/shared/${game.id}`} />
          </Grid>
          <Grid item xs={12} md={3}>
            <CopyToClipboard text={`${process.env.REACT_APP_DOMAIN}/shared/${game.id}`}>
              <Button style={{ minWidth: 100, marginRight: 10 }} color="primary" variant="contained" size="small">
                Copy link
              </Button>
            </CopyToClipboard>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button color="secondary" variant="contained" size="small" onClick={() => onDelete(game.id)}></Button>
          </Grid>
        </Grid>
      );
    });

    return items.length > 0 ? items : <p>No active games!</p>;
  };

  const renderCompletedGames = (): JSX.Element | JSX.Element[] => {
    const items = filterGames(GameStatus.COMPLETED).map((game: GameType) => {
      return <GameListItem key={game.id} title={game.title} to={`/shared/${game.id}`} />;
    });

    return items.length > 0 ? items : <p>No completed games!</p>;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" paddingY="30px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" paddingY="30px" paddingX="20px">
      <Grid container style={{ maxWidth: 600 }}>
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
          <p>Drafts:</p>
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
    </Box>
  );
};

export default Games;
