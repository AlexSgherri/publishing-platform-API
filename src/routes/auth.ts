const router = require("express").Router();
import { prisma } from "../index";
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const InitialTopics = [
  "Data Science",
  "Film",
  "Technology",
  "Programming",
  "Gaming",
  "Self Improvement",
  "Writing",
  "Relationships",
  "Machine Learning",
  "Productivity",
  "Politics",
];

//REGISTER
router.post("/register", async (req: any, res: any) => {
  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        email: req.body.email.toLowerCase(),
        password: CryptoJS.AES.encrypt(
          req.body.password,
          process.env.SECRET_PSW
        ).toString(),
        age: req.body.age,
        avatar: req.body.avatar,
        name: req.body.name,
        role: req.body.role,
        Topics: {
          create: { topics: InitialTopics },
        },
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

    const hashedPsw = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_PSW
    );
    const psw = hashedPsw.toString(CryptoJS.enc.Utf8);

    if (!user || req.body.password !== psw)
      res.status(401).json("Wrong Username or Password!");

    const accessToken = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_KEY,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(404).json(err);
  } finally {
    prisma.$disconnect();
  }
});

router.get("/topics", async (req: any, res: any) => {
  try {
    res.status(200).json(InitialTopics);
  } catch (err) {
    console.error("error executing query:", err);
  } finally {
    prisma.$disconnect();
  }
});

module.exports = router;
