export const requestNotificationPermission = (): void => {
  if (typeof Notification !== "undefined" && Notification.permission === "default") {
    void Notification.requestPermission();
  }
};

export const showNotification = (body: string): void => {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") {
    return;
  }

  const notification = new Notification("Pomodoro Clock", { body });
  setTimeout(() => notification.close(), 10 * 1000);
};
