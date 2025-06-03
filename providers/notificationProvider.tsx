import React, { createContext, useContext, useEffect, useState } from "react";
import * as Notifications from "expo-notifications";

type NotificationContextType = {
  lastNotification?: Notifications.Notification;
  clearNotification: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lastNotification, setLastNotification] =
    useState<Notifications.Notification>();

  useEffect(() => {
    // Set up how notifications should be handled
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: false, // Prevent banner
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    let receivedListener: Notifications.Subscription;
    let responseListener: Notifications.Subscription;

    receivedListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
        setLastNotification(notification);
        handleCustomNotification(notification);
      }
    );

    responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("User tapped notification:", response);
        handleCustomNotification(response.notification);
      }
    );

    return () => {
      receivedListener.remove();
      responseListener.remove();
    };
  }, []);

  const handleCustomNotification = (notification: Notifications.Notification) => {
    const { data } = notification.request.content;

    if (data?.type === "refresh-data") {
      console.log("Refreshing data...");
      // Call a function to refresh data
    } else if (data?.type === "navigate") {
      console.log("Navigating to screen:", data.screen);
      // Use navigation logic here
    }
  };

  const clearNotification = () => {
    setLastNotification(undefined);
  };

  return (
    <NotificationContext.Provider value={{ lastNotification, clearNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
