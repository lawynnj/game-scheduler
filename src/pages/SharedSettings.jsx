import Box from "@material-ui/core/Box";

import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import * as queries from "../graphql/queries";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import Vote from "./Vote";

const useStateWithLocalStorage = (localStorageKey) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(localStorageKey) || ""
  );

  React.useEffect(() => {
    localStorage.setItem(localStorageKey, value);
  }, [value, localStorageKey]);

  return [value, setValue];
};

function PokerSettings() {
  const { gameId } = useParams();
  const [settings, setSettings] = useState(null);
  const [eventDate, setEventDate] = useState(null);
  const [eventTime, setEventTime] = useState(null);
  const [buyIn, setBuyIn] = useState(null);
  const [vote, setVote] = useStateWithLocalStorage(`vote-${gameId}`);

  useEffect(() => {
    if (vote) {
      const tmp = JSON.parse(vote);
      setEventDate(tmp.eventDate);
      setEventTime(tmp.eventTime);
      setBuyIn(tmp.buyIn);
    }
  }, [vote]);
  // check local storage to see if the user has voted
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.graphql(
          graphqlOperation(queries.getGame, {
            id: gameId,
          })
        );
        setSettings(res.data.getGame);
      } catch (error) {
        console.log(("error", error));
      }
    };
    if (!settings) fetchSettings();
  }, [gameId, settings]);

  if (!settings) {
    return <CircularProgress />;
  }

  const hasVoted = vote !== undefined && vote !== "";

  return (
    <div>
      {hasVoted ? (
        <div>results</div>
      ) : (
        <Vote
          settings={settings}
          onSubmit={(settings) => {
            setSettings(settings);
            setVote(
              JSON.stringify({
                buyIn: settings.buyIn,
                eventDate: settings.eventDate,
                eventTime: settings.eventTime,
              })
            );
          }}
        />
      )}
    </div>
  );
}

export default PokerSettings;
