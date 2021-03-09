const express = require('express');
const cors = require('cors');
const https = require('https');
const { default: axios } = require('axios');

const web = express();

const host = '10.4.0.1';
const apiPath = '/api/v1';
const webPath = __dirname + '/public';

web.use('/', express.static(webPath));
web.use(cors());

web.get(apiPath + '/session', (req, res) => {
    const user = req.query.username;
    const pass = req.query.password;

    if (!user || !pass) {
        return res.status(200).send('ERROR: Invalid credentials');
    }

    const path = `https://${host}/rest/com/vmware/cis/session`;

    const options = {
        host: host,
        port: '443',
        path: path,
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,
        auth: `${user}:${pass}`
    };

    try {
        https.request(options, response => {
            const token = response.headers['set-cookie'];

            if (!token) {
                return res.status(200).send('ERROR: Invalid credentials');
            }

            res.status(200).send(
                token[0].split('=')[1].split(';')[0]
            );
        }).end();
    } catch (error) {
        res.status(200).send('ERROR: ' + error);
    }
});

web.get(apiPath + '/request', async (req, res) => {
    const token = req.query.token;
    const path = req.query.path;
    const method = req.query.method;

    if (!token) {
        return res.status(200).send('ERROR: Invalid authentication token');
    }

    if (!method) {
        return res.status(200).send('ERROR: No API method was specified');
    }

    if (!path) {
        return res.status(200).send('ERROR: No API path specified');
    }

    if (!['GET', 'POST', 'DELETE'].includes(method)) {
        return res.status(200).send('ERROR: Specified method is invalid');
    }

    const agent = new https.Agent({
        rejectUnauthorized: false
    });

    const options = {
        headers: {
            'vmware-api-session-id': token
        },
        method: method,
        httpsAgent: agent,
    };

    try {
        const response = await axios(`https://${host}${path}`, options);

        console.log(response.data);

        res.status(200).send(response.data);
    } catch (error) {
        res.status(200).send('ERROR: ' + error);
    }
});

web.get('/', (req, res) => {
    res.status(200).sendFile(webPath + '/assets/pages/home.html'); 
});

web.get('/inventory/hosts', (req, res) => {
    res.status(200).sendFile(webPath + '/assets/pages/hosts.html'); 
});

web.get('/inventory/clusters', (req, res) => {
    res.status(200).sendFile(webPath + '/assets/pages/clusters.html'); 
});

web.get('/inventory/virtual-machines', (req, res) => {
    res.status(200).sendFile(webPath + '/assets/pages/virtual-machines.html'); 
});

web.get('/login', (req, res) => {
    res.status(200).sendFile(webPath + '/assets/pages/login.html'); 
});

web.listen(8000, () => {
    console.clear();
	console.log('\x1b[33m%s\x1b[0m', 'LISTENING ON PORT 8000');
});