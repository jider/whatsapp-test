import express from 'express';
import apiRouter from './routes/index.mjs';

const PORT = 3000;

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

// Explicit 404 handler, DO NOT PLACE ANY ROUTES BELOW IT, THEY WILL NOT WORK.
app.use('*', (req, res) => {
    res.status(404).send('Not found.');
});

// Error handling
app.use((err, req, res, next) => {
    console.log('###', err?.stack || err?.message);
    res.status(500).send(err?.message);
})

app.listen(PORT, () => {
    console.log(`Sever started at port ${PORT}!`);
});