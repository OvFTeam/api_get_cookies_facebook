const express = require('express');
const cors = require('cors');
const { check, enterCode, getConfigInfo } = require('./modules');

const app = express();
const port = 3000;
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.set('views', __dirname + '/views');

app.use(cors());

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/check', async (req, res) => {
    const { username, password, ip, port, proxyUsername, proxyPassword } = req.query;
    const proxyInfo = getConfigInfo(ip, port, proxyUsername, proxyPassword);

    try {
        const result = await check(username, password, proxyInfo);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/2fa', async (req, res) => {
    const { username, password, code, ip, port, proxyUsername, proxyPassword } = req.query;
    const proxyInfo = getConfigInfo(ip, port, proxyUsername, proxyPassword);

    try {
        const result = await enterCode(username, password, code, proxyInfo);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port:${port}`);
});
