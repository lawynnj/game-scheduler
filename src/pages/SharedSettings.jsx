import React, { useEffect, useState, useCallback } from "react";
import { API, graphqlOperation } from "aws-amplify";
import * as queries from "../graphql/queries";
import { useParams } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import Vote from "../components/Vote";
import Results from "../components/Results";
import usePrevious from "../hooks/usePrevious";
import useStateWithLocalStorage from "../hooks/useStateWithLocalStorage";

function PokerSettings() {
  const { gameId } = useParams();
  const [settings, setSettings] = useState(null);

  const [vote, setVote] = useStateWithLocalStorage(`vote-${gameId}`);

  const prevVote = usePrevious(vote);
  const fetchSettings = useCallback(async () => {
    try {
      const res = await API.graphql({
        ...graphqlOperation(queries.getGame, {
          id: gameId,
        }),
        authMode: "API_KEY",
      });
      setSettings(res.data.getGame);
    } catch (error) {
      alert("Something went wrong!");
    }
  }, [gameId]);

  useEffect(() => {
    if (!settings) {
      fetchSettings();
    } else if (prevVote !== vote) {
      fetchSettings();
    }
    // prevVote holds previous value of vote state, don't include it in dep. array
    // eslint-disable-next-line
  }, [vote, fetchSettings, settings]);

  if (!settings) {
    return <CircularProgress />;
  }

  const hasVoted = vote !== undefined && vote !== "";

  return (
    <div>
      {hasVoted || settings.status === "COMPLETED" ? (
        <Results settings={settings} />
      ) : (
        <Vote
          settings={settings}
          onSubmit={({ settings, vote }) => {
            setSettings(settings);
            setVote(
              JSON.stringify({
                buyIn: vote.buyIn,
                eventDate: vote.eventDate,
                eventTime: vote.eventTime,
              })
            );
          }}
        />
      )}
    </div>
  );
}

export default PokerSettings;
