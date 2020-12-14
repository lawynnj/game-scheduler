import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import { useParams } from "react-router-dom";
import { Button, CircularProgress, Typography } from "@material-ui/core";

function PokerSettings() {
  const { gameId } = useParams();
  const [settings, setSettings] = useState(null);
  const [eventDate, setEventDate] = useState(null);
  const [eventTime, setEventTime] = useState(null);
  const [buyIn, setBuyIn] = useState(null);

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

  const RenderPlayers = () => (
    <ul>
      {settings.players.map((player) => (
        <li key={player.name + player.email}>
          {player.name} - {player.email}
        </li>
      ))}
    </ul>
  );

  const RenderDates = () => (
    <>
      <FormControl component="fieldset">
        <FormLabel component="legend">Date</FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender1"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        >
          {settings.dateOptions.map((date) => (
            <FormControlLabel
              key={date.date}
              value={date.date}
              control={<Radio />}
              label={`${date.date}   (${date.votes} votes)`}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </>
  );

  const RenderTimes = () => (
    <>
      <FormControl component="fieldset">
        <FormLabel component="legend">Time</FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender1"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
        >
          {settings.timeOptions.map((time) => (
            <FormControlLabel
              key={time.time}
              value={time.time}
              control={<Radio />}
              label={`${time.time}   (${time.votes} votes)`}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </>
  );

  const RenderBuyIn = () => (
    <>
      <FormControl component="fieldset">
        <FormLabel component="legend">Buy in ($)</FormLabel>
        <RadioGroup
          aria-label="buyIn"
          name="buyIn"
          value={buyIn}
          onChange={(e) => setBuyIn(parseInt(e.target.value))}
        >
          {settings.buyInOptions.map((buyIn) => (
            <FormControlLabel
              key={buyIn.amount}
              value={buyIn.amount}
              control={<Radio />}
              label={`${buyIn.amount}   (${buyIn.votes} votes)`}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </>
  );

  const handleSubmit = async () => {
    const eventTimes = settings.timeOptions.map((time) => {
      if (time.time === eventTime) {
        return {
          ...time,
          votes: time.votes + 1,
        };
      } else {
        return time;
      }
    });

    const eventDates = settings.dateOptions.map((date) => {
      if (date.date === eventDate) {
        return {
          ...date,
          votes: date.votes + 1,
        };
      } else {
        return date;
      }
    });

    const buyIns = settings.buyInOptions.map((_buyIn) => {
      if (_buyIn.amount === buyIn) {
        return {
          ..._buyIn,
          votes: _buyIn.votes + 1,
        };
      } else {
        return _buyIn;
      }
    });
    try {
      const input = {
        ...settings,
        buyInOptions: buyIns,
        dateOptions: eventDates,
        timeOptions: eventTimes,
      };

      delete input.createdAt;
      delete input.updatedAt;

      const res = await API.graphql(
        graphqlOperation(mutations.updateGameStrict, {
          input,
        })
      );
      setSettings(res.data.updateGameStrict);
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <Box p={2} mt={2} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h6">Vote</Typography>
      <Typography variant="subtitle1">
        <div>Game: {settings.title}</div>

        <Box mt={2}>
          {settings.dateOptions ? <RenderDates /> : "No dates set up"}
        </Box>
        <Box mt={2}>
          {settings.timeOptions ? <RenderTimes /> : "No times set up"}
        </Box>
        <Box mt={2}>
          {settings.buyInOptions ? <RenderBuyIn /> : "No dates set up"}
        </Box>
        <Box mt={2}>
          Players: {settings.players ? <RenderPlayers /> : "No players"}
        </Box>
      </Typography>

      <Button color="primary" variant="contained" onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
}

export default PokerSettings;
