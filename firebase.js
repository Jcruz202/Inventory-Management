// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRGiGvSvgMX7K5Fut5sZTUlU9x4oIJSyI",
  authDomain: "inventory-management-77eaf.firebaseapp.com",
  projectId: "inventory-management-77eaf",
  storageBucket: "inventory-management-77eaf.appspot.com",
  messagingSenderId: "119575005664",
  appId: "1:119575005664:web:30c855a3fa162ac5ecc385",
  measurementId: "G-9V7E0DZDK1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}