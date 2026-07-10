import { Router } from 'express';
import { issueCertificate, verifyCertificate, getUserCertificates } from '../controllers/certificateController';

const router = Router();

router.post('/', issueCertificate);
router.get('/verify/:hash', verifyCertificate);
router.get('/user/:userId', getUserCertificates);

export default router;
