const router = require("express").Router();
import { prisma } from "../index";

router.post("/", async (req: any, res: any) => {
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

router.delete("/", async (req: any, res: any) => {
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

module.exports = router;
