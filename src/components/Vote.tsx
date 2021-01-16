import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import Typography from "@material-ui/core/Typography";
import { API, graphqlOperation } from "aws-amplify";
import format from "date-fns/format";
import parse from "date-fns/parse";
import { Field, Form, FormikErrors, FormikProps, FormikTouched, withFormik } from "formik";
import { RadioGroup } from "formik-material-ui";
import React from "react";
import { GetGameQuery } from "../API";
import * as mutations from "../graphql/mutations";
interface FormValues {
  buyIn: string;
  eventTime: string;
  eventDate: string;
  [key: string]: string;
}

interface VoteFormProps {
  game: GetGameQuery;
  onSubmit: (vote: FormValues) => void;
}

interface OtherProps {
  game: GetGameQuery;
}
interface VoteOptionProps {
  title: string;
  name: string;
  disabled: boolean;
  options: {
    value: string;
    label: string;
  }[];
  errors: FormikErrors<FormValues>;
  touched: FormikTouched<FormValues>;
}

const VoteOption = (props: VoteOptionProps) => {
  const { title, name, disabled, options, touched = {}, errors = {} } = props;
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{title}</FormLabel>
      <Field component={RadioGroup} name={name}>
        {options?.map((option) => (
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
};

function InnerForm(props: OtherProps & FormikProps<FormValues>) {
  const { errors, touched, isSubmitting, game } = props;
  const settings = game?.getGame;

  const formatTime = (time: string) => {
    try {
      const tmp = time.split(".");
      const tmpTime = tmp[0] + tmp[1][tmp[1].length - 1];
      const d = parse(tmpTime, "HH:mm:ssX", new Date());
      return format(d, "hh:mm a");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box p={2} mt={2} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h6">Vote</Typography>
      <Typography variant="subtitle1">
        <div>{settings?.title}</div>
        <Form>
          <Box mt={2}>
            {settings?.dateOptions ? (
              <VoteOption
                disabled={isSubmitting}
                errors={errors}
                touched={touched}
                title="Date"
                name="eventDate"
                options={settings.dateOptions.map((date) => ({
                  value: date?.date || "",
                  label: date?.date ? format(new Date(date.date), "EEE MMM dd yyyy") : "",
                }))}
              />
            ) : (
              "No dates set up"
            )}
          </Box>
          <Box mt={2}>
            {settings?.timeOptions ? (
              <VoteOption
                disabled={isSubmitting}
                errors={errors}
                touched={touched}
                title="Time"
                name="eventTime"
                options={settings?.timeOptions.map((time) => ({
                  value: time?.time || "",
                  label: time?.time ? `${formatTime(time.time)}` : "",
                }))}
              />
            ) : (
              "No times set up"
            )}
          </Box>
          <Box mt={2}>
            {settings?.buyInOptions ? (
              <VoteOption
                disabled={isSubmitting}
                errors={errors}
                touched={touched}
                title="Buy in ($)"
                name="buyIn"
                options={settings.buyInOptions.map((buyIn) => ({
                  value: buyIn?.amount?.toString() || "",
                  label: `${buyIn?.amount || ""}`,
                }))}
              />
            ) : (
              "No dates set up"
            )}
          </Box>
          <Button color="primary" variant="contained" type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </Form>
      </Typography>
    </Box>
  );
}

const VoteForm = withFormik<VoteFormProps, FormValues>({
  mapPropsToValues: () => ({
    buyIn: "",
    eventTime: "",
    eventDate: "",
  }),
  validate(values: FormValues) {
    const errors: FormikErrors<FormValues> = {};

    if (!values.buyIn) {
      errors.buyIn = "Required";
    }
    if (!values.eventTime) {
      errors.eventTime = "Required";
    }
    if (!values.eventDate) {
      errors.eventDate = "Required";
    }

    return errors;
  },
  async handleSubmit(values: FormValues, { props }) {
    const { eventTime, eventDate, buyIn } = values;
    const { game, onSubmit } = props;
    const settings = game.getGame;
    if (settings?.timeOptions && settings?.dateOptions && settings?.buyInOptions) {
      const eventTimes = settings.timeOptions.map((time) => {
        if (time?.time === eventTime) {
          return {
            ...time,
            votes: time.votes + 1,
          };
        } else {
          return time;
        }
      });

      const eventDates = settings.dateOptions.map((date) => {
        if (date?.date === eventDate) {
          return {
            ...date,
            votes: date?.votes + 1,
          };
        } else {
          return date;
        }
      });

      const buyIns = settings.buyInOptions.map((_buyIn) => {
        if (_buyIn?.amount === parseInt(buyIn)) {
          return {
            ..._buyIn,
            votes: _buyIn?.votes + 1,
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
          authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });

        onSubmit({
          eventDate,
          eventTime,
          buyIn,
        });
      } catch (error) {
        alert("Something went wrong!");
      }
    } else {
      alert("Something went wrong!");
    }
  },
})(InnerForm);

export default VoteForm;
