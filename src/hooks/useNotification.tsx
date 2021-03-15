import { useContext } from "react";
import { ContextType, NotificationContext } from "../contexts/NotificationContext";

function useNotification(): ContextType {
  const { notif, addNotification, removeNotif } = useContext(NotificationContext);

  return { notif, addNotification, removeNotif };
}

export default useNotification;
