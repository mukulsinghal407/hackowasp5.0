import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../Navbar/Navbar";
import Order from "./Add_Group/Order/Order";
import Appointment from './Appointment/Appoitment';

import { db } from "../../config/firebaseAuth";
import { collection, query, where, onSnapshot } from "firebase/firestore";

import "./styles.css";

const Bank = ({ user }) => {
  const [bank, setBank] = useState([]);
  const [section, setSection] = useState(0);
  const navigate = useNavigate();

  const fetchBank = useCallback(async () => {
    const docRef = query(collection(db, "banks"), where("bank_id","==",user?.uid));
    onSnapshot(docRef,output=>{
      output.forEach((bank) => { setBank(bank.data());});
    });
    
  }, [user?.uid]);

  const rights = [<Order user={bank}/>,<Appointment user={user}/>];

  useEffect(() => {
    if (!user) navigate("/");
    else fetchBank();
  }, [user, navigate, fetchBank]);

  const handleChange = (e) => {
    const value = e.target.value;
    console.log(e.target.classList.toggle("active"));
    setSection(value);
  };

  const SideBar = (props) => {
    return (
      <div className="sidebar">
        <div className="initials">
          <img
            src={
              "https://api.dicebear.com/6.x/initials/svg?seed=" +
              user.name +
              "&radius=50&size=96&backgroundType=gradientLinear"
            }
            className="initials"
            alt="Name"
          />
        </div>
        <h2>Welcome {user.name} 👋</h2>
        <div className="items">
          <button
            className={
              //eslint-disable-next-line
              section == 0 ? "active" : ""
            }
            value={0}
            onClick={handleChange}
          >
            Inventory
          </button>
          <button
            className={
              //eslint-disable-next-line
              section == 1 ? "active" : ""
            }
            value={1}
            onClick={handleChange}
          >
            Appointment
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <SideBar />
        <div className="content">
          {rights[section]}
        </div>
      </div>
    </>
  );
};

export default Bank;
