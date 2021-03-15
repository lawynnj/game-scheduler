import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import useNotification from "../hooks/useNotification";

function Notification(): JSX.Element {
  const { notif, removeNotif } = useNotification();

  const handleClose = () => {
    removeNotif();
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={!!notif}
      autoHideDuration={6000}
      onClose={handleClose}
      message={notif ? notif.message : ""}
      action={
        <React.Fragment>
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
    />
  );
}

export default Notification;
