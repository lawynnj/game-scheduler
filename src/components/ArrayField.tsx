import { TextFieldProps } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { Field } from "formik";
import { TextField } from "formik-material-ui";
import { TimePicker, TimePickerProps } from "formik-material-ui-pickers";
import React from "react";

export interface BaseArrayFieldProps {
  isSubmitting?: boolean;
  name: string;
  type?: string;
  buttonStyles?: object;
  onDelete?: () => void;
}

export type ArrayFieldProps = BaseArrayFieldProps &
  Partial<TimePickerProps> &
  Partial<TextFieldProps>;

const ArrayField = (props: ArrayFieldProps) => {
  const {
    isSubmitting = false,
    name,
    type = "text",
    buttonStyles = { marginLeft: 5 },
    onDelete = () => undefined,
    margin,
    ...rest
  } = props;

  const _type = type === "time" ? "text" : type;
  const component = type === "time" ? TimePicker : TextField;
  return (
    <Box display="flex" alignItems="center">
      <Field type={_type} name={name} component={component} {...rest} />
      <div>
        <IconButton
          style={buttonStyles}
          aria-label="delete"
          disabled={isSubmitting}
          onClick={onDelete}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>
    </Box>
  );
};

export default ArrayField;
