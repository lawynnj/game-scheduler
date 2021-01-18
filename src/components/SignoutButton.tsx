import Button from "@material-ui/core/Button";
import { Auth } from "aws-amplify";
import React from "react";

export default function SignoutButton(): JSX.Element {
  const signOut = async () => {
    try {
      await Auth.signOut();
      // quick hack to force a re-render of the amplify withAuthentication wrapper
      window.location.reload();
    } catch (error) {
      alert("Something went wrong");
    }
  };

  return (
    <Button onClick={signOut} color="secondary" variant="contained">
      Sign Out
    </Button>
  );
}
