import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { getFirestore, getDoc, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBqi6MSpVcOz0xfDA72E6k6CjWe-T7Ayt0",
  authDomain: "blood-bank-management-3171d.firebaseapp.com",
  projectId: "blood-bank-management-3171d",
  storageBucket: "blood-bank-management-3171d.appspot.com",
  messagingSenderId: "515818855399",
  appId: "1:515818855399:web:94b9bf4ff6927eae3efb42"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
  }
};
const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    console.log(user);
  } catch (err) {
    console.error(err);
  }
};

const logout = () => {
  signOut(auth);
};

const updateStock = async (from, contents) => {
  const docRef = doc(db, "stock", from);
  const document = await getDoc(docRef);
  var data = document.data();
  contents.map((item) => {
    if (data[item.label]) data[item.label] -= item.quantity;
    else data[item.label] = 0;
    return "";
  });
  await setDoc(doc(db, "stock", from), data);
};

const checkStockAvailable = async(contents,location)=>{
  
}

export {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
  updateStock,
  checkStockAvailable
};
