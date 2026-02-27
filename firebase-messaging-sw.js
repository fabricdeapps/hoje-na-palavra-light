// Firebase Cloud Messaging Service Worker
// Hoje na Palavra - firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// ============================================================
// FIREBASE CONFIG
// Replace with your Firebase project config from:
// https://console.firebase.google.com → Project Settings → Web App
// ============================================================
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message:', payload);

  const notificationTitle = payload.notification?.title || '☀️ Hoje na Palavra';
  const notificationOptions = {
    body: payload.notification?.body || '✦ Sua reflexão diária está pronta!',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'daily-devotional',
    data: { url: payload.data?.url || '/' }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
