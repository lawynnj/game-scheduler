import React, { useEffect, useState } from "react";
import * as mutations from "../graphql/mutations";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { API, graphqlOperation } from "aws-amplify";
import { Button, Typography } from "@material-ui/core";
import { RadioGroup } from "formik-material-ui";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  eventTime: Yup.string().required("Title is required"),
  eventDate: Yup.string().required("Date is required"),
  buyIn: Yup.string().required("Buy in is required"),
});

export default function Vote({ settings, onSubmit }) {
  const RenderPlayers = () => (
    <ul>
      {settings.players.map((player) => (
        <li key={player.name + player.email}>
          {player.name} - {player.email}
        </li>
      ))}
    </ul>
  );

  const RenderOptions = ({
    title,
    name,
    disabled,
    options,
    touched,
    errors,
  }) => (
    <FormControl component="fieldset">
      <FormLabel component="legend">{title}</FormLabel>
      <Field component={RadioGroup} name={name}>
        {options.map((option) => (
          <FormControlLabel
            disabled={disabled}
            key={option.value}
            value={option.value}
            control={<Radio disabled={disabled} />}
            label={option.label}
          />
        ))}
      </Field>
      <Typography variant="subtitle2" color="error">
        {errors[name] && touched[name] ? errors[name] : null}
      </Typography>
    </FormControl>
  );

  const RenderDates = ({ disabled, errors, touched }) => {
    return (
      <RenderOptions
        title="Date"
        aria-label="date"
        name="eventDate"
        disabled={disabled}
        errors={errors}
        touched={touched}
        options={settings.dateOptions.map((date) => ({
          value: date.date,
          label: `${date.date}   (${date.votes} votes)`,
        }))}
      />
    );
  };

  const RenderTimes = ({ disabled, errors, touched }) => (
    <RenderOptions
      title="Time"
      aria-label="time"
      name="eventTime"
      disabled={disabled}
      errors={errors}
      touched={touched}
      options={settings.timeOptions.map((time) => ({
        value: time.time,
        label: `${time.time}   (${time.votes} votes)`,
      }))}
    />
  );

  const RenderBuyIn = ({ disabled, errors, touched }) => (
    <RenderOptions
      title="Buy in ($)"
      aria-label="buyIn"
      name="buyIn"
      disabled={disabled}
      errors={errors}
      touched={touched}
      options={settings.buyInOptions.map((buyIn) => ({
        value: buyIn.amount.toString(),
        label: `${buyIn.amount}   (${buyIn.votes} votes)`,
      }))}
    />
  );

  const handleSubmit = async ({ eventTime, eventDate, buyIn }) => {
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

      await API.graphql(
        graphqlOperation(mutations.updateGameStrict, {
          input,
        })
      );
      onSubmit({
        settings,
        vote: {
          eventDate,
          eventTime,
          buyIn,
        },
      });
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <Box p={2} mt={2} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h6">Vote</Typography>
      <Typography variant="subtitle1">
        <div>Game: {settings.title}</div>
        <Formik
          initialValues={{
            buyIn: "",
            eventTime: "",
            eventDate: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            await handleSubmit(values);
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <Box mt={2}>
                {settings.dateOptions ? (
                  <RenderDates
                    disabled={isSubmitting}
                    errors={errors}
                    touched={touched}
                  />
                ) : (
                  "No dates set up"
                )}
              </Box>
              <Box mt={2}>
                {settings.timeOptions ? (
                  <RenderTimes
                    disabled={isSubmitting}
                    errors={errors}
                    touched={touched}
                  />
                ) : (
                  "No times set up"
                )}
              </Box>
              <Box mt={2}>
                {settings.buyInOptions ? (
                  <RenderBuyIn
                    disabled={isSubmitting}
                    errors={errors}
                    touched={touched}
                  />
                ) : (
                  "No dates set up"
                )}
              </Box>
              <Box mt={2}>
                Players:{" "}
                {settings.players ? (
                  <RenderPlayers disabled={isSubmitting} />
                ) : (
                  "No players"
                )}
              </Box>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                disabled={isSubmitting}
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Typography>
    </Box>
  );
}
