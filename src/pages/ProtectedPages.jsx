import React, { useEffect, useState } from "react";
import Home from "./Home";
import AddEditPokerSettings from "./AddEditPokerSettings";
import PokerSettings from "./PokerSettings";
import Header from "../components/Header";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Route, Switch } from "react-router-dom";
import { Auth } from "aws-amplify";
import CircularProgress from "@material-ui/core/CircularProgress";

function ProtectedPages() {
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
    <div>
      <Header />
      <Switch>
        <Route
          path="/create"
          render={(props) => (
            <AddEditPokerSettings {...props} userId={user.attributes.sub} />
          )}
          userId={user.attributes.sub}
        />
        <Route
          path="/edit/:gameId"
          render={(props) => (
            <AddEditPokerSettings {...props} userId={user.attributes.sub} />
          )}
        />
        <Route exact path="/" render={() => <Home user={user} />} />
      </Switch>
    </div>
  );
}

export default withAuthenticator(ProtectedPages);
