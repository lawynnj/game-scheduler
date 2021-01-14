import { Field } from "formik";
import { TimePicker, TimePickerProps } from "formik-material-ui-pickers";
import React from "react";
import Wrapper, { WrapperProps } from "./ArrayFieldWrapper";

export type ArrayTimeFieldProps = WrapperProps & Partial<TimePickerProps>;

const ArrayTimeField = (props: ArrayTimeFieldProps) => {
  const { buttonStyles, isSubmitting, onDelete, ...rest } = props;
  return (
    <Wrapper
      onDelete={onDelete}
      isSubmitting={isSubmitting}
      buttonStyles={buttonStyles}
    >
      <Field component={TimePicker} {...rest} />
    </Wrapper>
  );
};

export default ArrayTimeField;
