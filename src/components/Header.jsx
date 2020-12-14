import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { AmplifySignOut } from "@aws-amplify/ui-react";
import Box from "@material-ui/core/Box";

import { Link } from "react-router-dom";

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
        >
          <Typography variant="h6" color="inherit">
            <Link to="/">Poker Game Organizer</Link>
          </Typography>
          <div>
            <AmplifySignOut />
          </div>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
