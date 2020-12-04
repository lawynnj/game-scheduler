import React, { useState, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import { TextField } from "formik-material-ui";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { Prompt, useHistory } from "react-router-dom";
import * as mutations from "../graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";

const useStyles = makeStyles({
  input: {
    width: 250,
  },
  formSelect: {
    width: "250px",
  },
  radio: {
    width: "100%",
    marginTop: 30,
  },
});

const AddEditPokerSettings = ({ match, userId }) => {
  const { id } = match.params;
  const isAddMode = !id;
  const title = isAddMode
    ? "Add Poker Game Settings"
    : "Edit Poker Game Settings";
  const buttonText = isAddMode ? "Add" : "Save";
  const classes = useStyles();
  const history = useHistory();
  const [showPrompt, setShowPrompt] = useState(false);
  const [initialValues, setInitialValues] = useState({
    title: "",
    type: "",
    buyIn: 0,
    eventTime: "",
    cancelled: false,
    players: [],
    dateOptions: [],
    timeOptions: [],
  });

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    type: Yup.string(),
  });

  const handleSubmit = async (values) => {
    setShowPrompt(false);
    // sanitize form
    const sanitizedVals = {
      ...values,
    };
    Object.keys(sanitizedVals).forEach((key) => {
      if (
        sanitizedVals[key] === "" ||
        (Array.isArray(sanitizedVals[key]) && sanitizedVals[key].length === 0)
      )
        sanitizedVals[key] = null;
    });
    try {
      await API.graphql(
        graphqlOperation(mutations.createGame, {
          input: {
            ...sanitizedVals,
            hostId: userId,
          },
        })
      );
      history.push("/");
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <Box p={2} display="flex">
      <Prompt when={showPrompt} message="Are you sure you want to leave?" />

      <Box display="flex" flexDirection="column">
        <Typography variant="h6" align="center">
          {title}
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ isSubmitting }) => {
            return (
              <Form>
                <FormControl>
                  <Field
                    component={TextField}
                    label="Title"
                    name="title"
                    margin="dense"
                    className={classes.input}
                    inputProps={{
                      onFocus: () => setShowPrompt(true),
                    }}
                    variant="outlined"
                  />
                  <Field
                    component={TextField}
                    label="Type"
                    name="type"
                    margin="dense"
                    className={classes.input}
                    inputProps={{
                      onFocus: () => setShowPrompt(true),
                    }}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <Field
                    component={TextField}
                    label="Buy In"
                    name="ticklerdate"
                    type="number"
                    margin="dense"
                    className={classes.input}
                    inputProps={{
                      onFocus: () => setShowPrompt(true),
                    }}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <Field
                    component={TextField}
                    label="Dates"
                    name="dateOptions"
                    type="date"
                    margin="dense"
                    className={classes.input}
                    inputProps={{
                      onFocus: () => setShowPrompt(true),
                    }}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <Box
                    display="flex"
                    justifyContent="center"
                    mt={3}
                    width="100%"
                  >
                    <Button
                      color="primary"
                      variant="contained"
                      style={{ marginRight: 10 }}
                      className={classes.submitButton}
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {buttonText}
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => history.push(isAddMode ? "." : "..")}
                    >
                      Cancel
                    </Button>
                  </Box>
                </FormControl>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Box>
  );
};

AddEditPokerSettings.propTypes = {
  match: PropTypes.object.isRequired,
};

export default AddEditPokerSettings;
