const router = require("express").Router();
import { prisma } from "../index";
const { verifyToken } = require("../token/verifyToken");

//FIND ALL POST FOR USERS TOPICS
router.post("/find", async (req: any, res: any) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        topic: { hasSome: req.body.topics },
      },
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json(err);
  } finally {
    prisma.$disconnect();
  }
});

//FIND ALL POST FOR A USER ID
router.get("/find/author/:id", async (req: any, res: any) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: { in: req.params.id },
      },
      include: {
        author: true,
      },
    });
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(404).json(err);
  } finally {
    prisma.$disconnect();
  }
});

//CREATE POST
router.post("/create", verifyToken, async (req: any, res: any) => {
  try {
    const post = await prisma.post.create({
      data: {
        content: req.body.content,
        contentFormatted: req.body.contentFormatted,
        image: req.body.image,
        topic: req.body.topic,
        title: req.body.title,
        authorId: req.body.authorId,
      },
    });
    console.log("success");

    res.status(200).json(post);
  } catch (err) {
    console.log("problem");
    console.error("error executing query:", err);
  } finally {
    prisma.$disconnect();
  }
});

//FIND POST BY TOPIC
router.get("/find/:topic", verifyToken, async (req: any, res: any) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        topic: {
          has: req.params.topic,
        },
      },
      include: {
        author: {
          select: { avatar: true,
          username: true, },
        },
      },
      take: 10,
    });

    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json(err);
  } finally {
    prisma.$disconnect();
  }
});

module.exports = router;
