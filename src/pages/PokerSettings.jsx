import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import * as queries from "../graphql/queries";
import { useParams } from "react-router-dom";

function PokerSettings({ user }) {
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
          aria-label="date"
          name="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        >
          {settings.dateOptions.map((date) => (
            <FormControlLabel
              value={date.date}
              control={<Radio />}
              label={date.date}
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
          aria-label="time"
          name="time"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
        >
          {settings.timeOptions.map((time) => (
            <FormControlLabel
              value={time.time}
              control={<Radio />}
              label={time.time}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </>
  );
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
          Players: {settings.players ? <RenderPlayers /> : "No players"}
        </Box>
      </Typography>

      <Button color="primary" variant="contained">
        Submit
      </Button>
    </Box>
  );
}

export default PokerSettings;
