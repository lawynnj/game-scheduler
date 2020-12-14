import React from "react";
import Amplify from "aws-amplify";
import { Route, Switch } from "react-router-dom";
import config from "./aws-exports";
import ProtectedPages from "./pages/ProtectedPages";

Amplify.configure(config);

function App() {
  return (
    <div className="App">
      <Switch>
        <Route
          exact
          path="/shared/:gameId"
          render={() => <div>Public Page </div>}
        />
        <Route exact component={ProtectedPages} />
      </Switch>
    </div>
  );
}

export default App;
