const router = require("express").Router();
import { prisma } from "../index";

//REGISTER
router.post("/register", async (req: any, res: any) => {
  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        name: req.body.name,
        role: req.body.role,
        topic: ["roba"]
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
router.get("/login", async (req: any, res: any) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: req.body.username,
        password: req.body.password,
      },
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json(err);
  } finally {
    prisma.$disconnect();
  }
});

module.exports = router;
