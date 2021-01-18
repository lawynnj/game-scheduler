import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import React from "react";

interface AddButtonProps {
  disabled: boolean;
  onClick: () => void;
}

const AddButton = ({ disabled, onClick }: AddButtonProps): JSX.Element => (
  <IconButton aria-label="add" size="medium" disabled={disabled} edge="start" onClick={onClick}>
    <AddIcon fontSize="small" />
  </IconButton>
);

export default AddButton;
