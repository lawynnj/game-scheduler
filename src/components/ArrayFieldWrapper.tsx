import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import React, { ReactChild, ReactChildren } from "react";

export interface WrapperProps {
  isSubmitting?: boolean;
  name?: string;
  type?: string;
  buttonStyles?: object;
  onDelete?: () => void;
  children?: ReactChild | ReactChildren;
}

const Wrapper = (props: WrapperProps) => {
  const {
    isSubmitting = false,
    buttonStyles = { marginLeft: 5 },
    onDelete = () => undefined,
    children,
  } = props;

  return (
    <Box display="flex" alignItems="center">
      {children}
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

export default Wrapper;
