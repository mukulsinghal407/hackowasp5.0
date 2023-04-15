import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkQuantity } from "../../Bank/Add_Group/helperFunctions/checks";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../config/firebaseAuth";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { Button, TextField, Autocomplete, Grid } from "@mui/material";

const Appointment = ({ user,bank }) => {
  const [blood, setBlood] = useState();
  const [quantity, setQuantity] = useState(10);
  const navigate = useNavigate();

  //use-effect
  useEffect(() => {
    if (!user) navigate("/");
    console.log(user,bank);
  }, [user,bank,navigate]);

  //supporting functions
  const handleSubmit = async () => {
    if (blood && quantity && !checkQuantity(quantity)) {
      const newRequest = {
        blood,
        quantity,
        bank_id: bank.bank_id,
        user_id: user?.uid,
        phone: user.phone,
        name: user?.name
      };
      await addDoc(collection(db, "appointments"), newRequest);
      alert("Request Raised Successfully...");
    } else {
      alert("Invalid Input fields");
    }
  };

  return (
    <div id="order">
      <div className="main">
        <h1> Record a new request </h1>
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

export default Appointment;
