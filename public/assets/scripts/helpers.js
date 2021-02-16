function convertObjectToQuery(object) {
    const keys = Object.keys(object);

    let query = `?${keys[0]}=${object[keys[0]]}`;

    delete(keys[0]);

    keys.forEach(key => {
        query += `&${key}=${object[key]}`;
    });

    return query;
}

function detectError(data) {
    if (data.startsWith('ERROR')) {
        return data.split('ERROR: ')[1];
    } else {
        return null;
    }
}

function setStorage(key, value) {
    window.localStorage.setItem(key, value);
}

function getStorage(key) {
    return window.localStorage.getItem(key);
}

function deleteStorage(key) {
    window.localStorage.removeItem(key);
}

function redirect(path) {
    window.location.href = path;
}

function isMobile() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some(match => {
        return navigator.userAgent.match(match)
    });
}

const API = 'http://localhost:8000/api/v1';

async function generateSessionToken(creds) {
    const { data: token } = await axios.get(
        `${API}/session${convertObjectToQuery(creds)}`
    );
    
    const error = detectError(token);

    if (error) return error;

    setStorage('username', creds.username);
    setStorage('token', token);
}

async function getRequest(path) {
    const object = {
        path: path,
        method: 'GET',
        token: getStorage('token')
    };

    const { data: data } = await axios.get(
        `${API}/request${convertObjectToQuery(object)}`
    );

    const error = detectError(data);

    if (error) {
        return error;
    } else {
        return data;
    }
}

async function postRequest(path) {
    const object = {
        path: path,
        method: 'POST',
        token: getStorage('token')
    };

    const { data: data } = await axios.get(
        `${API}/request${convertObjectToQuery(object)}`
    );

    const error = detectError(data);

    if (error) {
        return error;
    } else {
        return data;
    }
}