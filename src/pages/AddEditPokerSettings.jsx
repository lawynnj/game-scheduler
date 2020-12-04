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
import * as queries from "../graphql/queries";

import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import FolderIcon from "@material-ui/icons/Folder";
import DeleteIcon from "@material-ui/icons/Delete";
import { CircularProgress } from "@material-ui/core";

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
    cancelled: false,
    players: [],
    dateOptions: [],
    timeOptions: [],
  });

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
        graphqlOperation(mutations.updateGame, {
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

  const updateSettings = async () => {
    try {
      const res = await API.graphql(
        graphqlOperation(mutations.updateGame, {
          input: {
            id: gameId,
            timeOptions: [
              { time: "12:30:24-07:00", votes: 0 },
              { time: "08:30:24-07:00", votes: 0 },
            ],
            dateOptions: [
              { date: "2020-12-05", votes: 0 },
              { date: "2020-12-06", votes: 0 },
            ],
            buyInOptions: [
              { amount: 5, votes: 0 },
              { amount: 10, votes: 0 },
            ],
          },
        })
      );
      console.log(res);
    } catch (error) {}
  };

  if (!isAddMode && !settings) {
    return <CircularProgress />;
  }

  return (
    <Box p={2} display="flex" flexDirection="column">
      <Button onClick={updateSettings} color="primary" variant="contained">
        Update test
      </Button>
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

                  <List
                    dense={true}
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        Buy-in amounts
                      </ListSubheader>
                    }
                  >
                    {settings.buyInOptions.map((buyIn) => {
                      return (
                        <ListItem key={buyIn.amount}>
                          <ListItemText primary={buyIn.amount} />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete">
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
                  </List>
                  <Button variant="contained" color="primary" size="small">
                    Add Buy-in
                  </Button>

                  {/* <Field
                    component={TextField}
                    label="Buy In"
                    name="ticklerdate"
                    type="number"
                    margin="dense"
                    className={classes.input}
                    inputProps={{
                      onFocus: () => setShowPrompt(true),
                    }}
                    variant="filled"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  /> */}

                  <List
                    dense={true}
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        Dates
                      </ListSubheader>
                    }
                  >
                    {settings.dateOptions.map((date) => {
                      return (
                        <ListItem key={date.date}>
                          <ListItemText primary={date.date} />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete">
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
                  </List>
                  <Button variant="contained" color="primary" size="small">
                    Add Date
                  </Button>
                  {/* 
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
                  /> */}

                  <List
                    dense={true}
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        Times
                      </ListSubheader>
                    }
                  >
                    {settings.timeOptions.map((time) => {
                      return (
                        <ListItem key={time.time}>
                          <ListItemText primary={time.time} />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete">
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
                  </List>
                  <Button variant="contained" color="primary" size="small">
                    Add Time
                  </Button>
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
