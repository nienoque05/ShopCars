
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB3HokKxebFwwm1l0HQTMk87N49mGfSUBw",
  authDomain: "webcarros-f2ba3.firebaseapp.com",
  projectId: "webcarros-f2ba3",
  storageBucket: "webcarros-f2ba3.appspot.com",
  messagingSenderId: "152149263625",
  appId: "1:152149263625:web:c48598f27914a922d53fd8"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export {db, auth, storage}