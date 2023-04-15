import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebaseAuth";
import { query, getDocs,collection,where } from "firebase/firestore";

import Bank from "../Bank/Bank";
import NormalFolks from "../NormalFolks/NormalFolks";
import Hosptial from "../Hospital/Hospital";

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState({});
  const [role, setRole] = useState(-1);
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  let roles = [
    <Bank user={currentUser} />,
    <Hosptial user={currentUser} />,
    <NormalFolks user={currentUser} />
  ];

  const fetchUserName = useCallback(async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setCurrentUser(data);
      if (data.role === "bank") {
        setRole(0);
      } else if (data.role === "hospital") {
        setRole(1);
      } else if (data.role === "normalfolks") {
        setRole(2);
      }
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  }, [user?.uid]);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) return navigate("/");
    if (error) console.error(error);
    fetchUserName();
  }, [user, loading, error, navigate, fetchUserName]);

  return <>{loading ? null : roles[role]}</>;
};

export default Dashboard;