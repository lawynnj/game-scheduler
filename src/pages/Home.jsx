import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default function Home({ user }) {
  const [games, setGames] = useState([]);
  if (!user) {
    return <CircularProgress />;
  }

  const Games = () => (
    <>
      <p>Here are your games:</p>
      <ul>
        {games.map((game) => (
          <li key={game.id}>game.name</li>
        ))}
      </ul>
    </>
  );
  return (
    <Box p={2}>
      <Typography variant="h5">Hi {user.username},</Typography>
      <Link to="/create-game-settings">Create Game</Link>
      {games.length > 0 && <Games />}
      {games.length === 0 && <p>You do not have any games</p>}
    </Box>
  );
}

Home.propTypes = {
  user: PropTypes.object,
};
