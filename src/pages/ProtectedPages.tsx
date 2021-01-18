import { withAuthenticator } from "@aws-amplify/ui-react";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Auth } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import Header from "../components/Header";
import AddEditPokerSettings from "./AddEditPokerSettings";
import Home from "./Home";

function ProtectedPages(): JSX.Element {
  // eslint-disable-next-line
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await Auth.currentUserInfo();
        setUser(res);
      } catch (error) {
        alert("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };
    if (!user) {
      fetchUser();
    }
  }, [user]);

  if (loading) {
    return (
      <Box display="flex" paddingY="30px" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Header />
      <Switch>
        <Route path="/create" render={(props) => <AddEditPokerSettings {...props} userId={user.attributes.sub} />} />
        <Route
          path="/edit/:gameId"
          render={(props) => <AddEditPokerSettings {...props} userId={user.attributes.sub} />}
        />
        <Route exact path="/" render={() => <Home user={user} />} />
      </Switch>
    </div>
  );
}

export default withAuthenticator(ProtectedPages);
