import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Autocomplete, Grid } from "@mui/material";
import {
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../../config/firebaseAuth";
import { checkQuantity } from "../helperFunctions/checks";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import Plot from "react-plotly.js";
import "./styles.css";
import TableCompo from "../../../TableCompo/TableCompo";

const Order = ({ user }) => {
  //Use States and navigate
  const [blood, setBlood] = useState();
  const [quantity, setQuantity] = useState(10);
  const navigate = useNavigate();

  //Use-Effect
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    console.log(blood,quantity);
  }, [navigate, user,blood,quantity]);

  //Support functions
  const getHeadings = (bank) => {
    const keys = Object.keys(bank);
    let index = keys?.indexOf("bank_id");
    keys.splice(index, 1);
    index = keys.indexOf("name");
    keys.splice(index, 1);
    index = keys.indexOf("phone");
    keys.splice(index, 1);
    index = keys.indexOf("latitude");
    keys.splice(index, 1);
    index = keys.indexOf("longitude");
    keys.splice(index, 1);
    return keys;
  };

  const getItems = (bank) => {
    let result = [];
    const keys = getHeadings(bank);
    keys.forEach((key) => result.push(bank[key]));
    return result;
  };

  const handleSubmit = async () => {
    const newUser = user;
    if (user && blood && quantity && !checkQuantity(quantity)) {
      newUser[blood] = newUser[blood] + quantity;
      await setDoc(doc(db, "banks", user?.bank_id), newUser);
    } else {
      alert("Invalid Input Found");
    }
  };

  //Final return function.
  return (
    <div id="order">
      <div className="main">
        <h1> Record New Addition </h1>
        <hr />
        <TableCompo item={getItems(user)} headings={getHeadings(user)} />
        {/* <Plot
        data={[
          {
            y: getItems(user),
            x: getHeadings(user),
            type: "line+marker",
            marker: { color: "red" },
          },
          {type: 'bar', y: getItems(user),
            x: getHeadings(user),},
        ]}
        layout={{ title: "Inventory" }}
        useResizeHandler={true}
      /> */}
        <hr />
        <Grid container columnSpacing={2} rowGap={2}>
          <Grid item xs={12}>
            <Autocomplete
              fullWidth
              id="tags-outlined"
              options={["A+", "O-", "A-", "O+", "AB+", "B-", "AB-", "B+"]}
              onChange={(e, newValue) => setBlood(newValue)}
              getOptionLabel={(option) => option}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Blood Group"
                  placeholder="Blood Group"
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              value={quantity}
              required
              inputProps={{ minLength: 1 }}
              error={checkQuantity(quantity)}
              helperText={checkQuantity(quantity) ? "Invalid Quantity" : null}
              type="text"
              label="Number of Units"
              variant="outlined"
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              endIcon={<SendRoundedIcon />}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Order;
