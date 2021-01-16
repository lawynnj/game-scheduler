import React, { useEffect } from "react";
import * as queries from "../graphql/queries";
import { useParams } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import Vote from "../components/Vote";
import Results from "../components/Results";
import usePrevious from "../hooks/usePrevious";
import useStateWithLocalStorage from "../hooks/useStateWithLocalStorage";
import { GetGameQuery } from "../API";
import { useQuery } from "../hooks/useQuery";

function PokerSettings(): JSX.Element {
  const { gameId } = useParams<{ gameId: string }>();
  const [vote, setVote] = useStateWithLocalStorage(`vote-${gameId}`);
  const prevVote = usePrevious<string>(vote);
  const { loading, data, refetch } = useQuery<GetGameQuery>(queries.getGame, {
    id: gameId,
    isPublic: true,
  });

  useEffect(() => {
    // refetch data when user votes
    if (vote && prevVote !== undefined && prevVote !== vote) {
      refetch();
    }
    // prevVote holds previous value of vote state, don't include it in dep. array
    // eslint-disable-next-line
  }, [vote]);
  if (loading || data?.getGame === undefined) return <CircularProgress />;

  const hasVoted = vote !== undefined && vote !== "";
  return (
    <div>
      {hasVoted || data?.getGame?.status === "COMPLETED" ? (
        <Results game={data} />
      ) : (
        <Vote
          game={data}
          onSubmit={(vote) => {
            setVote(
              JSON.stringify({
                buyIn: vote.buyIn,
                eventDate: vote.eventDate,
                eventTime: vote.eventTime,
              }),
            );
          }}
        />
      )}
    </div>
  );
}

export default PokerSettings;
