import React from "react";
import * as mutations from "../graphql/mutations";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { API, graphqlOperation } from "aws-amplify";
import { RadioGroup } from "formik-material-ui";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import format from "date-fns/format";
import parse from "date-fns/parse";

const validationSchema = Yup.object().shape({
  eventTime: Yup.string().required("Title is required"),
  eventDate: Yup.string().required("Date is required"),
  buyIn: Yup.string().required("Buy in is required"),
});

const VoteOption = ({ title, name, disabled, options, touched, errors }) => (
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

VoteOption.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  options: PropTypes.array.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

export default function Vote({ settings, onSubmit }) {
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
      if (_buyIn.amount === parseInt(buyIn)) {
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
        id: settings.id,
        buyInOptions: buyIns,
        dateOptions: eventDates,
        timeOptions: eventTimes,
      };

      await API.graphql({
        ...graphqlOperation(mutations.updateGame, {
          input,
        }),
        authMode: "API_KEY",
      });
      onSubmit({
        settings,
        vote: {
          eventDate,
          eventTime,
          buyIn,
        },
      });
    } catch (error) {
      alert("Something went wrong!");
    }
  };

  const formatTime = (time) => {
    let tmp = time.split(".");
    let tmptime = tmp[0] + tmp[1][tmp[1].length - 1];
    const d = parse(tmptime, "hh:mm:ssX", new Date());
    return format(d, "hh:mm a");
  };
  return (
    <Box p={2} mt={2} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h6">Vote</Typography>
      <Typography variant="subtitle1">
        <div>{settings.title}</div>
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
                  <VoteOption
                    disabled={isSubmitting}
                    errors={errors}
                    touched={touched}
                    settings={settings}
                    title="Date"
                    aria-label="date"
                    name="eventDate"
                    options={settings.dateOptions.map((date) => ({
                      value: date.date,
                      label: format(new Date(date.date), "EEE MMM dd yyyy"),
                    }))}
                  />
                ) : (
                  "No dates set up"
                )}
              </Box>
              <Box mt={2}>
                {settings.timeOptions ? (
                  <VoteOption
                    disabled={isSubmitting}
                    errors={errors}
                    touched={touched}
                    settings={settings}
                    title="Time"
                    aria-label="time"
                    name="eventTime"
                    options={settings.timeOptions.map((time) => ({
                      value: time.time,
                      label: `${formatTime(time.time)}`,
                    }))}
                  />
                ) : (
                  "No times set up"
                )}
              </Box>
              <Box mt={2}>
                {settings.buyInOptions ? (
                  <VoteOption
                    disabled={isSubmitting}
                    errors={errors}
                    touched={touched}
                    title="Buy in ($)"
                    aria-label="buyIn"
                    name="buyIn"
                    options={settings.buyInOptions.map((buyIn) => ({
                      value: buyIn.amount.toString(),
                      label: `${buyIn.amount}`,
                    }))}
                  />
                ) : (
                  "No dates set up"
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

Vote.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
};
