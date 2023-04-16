import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { db } from "../../../config/firebaseAuth";
import {
  query,
  collection,
  where,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { Button, Grid, TextField, InputAdornment } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

const Appoitment = ({ user }) => {
  const [request, setRequest] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dataFiltered, setDataFiltered] = useState([]);
  const navigate = useNavigate();

  const fetchRequests = useCallback(async () => {
    const q = query(
      collection(db, "appointments"),
      where("bank_id", "==", user?.uid),
      where("recieved","==",false)
    );
    onSnapshot(q, (querySnapshot) => {
      let result = [];
      querySnapshot.forEach((req) => {
        result.push({ info: req.data(), id: req.id });
      });
      setRequest(result);
    });
  }, [user?.uid]);

  useEffect(() => {
    if (!searchQuery) {
      setDataFiltered(request);
    } else {
      setDataFiltered(
        request.filter((d) => d.info.phone.toLowerCase().includes(searchQuery))
      );
    }
  }, [searchQuery, request]);

  useEffect(() => {
    if (!user) navigate("/");
    fetchRequests();
  }, [user, navigate, fetchRequests]);

  const handleTransaction = async (order) => {
    const bankRef = doc(db, "banks", user?.uid);
    const doct = await getDoc(bankRef);
    const newUser = doct.data();
    if (newUser[order.info.blood] - order.info.quantity >= 0) {
      newUser[order.info.blood] =
        newUser[order.info.blood] - Number(order.info.quantity);
      await setDoc(doc(db, "banks", newUser.bank_id), newUser);
      const date = new Date();
      await updateDoc(doc(db, "appointments", order.id), {
        recieved: "true",
        date: date.toLocaleDateString() + date.toLocaleTimeString(),
      });
    } else {
      alert("The request cannot be granted...");
    }
  };

  return (
    <>
      <div style={{ margin: "10px 30px" }}>
        <h1>Outstanding Requests</h1>
        <TextField
          fullWidth
          id="search-bar"
          className="text"
          onInput={(e) => {
            //just get the toOrders search result modified here and we are done.
            setSearchQuery(e.target.value);
          }}
          label="Enter the phone number"
          variant="outlined"
          placeholder="Search..."
          size="medium"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <hr />
      </div>
      <div style={{ margin: "10px 30px" }}>
        {dataFiltered.map((order, index) => {
          return (
            <>
              <Grid key={index} container style={{ margin: "10px 30px" }}>
                <Grid
                  item
                  xs={7}
                  columnGap={2}
                  columnSpacing={2}
                  rowGap={2}
                  rowSpacing={2}
                >
                  <p>
                    <strong>Blood Group : </strong>
                    {order.info.blood}
                  </p>
                  <p>
                    <strong>Quantity : </strong>
                    {order.info.quantity}
                  </p>
                  <p>
                    <strong>Name : </strong>
                    {order.info.name}
                  </p>
                  <p>
                    <strong>Phone : </strong>
                    {order.info.phone}
                  </p>
                </Grid>
                <Grid
                  item
                  xs={3}
                  columnGap={2}
                  columnSpacing={2}
                  rowGap={2}
                  rowSpacing={2}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  {!order.recieved ? (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleTransaction(order)}
                    >
                      Done
                    </Button>
                  ) : null}
                </Grid>
              </Grid>
            </>
          );
        })}
        {request.length ? "" : <h4>Seems Like you don't have any requests</h4>}
        <hr />
      </div>
    </>
  );
};

export default Appoitment;
