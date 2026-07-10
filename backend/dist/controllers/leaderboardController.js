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
exports.getLeaderboard = exports.submitScore = void 0;
const prisma_1 = require("../config/prisma");
const submitScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId, judgeId, participantId, score, feedback } = req.body;
        const newScore = yield prisma_1.prisma.score.upsert({
            where: {
                eventId_judgeId_participantId: { eventId, judgeId, participantId }
            },
            update: { score: Number(score), feedback },
            create: { eventId, judgeId, participantId, score: Number(score), feedback }
        });
        res.status(200).json({ score: newScore });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.submitScore = submitScore;
const getLeaderboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId } = req.params;
        const scores = yield prisma_1.prisma.score.findMany({
            where: { eventId }
        });
        // Aggregate scores by participant
        const aggregated = {};
        scores.forEach(s => {
            const pId = s.participantId;
            if (!pId)
                return;
            if (!aggregated[pId]) {
                aggregated[pId] = { totalScore: 0, judgeCount: 0 };
            }
            aggregated[pId].totalScore += s.score;
            aggregated[pId].judgeCount += 1;
        });
        const leaderboard = Object.keys(aggregated).map(pId => ({
            participantId: pId,
            averageScore: aggregated[pId].totalScore / aggregated[pId].judgeCount
        })).sort((a, b) => b.averageScore - a.averageScore);
        res.status(200).json({ leaderboard });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.getLeaderboard = getLeaderboard;
