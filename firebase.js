// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgMjcySkCxQ8mDOxnElL3tUcZRX7ky1yA",
  authDomain: "inventory-management-1f139.firebaseapp.com",
  projectId: "inventory-management-1f139",
  storageBucket: "inventory-management-1f139.appspot.com",
  messagingSenderId: "102990277760",
  appId: "1:102990277760:web:f6e7a0c8c00b096c49ca65",
  measurementId: "G-JQB8PECBVV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}