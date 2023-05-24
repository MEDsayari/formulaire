require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const formRoutes = require("./routes/form");
const questRoutes = require("./routes/quest");
const visiteurRoutes =require("./routes/visiteur");
const reponseRoutes = require ("./routes/reponse");

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/form",formRoutes);
app.use("/quest",questRoutes);
app.use ("/visiteur",visiteurRoutes);
app.use("/reponse",reponseRoutes);


const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log("serveur en marche")
})
