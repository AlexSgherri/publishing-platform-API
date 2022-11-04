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
//GET ALL TOPICS
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(InitialTopics);
    }
    catch (err) {
        console.error("error executing query:", err);
    }
    finally {
        index_1.prisma.$disconnect();
    }
}));
//CREATE TOPIC LIST BY USER ID
router.post("/:id", verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topics = yield index_1.prisma.topics.create({
            data: {
                userId: req.body.id,
                topics: req.body.topics,
            },
        });
        res.status(200).json(topics);
    }
    catch (err) {
        res.status(404).json(err);
    }
    finally {
        index_1.prisma.$disconnect();
    }
}));
//DELETE TOPIC FROM USER
router.delete("/", verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield index_1.prisma.user.update({
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
    }
    catch (err) {
        res.status(404).json(err);
    }
    finally {
        index_1.prisma.$disconnect();
    }
}));
//UPDATE TOPICS FROM USER ID
router.put("/:id", verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topicList = yield index_1.prisma.topics.findFirst({
            where: {
                userId: req.params.id,
            },
            select: {
                topics: true,
            },
        });
        req.body.topics.map((ele) => topicList.topics.push(ele));
        const updatedList = yield index_1.prisma.topics.update({
            where: {
                userId: req.params.id,
            },
            data: {
                topics: topicList.topics,
            },
        });
        res.status(200).json(updatedList);
    }
    catch (err) {
        res.status(404).json(err);
    }
    finally {
        index_1.prisma.$disconnect();
    }
}));
module.exports = router;
//# sourceMappingURL=topics.js.map