import DateFnsUtils from "@date-io/date-fns";
import Backdrop from "@material-ui/core/Backdrop";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { API, graphqlOperation } from "aws-amplify";
import { Field, FieldArray, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { TimePicker } from "formik-material-ui-pickers";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Prompt, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { GetGameQuery } from "../API";
import * as mutations from "../graphql/mutations";
import * as queries from "../graphql/queries";
import { useQuery } from "../hooks/useQuery";
import { BuyInOptions, DateOptions, TimeOptions } from "../models/game";

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

const transformTimeOpts = (values: PokerFormVals): PokerFormVals => {
  const cleanVals: PokerFormVals = {
    ...values,
  };

  if (cleanVals.timeOptions) {
    cleanVals.timeOptions = cleanVals.timeOptions.map((opt) => {
      const sanitizedOpt = { ...opt };
      const tmp: Date = new Date(sanitizedOpt.time);
      return {
        ...sanitizedOpt,
        time: tmp.toISOString().split("T")[1],
      };
    });
  }

  return cleanVals;
};

interface Test {
  title?: string;
}

// ✔️ compiles
const validationSchema: Yup.SchemaOf<PokerFormVals> = Yup.object({
  title: Yup.string().defined(),
  type: Yup.string().defined(),
  status: Yup.string().defined(),
  dateOptions: Yup.array()
    .of(
      Yup.object()
        .shape({
          date: Yup.string().defined(),
          votes: Yup.number().defined(),
        })
        .defined()
    )
    .defined(),
  timeOptions: Yup.array()
    .of(
      Yup.object()
        .shape({
          time: Yup.string().defined(),
          votes: Yup.number().defined(),
        })
        .defined()
    )
    .defined(),
  buyInOptions: Yup.array()
    .of(
      Yup.object()
        .shape({
          amount: Yup.number().defined(),
          votes: Yup.number().defined(),
        })
        .defined()
    )
    .defined(),
}).defined();

interface PokerFormVals {
  title: string;
  type: string;
  status: string;
  dateOptions: DateOptions[];
  timeOptions: TimeOptions[];
  buyInOptions: BuyInOptions[];
}
interface IAddEditPokerSettingsProps {
  match: any;
  userId: string;
}

interface RenderArrayFieldProps {
  isSubmitting?: boolean;
  name: string;
  type?: string;
  handleFocus?: () => void;
  handleDelete?: () => void;
}

interface AddButtonProps {
  disabled: boolean;
  onClick: () => void;
}

const AddButton = ({ disabled, onClick }: AddButtonProps) => (
  <Button
    style={{ marginLeft: 5 }}
    aria-label="add"
    color="primary"
    variant="contained"
    size="small"
    disabled={disabled}
    onClick={onClick}
  >
    <AddIcon fontSize="small" />
  </Button>
);

const RenderArrayField = (props: RenderArrayFieldProps) => {
  const {
    isSubmitting = false,
    name,
    type = "text",
    handleFocus = () => ({}),
    handleDelete = () => ({}),
  } = props;
  const _type = type === "time" ? "text" : type;
  const component = type === "time" ? TimePicker : TextField;
  return (
    <Box display="flex" alignItems="center">
      <Field
        type={_type}
        name={name}
        component={component}
        margin="dense"
        inputProps={{
          onFocus: handleFocus,
        }}
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <div>
        <IconButton
          style={{ marginLeft: 5 }}
          aria-label="delete"
          disabled={isSubmitting}
          onClick={handleDelete}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>
    </Box>
  );
};

const AddEditPokerSettings = (props: IAddEditPokerSettingsProps) => {
  const { match, userId } = props;
  const { gameId } = match.params;
  const isAddMode = !gameId;
  const classes = useStyles();
  const history = useHistory();
  const [showPrompt, setShowPrompt] = useState(false);
  const [formInitialized, setFormInitialized] = useState(false);
  const { data, loading } = useQuery<GetGameQuery>(queries.getGame, {
    id: gameId,
    skip: !gameId,
  });
  const [initialValues, setInitialValues] = useState<PokerFormVals>({
    title: "",
    type: "",
    status: "PENDING",
    dateOptions: [],
    timeOptions: [],
    buyInOptions: [],
  });

  const game = data?.getGame;

  useEffect(() => {
    // initialize form values if we are in edit mode
    if (game && !isAddMode && !formInitialized) {
      const dateOptions: DateOptions[] =
        game?.dateOptions?.map((dateOpt) => {
          return {
            date: dateOpt?.date,
            votes: dateOpt?.votes,
          } as DateOptions;
        }) ?? [];

      const timeOptions: TimeOptions[] =
        game?.timeOptions?.map((timeOpt) => {
          return {
            // To make the datetime picker component work, we need to prepend a dummy date.
            // The component expects a ISO date so we format it here.
            time: "9999-09-26T" + timeOpt?.time,
            votes: timeOpt?.votes,
          } as TimeOptions;
        }) ?? [];

      const buyInOptions: BuyInOptions[] =
        game?.buyInOptions?.map((buyInOpt) => {
          return {
            amount: buyInOpt?.amount,
            votes: buyInOpt?.votes,
          } as BuyInOptions;
        }) ?? [];

      const values: PokerFormVals = {
        title: game?.title || "",
        type: game?.type || "",
        status: game?.status || "",
        dateOptions: dateOptions,
        timeOptions: timeOptions,
        buyInOptions: buyInOptions,
      };
      setInitialValues(values);
      setFormInitialized(true);
    }
  }, [isAddMode, game, initialValues, formInitialized]);

  const handleAdd = async (values: PokerFormVals) => {
    try {
      await API.graphql(
        graphqlOperation(mutations.createGame, {
          input: {
            ...values,
            hostId: userId,
          },
        })
      );
      history.push("/");
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleEdit = async (values: PokerFormVals) => {
    try {
      console.log(values);
      await API.graphql(
        graphqlOperation(mutations.updateGame, {
          input: {
            ...values,
            hostId: userId,
            id: game?.id,
          },
        })
      );
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleSubmit = async (values: PokerFormVals) => {
    setShowPrompt(false);
    const cleanVals = transformTimeOpts(values);
    if (isAddMode) {
      await handleAdd(cleanVals);
    } else {
      await handleEdit(cleanVals);
    }
  };

  if (!isAddMode && loading) {
    return <CircularProgress />;
  }

  return (
    <Box p={2} display="flex" flexDirection="column">
      <Prompt when={showPrompt} message="Are you sure you want to leave?" />

      <Box display="flex" flexDirection="column">
        <Typography variant="h6" align="center">
          {isAddMode ? "Add Poker Game Settings" : "Edit Poker Game Settings"}
        </Typography>

        <Formik
          initialValues={initialValues}
          // validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, isSubmitting }) => {
            return (
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                          {values?.buyInOptions?.map((buyIn, index) => (
                            <RenderArrayField
                              handleFocus={() => setShowPrompt(true)}
                              handleDelete={() => arrayHelpers.remove(index)}
                              key={index}
                              isSubmitting={isSubmitting}
                              type="number"
                              name={`buyInOptions[${index}].amount`}
                            />
                          ))}

                          <AddButton
                            disabled={isSubmitting}
                            onClick={() =>
                              arrayHelpers.push({ amount: 0, votes: 0 })
                            }
                          />
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
                          {values?.dateOptions?.map((date, index) => (
                            <RenderArrayField
                              handleFocus={() => setShowPrompt(true)}
                              handleDelete={() => arrayHelpers.remove(index)}
                              key={index}
                              type="date"
                              isSubmitting={isSubmitting}
                              name={`dateOptions[${index}].date`}
                            />
                          ))}
                          <AddButton
                            disabled={isSubmitting}
                            onClick={() =>
                              arrayHelpers.push({ date: 0, votes: 0 })
                            }
                          />
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
                          {values?.timeOptions?.map((time, index) => (
                            <RenderArrayField
                              key={index}
                              handleFocus={() => setShowPrompt(true)}
                              handleDelete={() => arrayHelpers.remove(index)}
                              isSubmitting={isSubmitting}
                              type="time"
                              name={`timeOptions[${index}].time`}
                            />
                          ))}
                          <AddButton
                            disabled={isSubmitting}
                            onClick={() =>
                              arrayHelpers.push({
                                time: new Date(),
                                votes: 0,
                              })
                            }
                          />
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
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isAddMode ? "Add" : "Save"}
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        disabled={isSubmitting}
                        onClick={() => history.push(isAddMode ? "." : "..")}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </FormControl>
                  <Backdrop open={isSubmitting}>
                    <CircularProgress color="inherit" />
                  </Backdrop>
                </Form>
              </MuiPickersUtilsProvider>
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
