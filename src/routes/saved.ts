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
          userId: req.body.userId,
        },
      });
    } else {
      save = await prisma.saved.create({
        data: {
          userId: req.body.userId,
          postId: req.body.postId,
          saved: true,
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

type SavedPostIdType = {
  postId: string;
};

//GET ALL SAVED POST FOR A SINGLE USER BY ID
router.get("/:id", verifyToken, async (req: any, res: any) => {
  try {
    const postsId = await prisma.saved.findMany({
      where: {
        userId: req.params.id,
      },
      select: {
        postId: true,
      },
    });

    const postIdList = postsId.map((ele: SavedPostIdType) => ele.postId);

    const postsList = await prisma.post.findMany({
      where: {
        id: {
          in: postIdList,
        },
      },
      include: {
        author: {
          select: { avatar: true,
          username: true, },
        },
      },
    });

    res.status(200).json(postsList);
  } catch (err) {
    res.status(404).json(err);
  } finally {
    prisma.$disconnect();
  }
});

module.exports = router;
