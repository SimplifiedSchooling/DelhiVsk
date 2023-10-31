const Redis = require('ioredis');
const config = require('../config/config');

const { port, host } = config.redis;
const redis = new Redis({ host, port });

module.exports = redis;
