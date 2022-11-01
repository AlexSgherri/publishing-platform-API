const router = require("express").Router();
import { prisma } from "../index";

const topics =["roba", "roba2", "roba3"]

//FIND POST BY DATE
// router.get("/foryou", async (req: any, res: any) => {
//   const date = new Date();

//   try {
//     const posts = await prisma.post.findMany({
//       where: {
//         updatedAt: {
//           lte: date
//         }
//       },
//       take: 10,
//       include:{

//       }
//     });

//     res.status(200).json(req.params.a);
//   } catch (err) {
//     res.status(404).json(err);
//   } finally {
//     prisma.$disconnect();
//   }
// });

//CREATE POST
router.post("/create", async (req: any, res: any) => {
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
    res.status(200).json(post);
  } catch (err) {
    console.error("error executing query:", err);
  } finally {
    prisma.$disconnect();
  }
});

//FIND POST BY TOPIC
router.get("/find/:topic", async (req: any, res: any) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        topic: {
          has: req.params.topic,
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