import { Field, FieldAttributes } from "formik";
import { DatePicker, TimePickerProps } from "formik-material-ui-pickers";
import React from "react";
import ArrayFieldWrapper, { ArrayFieldWrapperProps } from "./ArrayFieldWrapper";

export type ArrayDateFieldProps = ArrayFieldWrapperProps & FieldAttributes<any> & Partial<TimePickerProps>;

const ArrayDateField = (props: ArrayDateFieldProps) => {
  const { deleteBtnProps, onDelete, ...rest } = props;
  return (
    <ArrayFieldWrapper onDelete={onDelete} deleteBtnProps={deleteBtnProps}>
      <Field component={DatePicker} {...rest} />
    </ArrayFieldWrapper>
  );
};

export default ArrayDateField;
