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
exports.createNotification = exports.markAsRead = exports.getUserNotifications = void 0;
const prisma_1 = require("../config/prisma");
const getUserNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const notifications = yield prisma_1.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ notifications });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.getUserNotifications = getUserNotifications;
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const notification = yield prisma_1.prisma.notification.update({
            where: { id },
            data: { isRead: true }
        });
        res.status(200).json({ notification });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.markAsRead = markAsRead;
const createNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, title, message } = req.body;
        const notification = yield prisma_1.prisma.notification.create({
            data: { userId, title, message }
        });
        res.status(201).json({ notification });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.createNotification = createNotification;
