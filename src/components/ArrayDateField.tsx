import { Field } from "formik";
import { DatePicker, TimePickerProps } from "formik-material-ui-pickers";
import React from "react";
import Wrapper, { WrapperProps } from "./ArrayFieldWrapper";

export type ArrayDateFieldProps = WrapperProps & Partial<TimePickerProps>;

const ArrayDateField = (props: ArrayDateFieldProps) => {
  const { buttonStyles, isSubmitting, onDelete, ...rest } = props;
  return (
    <Wrapper
      onDelete={onDelete}
      isSubmitting={isSubmitting}
      buttonStyles={buttonStyles}
    >
      <Field component={DatePicker} {...rest} />
    </Wrapper>
  );
};

export default ArrayDateField;
