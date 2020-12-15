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

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const RenderItemLink = ({ date, to, title }) => {
  const history = useHistory();

  return (
    <ListItem button onClick={() => history.push(to)}>
      <ListItemText
        primary={title}
        secondary={`Created at ${
          monthNames[date.getMonth()]
        } ${date.getDate()}, ${date.getFullYear()}`}
      />
    </ListItem>
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
        console.log(("error", error));
      }
    };
    if (!games) fetchGames();
  }, [games, user.attributes.sub]);

  const Games = () => (
    <>
      <p>Draft Games:</p>
      <List>
        {games.items
          .filter((game) => game.status === "PENDING")
          .map((game) => {
            const date = new Date(game.createdAt);
            return (
              <RenderItemLink
                key={game.id}
                date={date}
                title={game.title}
                to={`/edit/${game.id}`}
              />
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
              <RenderItemLink
                key={game.id}
                date={date}
                title={game.title}
                to={`/shared/${game.id}`}
              />
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
      {games && <Games />}
      {!games && <p>You do not have any games</p>}
    </Box>
  );
}

Home.propTypes = {
  user: PropTypes.object,
};
