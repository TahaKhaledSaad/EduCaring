import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
export const firebaseConfig = {
  apiKey: "AIzaSyCWLSuPhauhT8wg3OrYU6dut70UHwHlJpg",
  authDomain: "educaring-792c3.firebaseapp.com",
  projectId: "educaring-792c3",
  storageBucket: "educaring-792c3.appspot.com",
  messagingSenderId: "42357946169",
  appId: "1:42357946169:web:d03bd3fbe1e0c8da9d9ae8",
  measurementId: "G-8S61DR0SFD",
};

// Firebase configuration

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get Firebase Messaging instance
export const messaging = getMessaging(app);
export const requestNotificationPermission = async () => {
  try {
    await messaging.requestPermission();
    console.log("Notification permission granted.");
  } catch (error) {
    console.error("Unable to get permission to notify.", error);
  }
};
