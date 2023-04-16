import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { logout } from "../../config/firebaseAuth";
import { useNavigate } from "react-router-dom";

import logo from '../../assets/logo.png'

const pages = ["Dashboard","Banks"];

const getLocation = ()=>{
  const temp = window.location.href.split('/')
  return temp[3].toLowerCase();
}

function Navbar() {
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="primary" style={{backgroundColor:"#E74646"}}>
      <Container maxWidth="xl">
        <Toolbar>
          <img src={logo} alt="logo" height={"80px"}/>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs:"flex", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              marginRight:"200px"
            }}
          >
            Rakt
          </Typography>
          <Box sx={{ flexGrow: 18, display: { xs: "flex", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => navigate(`/${page.toLocaleLowerCase()}`)}
                sx={{ my: 2, color: "white", display: "block", marginRight:"10px", backgroundColor:getLocation()===page.toLowerCase()?"#FA9884":null }}
              >
                <strong>{page}</strong>
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Button variant="contained" color="secondary" onClick={logout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
