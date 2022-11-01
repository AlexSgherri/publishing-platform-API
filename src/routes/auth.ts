const router = require("express").Router();
import { prisma } from "../index";
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req: any, res: any) => {
  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        email: req.body.email.toLowerCase(),
        password: req.body.password,
        age: req.body.age,
        name: req.body.name,
        role: req.body.role,
      },
    });
    res.status(200).json(user);
  } catch (err) {
    console.error("error executing query:", err);
  } finally {
    prisma.$disconnect();
  }
});

//LOGIN
router.post("/login", async (req: any, res: any) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: { equals: req.body.username, mode: "insensitive" },
      },
    });
    
    if (!user || req.body.password !== user.password)
      res.status(401).json("Wrong Username or Password!");

    const accessToken = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_KEY,
      { expiresIn: "3d" }
    );

    res.status(200).json({user, accessToken});
  } catch (err) {
    res.status(404).json(err);
  } finally {
    prisma.$disconnect();
  }
});

module.exports = router;
