import PropTypes from "prop-types";
import React, { ReactChild, useCallback, useState } from "react";

interface Notification {
  message: string;
  status: string;
}

export type ContextType = {
  notif?: Notification;
  addNotification: (message: string, status?: string) => void;
  removeNotif: () => void;
};

export const NotificationContext = React.createContext<ContextType>({
  notif: undefined,
  addNotification: () => ({}),
  removeNotif: () => ({}),
});

function NotificationProvider({ children }: { children: ReactChild }): JSX.Element {
  const [notif, setNotif] = useState<Notification | undefined>(undefined);

  const removeNotif = () => setNotif(undefined);

  const addNotification = (message: string, status: string) => setNotif({ message, status });

  const contextValue = {
    notif,
    addNotification: useCallback((message, status) => addNotification(message, status), []),
    removeNotif: useCallback(() => removeNotif(), []),
  };

  return <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>;
}

NotificationProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export default NotificationProvider;
