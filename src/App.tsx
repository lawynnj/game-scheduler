import React from "react";
import Amplify from "aws-amplify";
import { Route, Switch } from "react-router-dom";
import config from "./aws-exports";
import ProtectedPages from "./pages/ProtectedPages";
import SharedSettings from "./pages/SharedSettings";
Amplify.configure(config);

function App(): JSX.Element {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/shared/:gameId" render={() => <SharedSettings />} />
        <Route exact component={ProtectedPages} />
      </Switch>
    </div>
  );
}

export default App;
