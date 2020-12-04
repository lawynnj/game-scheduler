import React, { useEffect, useState } from "react";
import Amplify, { Auth } from "aws-amplify";
import config from "./aws-exports";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Route } from "react-router-dom";
import Home from "./pages/Home";
import AddEditPokerSettings from "./pages/AddEditPokerSettings";
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

  return (
    <div className="App">
      <Header />
      <Route
        path="/poker-game-settings"
        component={AddEditPokerSettings}
        userId={user}
      />
      <Route exact path="/" component={Home} user={user} />
    </div>
  );
}

export default withAuthenticator(App);
