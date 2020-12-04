import React, { useEffect, useState } from "react";
import Amplify, { Auth } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Route } from "react-router-dom";
import config from "./aws-exports";
import CircularProgress from "@material-ui/core/CircularProgress";
import Home from "./pages/Home";
import AddEditPokerSettings from "./pages/AddEditPokerSettings";
import PokerSettings from "./pages/PokerSettings";
import Header from "./components/Header";

Amplify.configure(config);

function App() {
  const [user, setUser] = useState(null);

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

  return (
    <div className="App">
      <Header />
      <Route
        path="/create"
        render={(props) => (
          <AddEditPokerSettings {...props} userId={user.attributes.sub} />
        )}
        userId={user.attributes.sub}
      />
      <Route
        exact
        path="/game/:gameId"
        render={() => <PokerSettings user={user} />}
      />
      <Route exact path="/" render={() => <Home user={user} />} />
    </div>
  );
}

export default withAuthenticator(App);
