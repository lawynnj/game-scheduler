import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Link } from "react-router-dom";
import SignOut from "../components/SignoutButton";

export default function Header(): JSX.Element {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
          <Typography variant="h6" color="inherit">
            <Link to="/">Poker Game Organizer</Link>
          </Typography>
          <div>
            <SignOut />
          </div>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
