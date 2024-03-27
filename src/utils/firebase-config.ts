import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
// 38:43
const firebaseConfig = {
  apiKey: "AIzaSyDezNGlOMNBQupEBF3cfG6QETf-j045AfY",
  authDomain: "netflix-clone-3fe81.firebaseapp.com",
  projectId: "netflix-clone-3fe81",
  storageBucket: "netflix-clone-3fe81.appspot.com",
  messagingSenderId: "688109283088",
  appId: "1:688109283088:web:5544f019382f6aaddfa795",
  measurementId: "G-PY11B8VMVT"
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);