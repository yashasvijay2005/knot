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
exports.deleteUser = exports.updateUserRole = exports.getUsers = void 0;
const prisma_1 = require("../config/prisma");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { collegeId } = req.params;
        const users = yield prisma_1.prisma.user.findMany({
            where: { collegeId },
            select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true }
        });
        res.status(200).json({ users });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.getUsers = getUsers;
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = yield prisma_1.prisma.user.update({
            where: { id },
            data: { role },
            select: { id: true, email: true, firstName: true, lastName: true, role: true }
        });
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.updateUserRole = updateUserRole;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma_1.prisma.user.delete({
            where: { id }
        });
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.deleteUser = deleteUser;
