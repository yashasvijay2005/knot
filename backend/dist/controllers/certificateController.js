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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCertificates = exports.verifyCertificate = exports.issueCertificate = void 0;
const prisma_1 = require("../config/prisma");
const crypto_1 = __importDefault(require("crypto"));
const issueCertificate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, eventId, type } = req.body;
        if (!['PARTICIPATION', 'WINNER', 'VOLUNTEER', 'JUDGE'].includes(type)) {
            res.status(400).json({ error: 'Invalid certificate type' });
            return;
        }
        const uniqueString = `${userId}-${eventId}-${type}-${Date.now()}`;
        const hash = crypto_1.default.createHash('sha256').update(uniqueString).digest('hex');
        const certificate = yield prisma_1.prisma.certificate.create({
            data: {
                userId,
                eventId,
                type,
                hash
            }
        });
        res.status(201).json({ certificate });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error', details: String(error) });
    }
});
exports.issueCertificate = issueCertificate;
const verifyCertificate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hash } = req.params;
        const certificate = yield prisma_1.prisma.certificate.findUnique({
            where: { hash },
            include: {
                user: { select: { firstName: true, lastName: true, email: true } },
                event: { select: { title: true } }
            }
        });
        if (!certificate) {
            res.status(404).json({ error: 'Certificate not found or invalid' });
            return;
        }
        res.status(200).json({ certificate, valid: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error', details: String(error) });
    }
});
exports.verifyCertificate = verifyCertificate;
const getUserCertificates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const certificates = yield prisma_1.prisma.certificate.findMany({
            where: { userId },
            include: { event: { select: { title: true, startDate: true } } },
            orderBy: { issueDate: 'desc' }
        });
        res.status(200).json({ certificates });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error', details: String(error) });
    }
});
exports.getUserCertificates = getUserCertificates;
