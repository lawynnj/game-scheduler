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
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import Backdrop from "@material-ui/core/Backdrop";
import { TimePicker } from "formik-material-ui-pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { DateOptions, TimeOptions, BuyInOptions } from "../models/game";
import { GetGameQuery } from "../API";
import { gqlOp, useQuery } from "../hooks/useQuery";

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

// const sanitizeInitVals = (game: GetGameQuery, initialValues: MyFormValues) => {
//   const data = game?.getGame;
//   if (data === null) {
//     return;
//   }
//   const temp = {};
//   const arrayProps = ["dateOptions", "timeOptions", "buyInOptions", "players"];
//   const stringProps = ["type", "status", "title", "eventTime"];
//   (Object.keys(initialValues) as Array<keyof typeof initialValues>).forEach(
//     (key) => {
//       if (data[key] !== null && Array.isArray(data[key])) {
//         temp[key] = [...data[key]];
//         if (key === "timeOptions") {
//           temp[key] = temp[key].map((obj) => {
//             let d = new Date();
//             let ds = d.toLocaleDateString();
//             obj["time"] = new Date(`${ds}T${obj.time}`);
//             return obj;
//           });
//         }
//       } else {
//         // Formik complains when values are null.
//         // Initialize them as empty string or array
//         if (arrayProps.includes(key)) {
//           temp[key] = [];
//         } else if (!data[key] && stringProps.includes(key)) {
//           temp[key] = "";
//         } else {
//           temp[key] = data[key];
//         }
//       }
//     }
//   );
//   return temp;
// };

// const sanitizeSubmitValues = (values) => {
// const sanitizedVals = {
// ...values,
// };

// Object.keys(sanitizedVals).forEach((key) => {
// if (
// sanitizedVals[key] === "" ||
// (Array.isArray(sanitizedVals[key]) && sanitizedVals[key].length === 0)
// )
// sanitizedVals[key] = null;
// });

// if (sanitizedVals.timeOptions) {
// sanitizedVals.timeOptions = sanitizedVals.timeOptions.map((opt) => {
// const sanitizedOpt = { ...opt };
// return {
// ...sanitizedOpt,
// time: sanitizedOpt.time.toISOString().split("T")[1],
// };
// });
// }

// return sanitizedVals;
// };

