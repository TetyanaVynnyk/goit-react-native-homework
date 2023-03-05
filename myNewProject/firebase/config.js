// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import {
    initializeAuth,
    getReactNativePersistence
  } from 'firebase/auth/react-native';
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
    apiKey: "AIzaSyDEOS9SokQWK3CPxNo6FpR1F8_B0pYPdxo",
    authDomain: "addposts-daffc.firebaseapp.com",
    projectId: "addposts-daffc",
    storageBucket: "addposts-daffc.appspot.com",
    messagingSenderId: "332779798798",
    appId: "1:332779798798:android:059429fbf1f8fc3c97d75f",
    measurementId: "project-332779798798",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  
  export { auth };

export const firestore = getFirestore(app);