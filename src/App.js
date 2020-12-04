import Amplify from "aws-amplify";
import config from "./aws-exports";
import { withAuthenticator } from "@aws-amplify/ui-react";
import Home from "./pages/Home";
import { Route } from "react-router-dom";
import Header from "./components/Header";

Amplify.configure(config);

function App() {
  return (
    <div className="App">
      <Header />

      <Route exact path="/" component={Home} />
    </div>
  );
}

export default withAuthenticator(App);
