import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Amplify from "aws-amplify";
import React from "react";
import { Route, Switch } from "react-router-dom";
import config from "./aws-exports";
import ProtectedPages from "./pages/ProtectedPages";
import SharedSettings from "./pages/SharedSettings";

Amplify.configure(config);

const theme = createMuiTheme({
  palette: {
    primary: { main: "#2196f3" },
    secondary: { main: "#f50057" },
  },
});

function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route exact path="/shared/:gameId" render={() => <SharedSettings />} />
        <Route exact component={ProtectedPages} />
      </Switch>
    </ThemeProvider>
  );
}

export default App;
