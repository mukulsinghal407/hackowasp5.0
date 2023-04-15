import React, {useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../Navbar/Navbar";
import "./styles.css";

import AllBanks from "../AllBanks/AllBanks";

const Bank = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  return (
    <>
      <Navbar />
      <AllBanks user={user} />
    </>
  );
};

export default Bank;
