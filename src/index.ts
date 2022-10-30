const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors")
const authRoutes = require("./routes/register")
const postRoutes = require("./routes/post")
const topicsRoutes = require("./routes/topics")
const { PrismaClient } = require("@prisma/client");

export const prisma = new PrismaClient();

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes)
app.use("/api/post", postRoutes)
app.use("/api/topics", topicsRoutes)

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});