const winston = require('winston');

const logger = winston.createLogger({
    level: "info",
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({all: true}),
                winston.format.simple(),
            )
        }),
        new (winston.transports.File)({
            filename: 'log.log',
            timestamp: true
        }),
        new (winston.transports.File)({
            name: 'error-log',
            filename: 'error.log',
            level: 'error'
        }),

        new (winston.transports.File)({
            name: 'info-log',
            filename: 'info.log',
            level: 'info'
        }),
    ],

});

winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    debug: 'green',
})


module.exports = logger;
