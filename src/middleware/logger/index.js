const pino = require('pino')({
    level: "debug",
    prettyPrint: {
        levelFirst: true,
        colorize: true,
        ignore: "hostname, pid",
        translateTime: false,
        singleLine: false
    }
});

module.exports = pino;