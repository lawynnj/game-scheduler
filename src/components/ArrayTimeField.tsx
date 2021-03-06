import { Field, FieldAttributes } from "formik";
import { TimePicker, TimePickerProps } from "formik-material-ui-pickers";
import React from "react";
import ArrayFieldWrapper, { ArrayFieldWrapperProps } from "./ArrayFieldWrapper";

export type ArrayTimeFieldProps = ArrayFieldWrapperProps & FieldAttributes<Partial<TimePickerProps>>;

const ArrayTimeField = (props: ArrayTimeFieldProps): JSX.Element => {
  const { deleteBtnProps, onDelete, ...rest } = props;

  return (
    <ArrayFieldWrapper onDelete={onDelete} deleteBtnProps={deleteBtnProps}>
      <Field component={TimePicker} {...rest} />
    </ArrayFieldWrapper>
  );
};

export default ArrayTimeField;
