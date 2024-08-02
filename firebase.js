// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBp5SCFjtkhAte-o7eFfhCDP5oMXbySMnE",
    authDomain: "inventory-management-91902.firebaseapp.com",
    projectId: "inventory-management-91902",
    storageBucket: "inventory-management-91902.appspot.com",
    messagingSenderId: "113125383730",
    appId: "1:113125383730:web:50eb00abb33e75571be62b",
    measurementId: "G-3PGWYHMXF2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore }