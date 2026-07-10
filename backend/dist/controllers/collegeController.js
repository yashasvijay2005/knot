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
exports.getColleges = exports.createCollege = void 0;
const prisma_1 = require("../config/prisma");
const createCollege = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, domain } = req.body;
        const existingCollege = yield prisma_1.prisma.college.findFirst({
            where: { OR: [{ name }, { domain }] }
        });
        if (existingCollege) {
            res.status(400).json({ error: 'College or domain already exists' });
            return;
        }
        const college = yield prisma_1.prisma.college.create({
            data: { name, domain, isVerified: false },
        });
        res.status(201).json({ college });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.createCollege = createCollege;
const getColleges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const colleges = yield prisma_1.prisma.college.findMany();
        res.status(200).json({ colleges });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.getColleges = getColleges;
