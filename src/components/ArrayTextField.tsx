import { Field, FieldAttributes } from "formik";
import { TextField, TextFieldProps } from "formik-material-ui";
import React from "react";
import ArrayFieldWrapper, { ArrayFieldWrapperProps } from "./ArrayFieldWrapper";

export type ArrayTextFieldProps = ArrayFieldWrapperProps & FieldAttributes<Partial<TextFieldProps>>;

const ArrayTextField = (props: ArrayTextFieldProps): JSX.Element => {
  const { deleteBtnProps, onDelete, ...rest } = props;
  return (
    <ArrayFieldWrapper onDelete={onDelete} deleteBtnProps={deleteBtnProps}>
      <Field component={TextField} {...rest} />
    </ArrayFieldWrapper>
  );
};

export default ArrayTextField;
