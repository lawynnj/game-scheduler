import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { API, graphqlOperation } from "aws-amplify";
import PropTypes from "prop-types";
import * as queries from "../graphql/queries";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { CopyToClipboard } from "react-copy-to-clipboard";
import format from "date-fns/format";
import * as mutations from "../graphql/mutations";

const RenderItemLink = ({ date, to, title }) => {
  const history = useHistory();
  const d = format(date, "EEE MMM dd yyyy 'at' h:m aaaa");

  return (
    <ListItem button onClick={() => history.push(to)}>
      <ListItemText primary={title} secondary={`Created on ${d}`} />
    </ListItem>
  );
};

const Games = ({ games }) => {
  const handleMakeActive = async ({ id }) => {
    try {
      await API.graphql(
        graphqlOperation(mutations.updateGameStrict, {
          input: {
            id: id,
            status: "ACTIVE",
          },
        })
      );
    } catch (error) {
      alert("Something went wrong!");
    }
  };
  return (
    <>
      <p>Draft Games:</p>
      <List>
        {games.items
          .filter((game) => game.status === "PENDING")
          .map((game) => {
            const date = new Date(game.createdAt);
            return (
              <Box display="flex" flexDirection="row">
                <RenderItemLink
                  key={game.id}
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
        {games.items
          .filter((game) => game.status === "ACTIVE")
          .map((game) => {
            const date = new Date(game.createdAt);
            return (
              <Box display="flex">
                <RenderItemLink
                  key={game.id}
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
        {games.items
          .filter((game) => game.status === "COMPLETED")
          .map((game) => {
            const date = new Date(game.eventDate);
            return (
              <RenderItemLink
                key={game.id}
                date={date}
                title={game.title}
                to={`/game/${game.id}`}
              />
            );
          })}
      </List>
    </>
  );
};

export default function Home({ user }) {
  const [games, setGames] = useState(null);
  const history = useHistory();
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await API.graphql(
          graphqlOperation(queries.listGames, {
            input: {
              hostId: user.attributes.sub,
            },
          })
        );
        setGames(res.data.listGames);
      } catch (error) {
        alert("Something went wrong!");
      }
    };
    if (!games) fetchGames();
  }, [games, user.attributes.sub]);

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
      {games && <Games games={games} />}
      {!games && <p>You do not have any games</p>}
    </Box>
  );
}

Home.propTypes = {
  user: PropTypes.object,
};
