import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

export default function Home() {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await Auth.currentUserInfo();
        setUser(res);
      } catch (error) {}
    };
    if (!user) {
      fetchUser();
    }
  }, [user]);

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
