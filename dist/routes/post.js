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
//FIND A POST BY ID
router.get("/get/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.id);
    try {
        const posts = yield index_1.prisma.post.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                author: true,
            },
        });
        res.status(200).json(posts);
    }
    catch (err) {
        res.status(404).json(err);
    }
    finally {
        index_1.prisma.$disconnect();
    }
}));
//FIND ALL POST FOR USERS TOPICS
router.post("/find", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield index_1.prisma.post.findMany({
            where: {
                topic: { hasSome: req.body.topics },
            },
        });
        res.status(200).json(posts);
    }
    catch (err) {
        res.status(404).json(err);
    }
    finally {
        index_1.prisma.$disconnect();
    }
}));
//FIND ALL POST FOR A USER ID
router.get("/find/author/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield index_1.prisma.post.findMany({
            where: {
                authorId: { in: req.params.id },
            },
            include: {
                author: true,
                Saved: {
                    select: {
                        userId: true,
                    },
                },
            },
        });
        res.status(200).json(posts);
    }
    catch (err) {
        console.log(err);
        res.status(404).json(err);
    }
    finally {
        index_1.prisma.$disconnect();
    }
}));
//CREATE POST
router.post("/create", verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield index_1.prisma.post.create({
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
    }
    catch (err) {
        console.log("problem");
        console.error("error executing query:", err);
    }
    finally {
        index_1.prisma.$disconnect();
    }
}));
//FIND POST BY TOPIC
router.get("/find/:topic", verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield index_1.prisma.post.findMany({
            where: {
                topic: {
                    has: req.params.topic,
                },
            },
            include: {
                author: {
                    select: { avatar: true, username: true },
                },
                Saved: {
                    select: {
                        userId: true,
                    },
                },
            },
            take: 10,
        });
        res.status(200).json(posts);
    }
    catch (err) {
        res.status(404).json(err);
    }
    finally {
        index_1.prisma.$disconnect();
    }
}));
module.exports = router;
//# sourceMappingURL=post.js.map