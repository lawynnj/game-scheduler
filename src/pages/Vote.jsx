import React, { useEffect, useState } from "react";
import * as mutations from "../graphql/mutations";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { API, graphqlOperation } from "aws-amplify";
import { Button, Typography } from "@material-ui/core";

export default function Vote({ settings, onSubmit }) {
  const [eventDate, setEventDate] = useState(null);
  const [eventTime, setEventTime] = useState(null);
  const [buyIn, setBuyIn] = useState(null);

  const RenderPlayers = () => (
    <ul>
      {settings.players.map((player) => (
        <li key={player.name + player.email}>
          {player.name} - {player.email}
        </li>
      ))}
    </ul>
  );

  const RenderOptions = ({ title, value, onChange, disabled, options }) => (
    <FormControl component="fieldset">
      <FormLabel component="legend">{title}</FormLabel>
      <RadioGroup
        aria-label="gender"
        name="gender1"
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <FormControlLabel
            disabled={disabled}
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );

  const RenderDates = () => {
    return (
      <RenderOptions
        title="Date"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
        aria-label="date"
        name="date"
        options={settings.dateOptions.map((date) => ({
          value: date.date,
          label: `${date.date}   (${date.votes} votes)`,
        }))}
      />
    );
  };

  const RenderTimes = () => (
    <RenderOptions
      title="Time"
      value={eventTime}
      onChange={(e) => setEventTime(e.target.value)}
      aria-label="time"
      name="time"
      options={settings.timeOptions.map((time) => ({
        value: time.time,
        label: `${time.time}   (${time.votes} votes)`,
      }))}
    />
  );

  const RenderBuyIn = () => (
    <RenderOptions
      title="Buy in ($)"
      value={buyIn}
      onChange={(e) => setBuyIn(parseInt(e.target.value))}
      aria-label="buyIn"
      name="buyIn"
      options={settings.buyInOptions.map((buyIn) => ({
        value: buyIn.amount,
        label: `${buyIn.amount}   (${buyIn.votes} votes)`,
      }))}
    />
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
      onSubmit(res.data.updateGameStrict);
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
