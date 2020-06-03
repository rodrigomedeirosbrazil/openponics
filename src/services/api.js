const axios = require('axios').default;

const api = axios.create(
    {
        baseURL: process.env.API_URL
    }
);

module.exports = api;
