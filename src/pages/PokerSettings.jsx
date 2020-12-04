import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import * as queries from "../graphql/queries";
import { useParams } from "react-router-dom";
import { Button, CircularProgress, Typography } from "@material-ui/core";

export default function PokerSettings({ user }) {
  const { gameId } = useParams();
  const [settings, setSettings] = useState(null);
  const [eventDate, setEventDate] = useState(null);
  const [eventTime, setEventTime] = useState(null);
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
      {JSON.parse(settings.players).map((player) => (
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
          {JSON.parse(settings.dateOptions).map((date) => (
            <FormControlLabel value={date} control={<Radio />} label={date} />
          ))}
        </RadioGroup>
      </FormControl>
    </>
  );

  const RenderTimes = () => (
    <>
      <FormControl component="fieldset">
        <FormLabel component="legend">Date</FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender1"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        >
          {JSON.parse(settings.timeOptions).map((time) => (
            <FormControlLabel value={time} control={<Radio />} label={time} />
          ))}
        </RadioGroup>
      </FormControl>
    </>
  );
  // times = "[\"11:30:24-07:00\",\"10:30:24-07:00\",\"09:30:24-07:00\"]"
  return (
    <Box p={2}>
      <Typography variant="h6">Settings</Typography>
      <Typography variant="subtitle1">
        <div>Title: {settings.title}</div>
        <div>Host: {user.username}</div>

        <Box mt={2}>
          {settings.timeOptions ? <RenderTimes /> : "No times set up"}
        </Box>
        <Box mt={2}>
          {settings.dateOptions ? <RenderDates /> : "No dates set up"}
        </Box>
        <Box mt={2}>
          Players options: {settings.players ? <RenderPlayers /> : "No players"}
        </Box>
      </Typography>

      <Button color="primary" variant="contained">
        Finalize
      </Button>
    </Box>
  );
}
