import { Grid, Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import React, { ReactNode } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useHistory } from "react-router-dom";
import { GameStatus } from "../../API";
import { GameType } from "../../graphql/APITypes";
import GameListItem from "./GameListItem";

type GamesProps = {
  games: Partial<GameType>[];
  onMakeActive: (Game: GameType) => void;
  onDelete: (id: string) => void;
};

// eslint-disable-next-line
const Card = ({ children }: { children: ReactNode }) => {
  return (
    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
      {children}
    </Box>
  );
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
        <Card key={game.id}>
          <div>
            <GameListItem date={date} title={game.title} to={`/edit/${game.id}`} />
          </div>
          <div>
            <Button
              style={{ width: 150, marginRight: 10 }}
              color="primary"
              variant="contained"
              onClick={() => onMakeActive({ ...game })}
              size="small"
            >
              Publish
            </Button>
          </div>
          <div>
            <Button color="secondary" variant="contained" onClick={() => onDelete(game.id)} size="small">
              Delete
            </Button>
          </div>
        </Card>
      );
    });

    return items.length > 0 ? items : <p>No draft games!</p>;
  };

  const renderActiveGames = (): JSX.Element | JSX.Element[] => {
    const items = filterGames(GameStatus.ACTIVE).map((game: GameType) => {
      const date = new Date(game.createdAt ?? "");

      return (
        <Card key={game.id}>
          <div>
            <GameListItem date={date} title={game.title} to={`/shared/${game.id}`} />
          </div>
          <div>
            <CopyToClipboard text={`${process.env.REACT_APP_DOMAIN}/shared/${game.id}`}>
              <Button style={{ minWidth: 100, marginRight: 10 }} color="primary" variant="contained" size="small">
                Copy link
              </Button>
            </CopyToClipboard>
          </div>
          <div>
            <Button color="secondary" variant="contained" size="small" onClick={() => onDelete(game.id)}>
              Delete
            </Button>
          </div>
        </Card>
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

  return (
    <Box display="flex" justifyContent="center" marginTop="30px">
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
