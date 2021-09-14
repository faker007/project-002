import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDzoaOuPcCgA3R2iBLd8TG6ILYqQ4_AxVQ",
  authDomain: "seogyeong-time.firebaseapp.com",
  projectId: "seogyeong-time",
  storageBucket: "seogyeong-time.appspot.com",
  messagingSenderId: "730917674820",
  appId: "1:730917674820:web:0c29883f0d3208825b8111",
};

const app = initializeApp(firebaseConfig);

export const authService = getAuth(app);
export const storageService = getStorage(app);
export const dbService = getFirestore(app);
