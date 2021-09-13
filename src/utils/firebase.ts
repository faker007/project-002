import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBd2q_j6RR7vDwGp-6oFmZj2JUoruC97fM",
  authDomain: "jido-button.firebaseapp.com",
  projectId: "jido-button",
  storageBucket: "jido-button.appspot.com",
  messagingSenderId: "1094443221312",
  appId: "1:1094443221312:web:3b1f108b26617bf6fcfaa5",
  measurementId: "G-9BDBHK73WD",
};

firebase.initializeApp(firebaseConfig);

export const fBase = firebase;
export const authService = firebase.auth();
export const storageService = firebase.storage();
export const dbService = firebase.firestore();
