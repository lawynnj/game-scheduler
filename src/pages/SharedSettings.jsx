import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import * as queries from "../graphql/queries";
import { useParams } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import Vote from "../components/Vote";
import Results from "../components/Results";

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

  const [vote, setVote] = useStateWithLocalStorage(`vote-${gameId}`);

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
        <Results settings={settings} vote={vote} />
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
