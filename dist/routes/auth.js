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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
const index_1 = require("../index");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
//REGISTER
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield index_1.prisma.user.create({
            data: {
                username: req.body.username,
                email: req.body.email.toLowerCase(),
                password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_PSW).toString(),
                age: req.body.age,
                name: req.body.name,
                role: req.body.role,
            },
        });
        res.status(200).json(user);
    }
    catch (err) {
        console.error("error executing query:", err);
    }
    finally {
        index_1.prisma.$disconnect();
    }
}));
//LOGIN
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield index_1.prisma.user.findFirst({
            where: {
                username: { equals: req.body.username, mode: "insensitive" },
            },
        });
        const hashedPsw = CryptoJS.AES.decrypt(user.password, process.env.SECRET_PSW);
        const psw = hashedPsw.toString(CryptoJS.enc.Utf8);
        if (!user || req.body.password !== psw)
            res.status(401).json("Wrong Username or Password!");
        const accessToken = jwt.sign({
            id: user.id,
            role: user.role,
        }, process.env.JWT_KEY, { expiresIn: "3d" });
        const { password } = user, others = __rest(user, ["password"]);
        res.status(200).json(Object.assign(Object.assign({}, others), { accessToken }));
    }
    catch (err) {
        res.status(404).json(err);
    }
    finally {
        index_1.prisma.$disconnect();
    }
}));
module.exports = router;
//# sourceMappingURL=auth.js.map