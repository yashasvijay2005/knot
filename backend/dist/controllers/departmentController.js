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
exports.deleteDepartment = exports.getDepartments = exports.createDepartment = void 0;
const prisma_1 = require("../config/prisma");
const createDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, collegeId } = req.body;
        if (!name || !collegeId) {
            res.status(400).json({ error: 'Name and collegeId are required' });
            return;
        }
        const existingDept = yield prisma_1.prisma.department.findUnique({
            where: { name_collegeId: { name, collegeId } }
        });
        if (existingDept) {
            res.status(400).json({ error: 'Department already exists for this college' });
            return;
        }
        const department = yield prisma_1.prisma.department.create({
            data: { name, collegeId },
        });
        res.status(201).json({ department });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.createDepartment = createDepartment;
const getDepartments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { collegeId } = req.params;
        const departments = yield prisma_1.prisma.department.findMany({
            where: { collegeId }
        });
        res.status(200).json({ departments });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.getDepartments = getDepartments;
const deleteDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma_1.prisma.department.delete({
            where: { id }
        });
        res.status(200).json({ message: 'Department deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.deleteDepartment = deleteDepartment;
