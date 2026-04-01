importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");

// Force service worker to activate immediately
self.addEventListener("install", (event) => {
  self.skipWaiting(); // ✅ activate immediately
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim()); // ✅ take control of page
});

firebase.initializeApp({
  apiKey: "AIzaSyAnjAoJvUO-lNPK4rw48RcsJURJ-LbXzhw",
  authDomain: "scantosteward.firebaseapp.com",
  projectId: "scantosteward",
  messagingSenderId: "593006780050",
  appId: "1:593006780050:web:9b742a0ff31cfb342d904b",
});

const messaging = firebase.messaging();

// Handle background messages from FCM
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message received:", payload);
  self.registration.showNotification(payload.notification?.title || "Medicine Reminder", {
    body: payload.notification?.body || "Time to take your medicine",
    icon: "/favicon.ico",
  });
});

// REQUIRED fallback
self.addEventListener("push", function (event) {
  const data = event.data?.json() || {};

  self.registration.showNotification(data.notification?.title || "Reminder", {
    body: data.notification?.body || "Time to take medicine",
    icon: "/favicon.ico",
  });
}) ;