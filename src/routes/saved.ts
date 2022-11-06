const router = require("express").Router();
import { prisma } from "../index";
const { verifyToken } = require("../token/verifyToken");

//SAVE POST OR REMOVE SAVED STATUS
router.post("/", verifyToken, async (req: any, res: any) => {
  try {
    const post = await prisma.saved.findFirst({
      where: {
        userId: req.body.userId,
        postId: req.body.postId,
      },
    });

    let save;

    if (post !== null) {
      save = await prisma.saved.deleteMany({
        where: {
          postId: req.body.postId,
          userId: req.body.userId
        }
      })
    } else {
       save = await prisma.saved.create({
        data: {
          userId: req.body.userId,
          postId: req.body.postId,
          saved: true
        },
      });
    }

    res.status(200).json(save);
  } catch (err) {
    res.status(404).json(err);
  } finally {
    prisma.$disconnect();
  }
});

module.exports = router;
