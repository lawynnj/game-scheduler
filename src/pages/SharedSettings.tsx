import React, { useEffect, useState, useCallback } from "react";
import * as queries from "../graphql/queries";
import { useParams } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import Vote from "../components/Vote";
import Results from "../components/Results";
import usePrevious from "../hooks/usePrevious";
import useStateWithLocalStorage from "../hooks/useStateWithLocalStorage";
import callGraphQL from "../utils/callGraphQl";
import { GetGameQuery } from "../API";

function PokerSettings() {
  const { gameId } = useParams<{ gameId: string }>();
  const [game, setGame] = useState<GetGameQuery | undefined>(undefined);
  const [vote, setVote] = useStateWithLocalStorage(`vote-${gameId}`);
  const prevVote = usePrevious(vote);
  const fetchGame = useCallback(async () => {
    try {
      const { data } = await callGraphQL<GetGameQuery>(queries.getGame, {
        id: gameId,
      });
      setGame(data);
    } catch (error) {
      alert("Something went wrong!");
    }
  }, [gameId]);

  useEffect(() => {
    if (!game) {
      fetchGame();
    } else if (prevVote !== vote) {
      fetchGame();
    }
    // prevVote holds previous value of vote state, don't include it in dep. array
    // eslint-disable-next-line
  }, [vote, fetchGame, game, gameId]);

  if (!game || !game?.getGame) {
    return <CircularProgress />;
  }

  const hasVoted = vote !== undefined && vote !== "";
  return (
    <div>
      {hasVoted || game?.getGame?.status === "COMPLETED" ? (
        <Results settings={game} />
      ) : (
        <Vote
          settings={game?.getGame}
          onSubmit={({ game, vote }) => {
            setGame(game);
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
