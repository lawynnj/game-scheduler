import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TrashIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CopyIcon from "@material-ui/icons/FilterNone";
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useHistory } from "react-router-dom";
import { GameStatus } from "../../API";
import { GameType } from "../../graphql/APITypes";
import GameListItem from "./GameListItem";

type GamesProps = {
  games: Partial<GameType>[];
  onMakeActive: (Game: GameType) => void;
  onClosePoll: (Game: GameType) => void;
  onDelete: (id: string) => void;
  loading: boolean;
};

const Games = (props: GamesProps): JSX.Element => {
  const { games, onMakeActive, onDelete, onClosePoll, loading } = props;
  const history = useHistory();
  const filterGames = (status: string) => {
    return games.filter((game) => game.status === status);
  };

  const renderDraftGames = (): JSX.Element | JSX.Element[] => {
    const items = filterGames(GameStatus.PENDING).map((game: GameType) => {
      const date = new Date(game.createdAt ?? "");

      return (
        <GameListItem key={game.id} date={date} title={game.title}>
          <>
            <Button
              style={{ marginRight: 20 }}
              color="primary"
              variant="contained"
              onClick={() => onMakeActive(game)}
              size="small"
            >
              Publish
            </Button>

            <IconButton onClick={() => history.push(`/edit/${game.id}`)}>
              <EditIcon />
            </IconButton>

            <IconButton onClick={() => onDelete(game.id)}>
              <TrashIcon />
            </IconButton>
          </>
        </GameListItem>
      );
    });

    return items.length > 0 ? items : <p>None</p>;
  };

  const renderActiveGames = (): JSX.Element | JSX.Element[] => {
    const items = filterGames(GameStatus.ACTIVE).map((game: GameType) => {
      const date = new Date(game.createdAt ?? "");

      return (
        <GameListItem key={game.id} date={date} title={game.title}>
          <>
            <Button
              style={{ marginRight: 20 }}
              color="primary"
              variant="contained"
              onClick={() => onClosePoll(game)}
              size="small"
            >
              Close Poll
            </Button>
            <CopyToClipboard text={`${process.env.REACT_APP_DOMAIN}/shared/${game.id}`}>
              <IconButton color="primary">
                <CopyIcon style={{ transform: "scaleY(-1)" }} />
              </IconButton>
            </CopyToClipboard>
            <IconButton onClick={() => onDelete(game.id)}>
              <TrashIcon />
            </IconButton>
          </>
        </GameListItem>
      );
    });

    return items.length > 0 ? items : <p>None</p>;
  };

  const renderCompletedGames = (): JSX.Element | JSX.Element[] => {
    const items = filterGames(GameStatus.COMPLETED).map((game: GameType) => {
      return (
        <GameListItem key={game.id} title={game.title}>
          <>
            <Button onClick={() => history.push(`/shared/${game.id}`)} color="primary" variant="contained" size="small">
              View
            </Button>
            <IconButton onClick={() => onDelete(game.id)}>
              <TrashIcon />
            </IconButton>
          </>
        </GameListItem>
      );
    });

    return items.length > 0 ? items : <p>None</p>;
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
          <Box component={Paper} paddingLeft={2}>
            <List>{renderDraftGames()}</List>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <p>Active:</p>

          <Box component={Paper} paddingLeft={2}>
            <List>{renderActiveGames()}</List>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <p>Completed:</p>

          <Box component={Paper} paddingLeft={2}>
            <List>{renderCompletedGames()}</List>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Games;
