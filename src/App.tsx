import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Amplify from "aws-amplify";
import React from "react";
import { Route, Switch } from "react-router-dom";
import config from "./aws-exports";
import Notification from "./components/Notification";
import NotificationProvider from "./contexts/NotificationContext";
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
      <NotificationProvider>
        <>
          <Notification />
          <Switch>
            <Route exact path="/shared/:gameId" render={() => <SharedSettings />} />
            <Route exact component={ProtectedPages} />
          </Switch>
        </>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
