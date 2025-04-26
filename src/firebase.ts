import {
  FirebaseAuthProvider,
  FirebaseDataProvider,
  RAFirebaseOptions,
} from "react-admin-firebase";

import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export const firebaseConfig = {
  apiKey: "AIzaSyD8xZsbxfkk3--r8B6b2fEHO5dtLrn0aJo",
  authDomain: "test-admin-73f9b.firebaseapp.com",
  projectId: "test-admin-73f9b",
  storageBucket: "test-admin-73f9b.appspot.com",
  messagingSenderId: "935849046499",
  appId: "1:935849046499:web:653097ff0c0cb650e8b0d6",
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);

export const options: RAFirebaseOptions = {
  // app: firebaseApp,
  // persistence: "session",
};

export const firebaseAuthProvider = FirebaseAuthProvider(
  firebaseConfig,
  options
);

export const firestoreDataProvider = FirebaseDataProvider(
  firebaseConfig,
  options
);

firestore;
