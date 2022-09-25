import express from 'express';
import { registerUser } from '../services/users.srv.mjs';

const router = express.Router();

router.post('/register', async (req, res, next) => {
    try {
        if(!req?.body?.clientNumber) {
            res.status(400).send('Missing parameters');
        }
        await registerUser(req?.body?.clientNumber);
        res.status(201).send();
    } catch (e) {
        next(e);
    }
});

export default router;