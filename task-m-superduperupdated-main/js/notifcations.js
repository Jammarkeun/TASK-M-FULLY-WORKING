class NotificationHandler {
    constructor() {
        this.checkPermission();
    }

    checkPermission() {
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
            console.log("Notification permission granted");
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                    console.log("Notification permission granted");
                }
            });
        }
    }

    sendNotification(title, options = {}) {
        if (Notification.permission === "granted") {
            const notification = new Notification(title, options);
            notification.onclick = function() {
                window.focus();
                this.close();
            };
        }
    }

    scheduleNotification(title, options = {}, delay) {
        setTimeout(() => {
            this.sendNotification(title, options);
        }, delay);
    }
}

// Usage example:
// const notificationHandler = new NotificationHandler();
// notificationHandler.sendNotification("New Task", { body: "You have a new task assigned" });
// notificationHandler.scheduleNotification("Task Due Soon", { body: "Your task is due in 1 hour" }, 3600000); // 1 hour delay