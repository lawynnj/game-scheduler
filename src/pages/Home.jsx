import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { API, graphqlOperation } from "aws-amplify";
import PropTypes from "prop-types";
import * as queries from "../graphql/queries";
export default function Home({ user }) {
  const [games, setGames] = useState(null);

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
      <p>Here are your games:</p>
      <ul>
        {games.items.map((game) => (
          <li key={game.id}>
            <Link to={`/game/${game.id}`}>
              {game.title} | created on: {game.createdAt}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <Box p={2}>
      <Typography variant="h5">Hi {user.username},</Typography>
      <Link to="/create">Create Game</Link>
      {games && <Games />}
      {!games && <p>You do not have any games</p>}
    </Box>
  );
}

Home.propTypes = {
  user: PropTypes.object,
};
