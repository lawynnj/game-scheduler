import React, { useState, useEffect } from "react";
import { Formik, Field, Form, FieldArray } from "formik";
import { TextField } from "formik-material-ui";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { Prompt, useHistory } from "react-router-dom";
import { API, graphqlOperation } from "aws-amplify";
import * as mutations from "../graphql/mutations";
import * as queries from "../graphql/queries";
import CircularProgress from "@material-ui/core/CircularProgress";

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
  const { gameId } = match.params;
  const isAddMode = !gameId;
  const title = isAddMode
    ? "Add Poker Game Settings"
    : "Edit Poker Game Settings";
  const buttonText = isAddMode ? "Add" : "Save";
  const classes = useStyles();
  const history = useHistory();
  const [showPrompt, setShowPrompt] = useState(false);
  const [settings, setSettings] = useState(null);
  const [initialValues, setInitialValues] = useState({
    title: "",
    type: "",
    buyIn: 0,
    eventTime: "",
    status: "PENDING",
    players: [],
    dateOptions: [],
    timeOptions: [],
    buyInOptions: [],
  });
  const [formInitialized, setFormInitialized] = useState(false);

  useEffect(() => {
    if (settings && !isAddMode && !formInitialized) {
      const temp = {};
      Object.keys(initialValues).forEach((key) => {
        if (Array.isArray(settings[key])) {
          temp[key] = [...settings[key]];
        } else {
          temp[key] = settings[key];
        }
      });
      setInitialValues(temp);
      setFormInitialized(true);
    }
  }, [isAddMode, settings, initialValues, formInitialized]);

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
    if (!isAddMode && !settings) {
      fetchSettings();
    }
  }, [isAddMode, settings, gameId]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    type: Yup.string(),
  });

  const handleAdd = async (sanitizedVals) => {
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

  const handleEdit = async (sanitizedVals) => {
    try {
      await API.graphql(
        graphqlOperation(mutations.updateGameStrict, {
          input: {
            ...sanitizedVals,
            hostId: userId,
            id: settings.id,
          },
        })
      );
    } catch (error) {
      console.log("Error", error);
    }
  };

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

    if (isAddMode) {
      handleAdd(sanitizedVals);
    } else {
      handleEdit(sanitizedVals);
    }
  };

  if (!isAddMode && !settings) {
    return <CircularProgress />;
  }

  return (
    <Box p={2} display="flex" flexDirection="column">
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
          {({ values, isSubmitting }) => {
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

                  <Typography
                    variant="subtitle2"
                    style={{ color: "rgba(0, 0, 0, 0.54)", marginTop: 10 }}
                  >
                    Buy ins
                  </Typography>
                  <FieldArray
                    name="buyInOptions"
                    render={(arrayHelpers) => (
                      <div>
                        {values.buyInOptions.map((buyIn, index) => (
                          <Box display="flex" key={index} alignItems="center">
                            <Field
                              name={`buyInOptions[${index}].amount`}
                              component={TextField}
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
                            <div>
                              <button
                                style={{ marginLeft: 5 }}
                                type="button"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                -
                              </button>
                            </div>
                          </Box>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            arrayHelpers.push({ amount: 0, votes: 0 })
                          }
                        >
                          +
                        </button>
                      </div>
                    )}
                  />

                  <Typography
                    variant="subtitle2"
                    style={{ color: "rgba(0, 0, 0, 0.54)", marginTop: 10 }}
                  >
                    Dates
                  </Typography>
                  <FieldArray
                    name="dateOptions"
                    render={(arrayHelpers) => (
                      <div>
                        {values.dateOptions.map((date, index) => (
                          <Box display="flex" key={index} alignItems="center">
                            <Field
                              name={`dateOptions[${index}].date`}
                              component={TextField}
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
                            <div>
                              <button
                                style={{ marginLeft: 5 }}
                                type="button"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                -
                              </button>
                            </div>
                          </Box>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            arrayHelpers.push({ date: 0, votes: 0 })
                          }
                        >
                          +
                        </button>
                      </div>
                    )}
                  />

                  <Typography
                    variant="subtitle2"
                    style={{ color: "rgba(0, 0, 0, 0.54)", marginTop: 10 }}
                  >
                    Times
                  </Typography>
                  <FieldArray
                    name="timeOptions"
                    render={(arrayHelpers) => (
                      <div>
                        {values.timeOptions.map((time, index) => (
                          <Box display="flex" key={index} alignItems="center">
                            <Field
                              name={`timeOptions[${index}].time`}
                              component={TextField}
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
                            <div>
                              <button
                                style={{ marginLeft: 5 }}
                                type="button"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                -
                              </button>
                            </div>
                          </Box>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            arrayHelpers.push({ time: 0, votes: 0 })
                          }
                        >
                          +
                        </button>
                      </div>
                    )}
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
