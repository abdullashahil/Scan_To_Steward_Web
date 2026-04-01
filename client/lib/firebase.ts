import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_DOMAIN",
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID",
// };
const firebaseConfig = {
  apiKey: "AIzaSyAnjAoJvUO-lNPK4rw48RcsJURJ-LbXzhw",
  authDomain: "scantosteward.firebaseapp.com",
  projectId: "scantosteward",
  messagingSenderId: "593006780050",
  appId: "1:593006780050:web:9b742a0ff31cfb342d904b",
};

console.log("Firebase config:", firebaseConfig);

const app = initializeApp(firebaseConfig);

export const getMessagingInstance = async () => {
  const supported = await isSupported();

  if (supported && typeof window !== "undefined") {
    return getMessaging(app);
  }

  return null;
};
