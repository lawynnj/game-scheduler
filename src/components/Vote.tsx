import React from "react";
import * as mutations from "../graphql/mutations";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { graphqlOperation } from "aws-amplify";
import { RadioGroup } from "formik-material-ui";
import { Formik, Field, Form, FormikProps } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import format from "date-fns/format";
import parse from "date-fns/parse";
import { publicAPI } from "../utils";
import { GetGameQuery } from "../API";

interface IVoteForm {
  buyIn: string;
  eventTime: string;
  eventDate: string;
  [key: string]: string;
}

interface IVoteProps {
  game: GetGameQuery;
  onSubmit: (vote: IVoteForm) => void;
}

interface VoteOptionProps extends Partial<FormikProps<IVoteForm>> {
  title: string;
  name: string;
  disabled: boolean;
  options: {
    value: string;
    label: string;
  }[];
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

function Vote({ game, onSubmit }: IVoteProps) {
  const settings = game?.getGame;

  const initialValues: IVoteForm = {
    buyIn: "",
    eventTime: "",
    eventDate: "",
  };
  const handleSubmit = async (values: IVoteForm) => {
    const { eventTime, eventDate, buyIn } = values;
    const eventTimes = settings?.timeOptions?.map((time) => {
      if (time?.time === eventTime) {
        return {
          ...time,
          votes: time.votes + 1,
        };
      } else {
        return time;
      }
    });

    const eventDates = settings?.dateOptions?.map((date) => {
      if (date?.date === eventDate) {
        return {
          ...date,
          votes: date?.votes + 1,
        };
      } else {
        return date;
      }
    });

    const buyIns = settings?.buyInOptions?.map((_buyIn) => {
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
        id: settings?.id || "",
        buyInOptions: buyIns,
        dateOptions: eventDates,
        timeOptions: eventTimes,
      };

      await publicAPI(
        graphqlOperation(mutations.updateGame, {
          input,
        })
      );

      onSubmit({
        eventDate,
        eventTime,
        buyIn,
      });
    } catch (error) {
      alert("Something went wrong!");
    } finally {
    }
  };

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
        <Formik
          initialValues={initialValues}
          //           validationSchema={Yup.object().shape({
          //   eventTime: Yup.string().required("Title is required"),
          //   eventDate: Yup.string().required("Date is required"),
          //   buyIn: Yup.string().required("Buy in is required"),
          // })}
          onSubmit={async (values) => {
            await handleSubmit(values);
          }}
        >
          {({ isSubmitting, errors, touched }: FormikProps<IVoteForm>) => (
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
                      label: date?.date
                        ? format(new Date(date.date), "EEE MMM dd yyyy")
                        : "",
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

export default Vote;
