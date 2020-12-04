import React, { useEffect, useState } from "react";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { getUser } from "../graphql/queries";
import { CircularProgress } from "@material-ui/core";

export default function Home() {
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

  return <div>Home {user.username}</div>;
}
