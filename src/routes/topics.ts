const router = require("express").Router();
import { prisma } from "../index";
const { verifyToken } = require("../token/verifyToken");

const InitialTopics: string[] = [
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

//GET ALL TOPICS
router.get("/", async (req: any, res: any) => {
  try {
    res.status(200).json(InitialTopics);
  } catch (err) {
    console.error("error executing query:", err);
  } finally {
    prisma.$disconnect();
  }
});

//CREATE TOPIC LIST BY USER ID
router.post("/:id", verifyToken, async (req: any, res: any) => {
  try {
    const topics = await prisma.topics.create({
      data: {
        userId: req.body.id,
        topics: req.body.topics,
      },
    });

    res.status(200).json(topics);
  } catch (err) {
    res.status(404).json(err);
  } finally {
    prisma.$disconnect();
  }
});

//DELETE TOPIC FROM USER
router.delete("/", verifyToken, async (req: any, res: any) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: req.body.id,
      },
      data: {
        Topics: {
          delete: {
            topics: req.body.topics,
          },
        },
      },
    });

    res.status(200).json(user);
  } catch (err) {
    res.status(404).json(err);
  } finally {
    prisma.$disconnect();
  }
});

//UPDATE TOPICS FROM USER ID
router.put("/:id", verifyToken, async (req: any, res: any) => {
  try {
    const topicList = await prisma.topics.findFirst({
      where: {
        userId: req.params.id,
      },
      select: {
        topics: true,
      },
    });

    const newTopicList = req.body.topics.concat(topicList.topics)

    const updatedList = await prisma.topics.update({
      where: {
        userId: req.params.id,
      },
      data: {
        topics: newTopicList,
      },
    });

    res.status(200).json(updatedList);
  } catch (err) {
    res.status(404).json(err);
  } finally {
    prisma.$disconnect();
  }
});

module.exports = router;
