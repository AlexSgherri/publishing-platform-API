"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
const index_1 = require("../index");
const { verifyToken } = require("../token/verifyToken");
//SAVE POST OR REMOVE SAVED STATUS
router.post("/", verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield index_1.prisma.saved.findFirst({
            where: {
                userId: req.body.userId,
                postId: req.body.postId,
            },
        });
        let save;
        if (post !== null) {
            save = yield index_1.prisma.saved.deleteMany({
                where: {
                    postId: req.body.postId,
                    userId: req.body.userId,
                },
            });
        }
        else {
            save = yield index_1.prisma.saved.create({
                data: {
                    userId: req.body.userId,
                    postId: req.body.postId,
                    saved: true,
                },
            });
        }
        res.status(200).json(save);
    }
    catch (err) {
        res.status(404).json(err);
    }
    finally {
        index_1.prisma.$disconnect();
    }
}));
//GET ALL SAVED POST FOR A SINGLE USER BY ID
router.get("/:id", verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postsId = yield index_1.prisma.saved.findMany({
            where: {
                userId: req.params.id,
            },
            select: {
                postId: true,
            },
        });
        const postIdList = postsId.map((ele) => ele.postId);
        const postsList = yield index_1.prisma.post.findMany({
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
    }
    catch (err) {
        res.status(404).json(err);
    }
    finally {
        index_1.prisma.$disconnect();
    }
}));
module.exports = router;
//# sourceMappingURL=saved.js.map