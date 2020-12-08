import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { Link, useHistory } from "react-router-dom";
import { API, graphqlOperation } from "aws-amplify";
import PropTypes from "prop-types";
import * as queries from "../graphql/queries";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
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
      <Box p={2} component={Paper}>
        <p>Pending Games:</p>
        <ul>
          {games.items
            .filter((game) => game.status === "PENDING")
            .map((game) => (
              <li key={game.id}>
                <Link to={`/edit/${game.id}`}>
                  {game.title} | created on: {game.createdAt}
                </Link>
              </li>
            ))}
        </ul>
      </Box>

      <Box p={2} component={Paper} mt={2}>
        <p>Active Games:</p>
        <ul>
          {games.items
            .filter((game) => game.status === "ACTIVE")
            .map((game) => (
              <li key={game.id}>
                <Link to={`/game/${game.id}`}>
                  {game.title} | created on: {game.createdAt}
                </Link>
              </li>
            ))}
        </ul>
      </Box>
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
