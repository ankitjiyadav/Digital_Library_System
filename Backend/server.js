const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors= require("cors");

const app =express();

// middleware
app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/library",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=> console.log("Connected to MongoDB"))
.catch((err)=>console.error("Error connecting to mongodb",err));

app.use("/api/users",userRoutes);

const PORT =5000;
app.listen(PORT,()=>console.log(`Server running on http://localhost:${PORT}`))
