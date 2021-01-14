import DateFnsUtils from "@date-io/date-fns";
import Backdrop from "@material-ui/core/Backdrop";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Field, FieldArray, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import React from "react";
import * as Yup from "yup";
import { BuyInOptions, DateOptions, TimeOptions } from "../../models/game";
import ArrayDateField from "../ArrayDateField";
import ArrayTextField from "../ArrayTextField";
import ArrayTimeField from "../ArrayTimeField";

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

export interface PokerFormVals {
  title: string;
  type: string;
  status: string;
  dateOptions: DateOptions[];
  timeOptions: TimeOptions[];
  buyInOptions: BuyInOptions[];
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

interface PokerSettingsFormProps {
  onCancel: () => void;
  submitBtnText: string;
  title: string;
  initialValues: any;
  handleSubmit: (values: PokerFormVals) => void;
  onFormFocus: () => void;
}

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

export default function PokerSettingsForm(props: PokerSettingsFormProps) {
  const {
    title,
    onCancel,
    submitBtnText,
    initialValues,
    handleSubmit,
    onFormFocus,
  } = props;

  const classes = useStyles();
  return (
    <div>
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
                        onFocus: onFormFocus,
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
                        onFocus: onFormFocus,
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
                          {values?.buyInOptions?.map(
                            (buyIn: BuyInOptions, index: number) => (
                              <ArrayTextField
                                name={`buyInOptions[${index}].amount`}
                                key={index}
                                isSubmitting={isSubmitting}
                                variant="outlined"
                                margin="dense"
                                onDelete={() => arrayHelpers.remove(index)}
                              />
                            )
                          )}

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
                          {values?.dateOptions?.map(
                            (date: DateOptions, index: number) => (
                              <ArrayDateField
                                onDelete={() => arrayHelpers.remove(index)}
                                key={index}
                                isSubmitting={isSubmitting}
                                name={`dateOptions[${index}].date`}
                                // margin="dense"
                                variant="dialog"
                                type="text"
                                inputProps={{
                                  onFocus: onFormFocus,
                                }}
                              />
                            )
                          )}
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
                          {values?.timeOptions?.map(
                            (time: TimeOptions, index: number) => (
                              <ArrayTimeField
                                onDelete={() => arrayHelpers.remove(index)}
                                key={index}
                                isSubmitting={isSubmitting}
                                name={`timeOptions[${index}].time`}
                                margin="dense"
                                variant="dialog"
                                type="text"
                                inputProps={{
                                  onFocus: onFormFocus,
                                }}
                              />
                            )
                          )}
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
                        {submitBtnText}
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        disabled={isSubmitting}
                        onClick={onCancel}
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
    </div>
  );
}