// const validationSchema = Yup.object().shape({
//   title: Yup.string().required("Title is required"),
//   type: Yup.string(),
//   dateOptions: Yup.array().of(
//     Yup.object().shape({
//       date: Yup.date().required(),
//       votes: Yup.number().required(),
//     })
//   ),
//   buyInOptions: Yup.array().of(
//     Yup.object().shape({
//       amount: Yup.number().required().min(0),
//       votes: Yup.number().required(),
//     })
//   ),
// });
interface MyFormValues {
  title: string;
  type: string;
  status: string;
  dateOptions: DateOptions[];
  timeOptions: TimeOptions[];
  buyInOptions: BuyInOptions[];
}
const AddEditPokerSettings = ({
  match,
  userId,
}: {
  match: any;
  userId: string;
}) => {
  const { gameId } = match.params;
  const isAddMode = !gameId;
  const classes = useStyles();
  const history = useHistory();
  const [showPrompt, setShowPrompt] = useState(false);
  const { data: game, loading, refetch, error } = useQuery<GetGameQuery>(
    queries.getGame,
    {
      id: gameId,
      skip: !gameId,
    }
  );
  const [initialValues, setInitialValues] = useState<MyFormValues>({
    title: "",
    type: "",
    status: "PENDING",
    dateOptions: [],
    timeOptions: [],
    buyInOptions: [],
  });
  const [formInitialized, setFormInitialized] = useState(false);
  const title = isAddMode
    ? "Add Poker Game Settings"
    : "Edit Poker Game Settings";
  const buttonText = isAddMode ? "Add" : "Save";
  const settings = game?.getGame;
  useEffect(() => {
    if (settings && !isAddMode && !formInitialized) {
      const tmp: MyFormValues = {
        title: game?.getGame?.title || "",
        type: game?.getGame?.type || "",
        status: game?.getGame?.status || "",
        dateOptions: game?.getGame?.dateOptions || [],
        timeOptions: game?.getGame?.timeOptions || [],
        buyInOptions: game?.getGame?.buyInOptions || [],
      };
      setInitialValues(sanitizeInitVals(game, initialValues));
      setFormInitialized(true);
    }
  }, [isAddMode, settings, initialValues, formInitialized]);

  const handleAdd = async (sanitizedVals: MyFormValues) => {
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

  const handleEdit = async (sanitizedVals: MyFormValues) => {
    // try {
    //   await API.graphql(
    //     graphqlOperation(mutations.updateGame, {
    //       input: {
    //         ...sanitizedVals,
    //         hostId: userId,
    //         id: settings.id,
    //       },
    //     })
    //   );
    // } catch (error) {
    //   console.log("Error", error);
    // }
  };

  const handleSubmit = async (values: MyFormValues) => {
    // setShowPrompt(false);
    // const sanitizedVals = sanitizeSubmitValues(values);
    // if (isAddMode) {
    //   await handleAdd(sanitizedVals);
    // } else {
    //   await handleEdit(sanitizedVals);
    // }
  };

  if (!isAddMode && !settings) {
    return <CircularProgress />;
  }

  // const RenderArrayField = ({
  //   isSubmitting,
  //   index,
  //   arrayHelpers,
  //   name,
  //   type = "text",
  // }) => {
  //   let _type = type === "time" ? "text" : type;
  //   let component = type === "time" ? TimePicker : TextField;
  //   return (
  //     <Box display="flex" key={index} alignItems="center">
  //       <Field
  //         type={_type}
  //         name={name}
  //         component={component}
  //         margin="dense"
  //         className={classes.input}
  //         inputProps={{
  //           onFocus: () => setShowPrompt(true),
  //         }}
  //         variant="outlined"
  //         InputLabelProps={{
  //           shrink: true,
  //         }}
  //       />
  //       <div>
  //         <IconButton
  //           style={{ marginLeft: 5 }}
  //           aria-label="delete"
  //           disabled={isSubmitting}
  //           className={classes.margin}
  //           onClick={() => arrayHelpers.remove(index)}
  //         >
  //           <DeleteIcon fontSize="small" />
  //         </IconButton>
  //       </div>
  //     </Box>
  //   );
  // };
  const AddButton = ({
    disabled,
    onClick,
  }: {
    disabled: boolean;
    onClick: () => void;
  }) => (
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

  return (
    <Box p={2} display="flex" flexDirection="column">
      <Prompt when={showPrompt} message="Are you sure you want to leave?" />

      <Box display="flex" flexDirection="column">
        <Typography variant="h6" align="center">
          {title}
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
                    {/* <FieldArray
                      name="buyInOptions"
                      render={(arrayHelpers) => (
                        <div>
                          {values.buyInOptions &&
                            values.buyInOptions.map((buyIn, index) => (
                              <RenderArrayField
                                key={index}
                                index={index}
                                type="number"
                                arrayHelpers={arrayHelpers}
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
                          {values.dateOptions &&
                            values.dateOptions.map((date, index) => (
                              <RenderArrayField
                                key={index}
                                index={index}
                                type="date"
                                arrayHelpers={arrayHelpers}
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
                    /> */}

                    {/* <Typography
                      variant="subtitle2"
                      style={{ color: "rgba(0, 0, 0, 0.54)", marginTop: 10 }}
                    >
                      Times
                    </Typography>
                    <FieldArray
                      name="timeOptions"
                      render={(arrayHelpers) => (
                        <div>
                          {values.timeOptions &&
                            values.timeOptions.map((time, index) => (
                              <RenderArrayField
                                key={index}
                                type="time"
                                index={index}
                                arrayHelpers={arrayHelpers}
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
                    /> */}

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
                        {buttonText}
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
