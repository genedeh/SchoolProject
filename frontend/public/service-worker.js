import reminder_icon from "../src/assets/reminder_icon.jpg"

self.addEventListener("push", (event) => {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: reminder_icon,
        requireInteraction: true,
    });
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow("/dashboard/home") // Redirect to the dashboard when clicked
    );
});
