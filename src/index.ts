const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors")
const authRoutes = require("./routes/auth")
const postRoutes = require("./routes/post")
const topicsRoutes = require("./routes/topics")
const savedRoutes = require("./routes/saved")
const { PrismaClient } = require("@prisma/client");

export const prisma = new PrismaClient();

dotenv.config();

const app = express();
app.use(cors())
app.use(express.json());

app.use("/api/auth", authRoutes)
app.use("/api/post", postRoutes)
app.use("/api/topics", topicsRoutes)
app.use("/api/saved",savedRoutes)

// //HTTP ERROR HANDLER
// app.use((req:any, res:any, next:any)=>{
//   res.status(404).send("Could not find route"); 
// })

app.use((error:any , req:any, res:any, next:any) =>{
  if(res.headerSent){
    res.status(error.code || 500);
    res.json({message: error.message || "Uknow error"})
  }
  next()
})

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});