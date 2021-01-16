import Box from "@material-ui/core/Box";
import IconButton, { IconButtonProps } from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import React, { ReactChild, ReactChildren } from "react";
import { SvgIconProps } from "@material-ui/core/SvgIcon";
export interface ArrayFieldWrapperProps {
  deleteBtnProps?: IconButtonProps;
  onDelete?: () => void;
  iconProps?: SvgIconProps;
  children?: ReactChild | ReactChildren;
}

function getIconProps(props: SvgIconProps): SvgIconProps {
  return {
    fontSize: "small",
    ...props,
  };
}

function getBtnProps(props: IconButtonProps): IconButtonProps {
  return {
    style: {
      marginLeft: 5,
    },
    "aria-label": "delete",
    ...props,
  };
}

const ArrayFieldWrapper = (props: ArrayFieldWrapperProps): JSX.Element => {
  const { deleteBtnProps = {}, onDelete = () => undefined, iconProps = {}, children } = props;

  return (
    <Box display="flex" alignItems="center">
      {children}
      <div>
        <IconButton {...getBtnProps(deleteBtnProps)} onClick={onDelete}>
          <DeleteIcon {...getIconProps(iconProps)} />
        </IconButton>
      </div>
    </Box>
  );
};

export default ArrayFieldWrapper;
