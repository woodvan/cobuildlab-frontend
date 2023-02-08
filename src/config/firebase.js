import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/performance";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const fbApp = firebase.initializeApp(firebaseConfig);
export const auth = fbApp.auth();
export const storage = firebase.storage(fbApp).ref();
export const perf = firebase.performance(fbApp);

export default fbApp;
