import React, { useCallback, useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import {
  Button,
  Grid,
  Modal,
  Box,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Plot from "react-plotly.js";
import { db } from "../../config/firebaseAuth";
import TableCompo from "../TableCompo/TableCompo";
import Appointment from "./Appointment/Appointment.jsx";
import Navbar from '../Navbar/Navbar'
import "./styles.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  heigh: "90%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const AllBanks = ({ user }) => {
  const [bank, setBanks] = useState([]);
  const [open, setOpen] = useState(false);
  const [openOrder, setOpenOrder] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dataFiltered, setDataFiltered] = useState([]);
  const [item, setItem] = useState([]);
  const [headings, setHeadings] = useState([]);
  const [appointment, setAppointment] = useState({});
  const [show, setShow] = useState(true);
  const [dist, setDistance] = useState();

  const fetchBanks = useCallback(async () => {
    onSnapshot(collection(db, "banks"), (queryResult) => {
      const result = [];
      queryResult.forEach((bank) => {
        result.push(bank.data());
      });
      setBanks(result);
    });
  }, []);

  const getHeadings = (bank) => {
    const keys = Object.keys(bank);
    let index = keys?.indexOf("bank_id");
    keys.splice(index, 1);
    index = keys.indexOf("name");
    keys.splice(index, 1);
    index = keys.indexOf("phone");
    keys.splice(index, 1);
    index = keys.indexOf("longitude");
    keys.splice(index, 1);
    index = keys.indexOf("latitude");
    keys.splice(index, 1);
    return keys;
  };
  const getItems = (bank) => {
    let result = [];
    const keys = getHeadings(bank);
    keys.forEach((key) => result.push(bank[key]));
    return result;
  };

  const handleOpen = (index) => {
    setOpen(true);
    const item = getItems(dataFiltered[index]);
    setHeadings(getHeadings(dataFiltered[index]));
    setAppointment(dataFiltered[index]);
    setItem(item);
  };
  const handleClose = (index) => {
    setOpen(false);
    setItem([]);
    setAppointment({});
  };

  const showBook = () => {
    let items = window.location.href.split("/");
    let index = items.indexOf("banks");
    return !(index > -1);
  };

  useEffect(() => {
    if (!searchQuery) {
      setDataFiltered(bank);
    } else {
      setDataFiltered(
        bank.filter((d) => d.name.toLowerCase().includes(searchQuery))
      );
    }
  }, [searchQuery, bank]);

  const getDistance = async (lat, lon) => {
    const temp = localStorage.getItem("location");
    const latitude = JSON.parse(temp).latitude;
    const longitude = JSON.parse(temp).longitude;
    let url =
      "http://127.0.0.1:5000/dist?latitude=" +
      String(latitude) +
      "&longitude=" +
      String(longitude) +
      "&lat=" +
      String(lat) +
      "&lon=" +
      String(lon);
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setDistance(data[0]);
      });
    // const response = await fetch(url);
    // const data = await response.json();
    // console.log(data);
    // setDistance(data);
    // (data);
  };

  useEffect(() => {
    fetchBanks();
    console.log(dist);
  }, [fetchBanks, dataFiltered, dist]);

  return (
    <>
      <Navbar/>
      <div className="temp">
        <div style={{ margin: "10px 30px" }}>
          <h1>Banks Nearby</h1>
          <TextField
            fullWidth
            id="search-bar"
            className="text"
            onInput={(e) => {
              //just get the toOrders search result modified here and we are done.
              setSearchQuery(e.target.value);
            }}
            label="Enter the bank name"
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
                      <strong>Name : </strong>
                      {order.name}
                    </p>
                    <p>
                      <strong>Phone : </strong>
                      {order.phone}
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
                    {show ? (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                          getDistance(order.latitude, order.longitude);
                          setShow(false);
                        }}
                      >
                        View Distance
                      </Button>
                    ) : (
                      <div>
                        <p>
                          <strong>Distance : </strong>
                          {dist?.distance.text}
                        </p>
                        <p>
                          <strong>Time : </strong>
                          {dist?.duration.text}
                        </p>
                      </div>
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    columnGap={2}
                    columnSpacing={2}
                    rowGap={2}
                    rowSpacing={2}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <Button
                      variant="outlined"
                      color={"warning"}
                      onClick={() => {
                        handleOpen(index);
                      }}
                    >
                      View Details
                    </Button>
                  </Grid>
                </Grid>
              </>
            );
          })}
          {bank.length ? "" : <h4>Seems Like you don't have any orders</h4>}
          <hr />
        </div>
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Blood Type
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TableCompo item={item} headings={headings} />
            <Plot
              data={[
                {
                  y: item,
                  x: headings,
                  type: "line+marker",
                  marker: { color: "red" },
                },
                { type: "bar", y: item, x: headings },
              ]}
              layout={{ title: "Inventory" }}
              useResizeHandler={true}
            />
          </Typography>
          <br />
          {showBook() ? (
            <div style={{ "text-align": "center" }}>
              <Button
                variant="outlined"
                color="success"
                onClick={() => setOpenOrder(true)}
              >
                {" "}
                Book Order{" "}
              </Button>
            </div>
          ) : null}
        </Box>
      </Modal>
      <Modal
        open={openOrder}
        onClose={() => {
          setOpenOrder(false);
          setOpen(false);
        }}
      >
        <Box sx={style}>
          <Appointment user={user} bank={appointment} />
        </Box>
      </Modal>
    </>
  );
};

export default AllBanks;
