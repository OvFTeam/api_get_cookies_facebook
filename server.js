const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const server = require('http').Server(app);
const { initialize, check, enterCode, updateAndSync, saveInfo, close, getConfigInfo } = require('./modules');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/check', async (req, res) => {
    const { username, password, ip, port, usernameProxy, passwordProxy } = req.body;
    try {
        await getConfigInfo(ip, port, usernameProxy, passwordProxy);
        await initialize();
        const result = await check(username, password);
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/code', async (req, res) => {
    const { code } = req.body;
    try {
        const result = await enterCode(code);
        res.send(result);
    } catch (error) {
        await close();
        res.status(500).send(error);
    }
});

server.listen(port, () => {
    console.log(`Server listening at port:${port}`);
});
