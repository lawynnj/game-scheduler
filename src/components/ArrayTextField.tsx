import { Field } from "formik";
import { TextField, TextFieldProps } from "formik-material-ui";
import React from "react";
import Wrapper, { WrapperProps } from "./ArrayFieldWrapper";

export type ArrayTextFieldProps = WrapperProps & Partial<TextFieldProps>;

const ArrayTextField = (props: ArrayTextFieldProps) => {
  const { buttonStyles, isSubmitting, onDelete, ...rest } = props;
  return (
    <Wrapper
      onDelete={onDelete}
      isSubmitting={isSubmitting}
      buttonStyles={buttonStyles}
    >
      <Field component={TextField} {...rest} />
    </Wrapper>
  );
};

export default ArrayTextField;
