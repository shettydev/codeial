const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

const development = {
    name: 'Development',
    asset_path: './assets',
    session_cookie_key: 'blahsomething',
    db: 'codeial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        logger: true,
        secureConnection: false,
        auth: {
            user: '19bd1a1043@gmail.com',
            pass: 'ckbpstxmsmxwvgtr'
        },
        tls: {
            rejectUnauthorized: true
        }
    },
    google_client_id: "815530450604-q3jjl386r2jtvlaugn2b4k116jvgs6g4.apps.googleusercontent.com",
    google_clientSecret: "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",
    google_callbackURL: "http://localhost:8000/users/auth/google/callback",
    jwt_secretKey: "codeial",
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}


const production = {
    name: 'Production',
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE,
    db: process.env.CODEIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        logger: true,
        secureConnection: false,
        auth: {
            user: process.env.CODEIAL_GOOGLE_USERNAME,
            pass: process.env.CODEIAL_GOOGLE_PASSWORD
        },
        tls: {
            rejectUnauthorized: true
        }
    },
    google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_clientSecret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_callbackURL: process.env.CODEIAL_GOOGLE_CALLBACK,
    jwt_secretKey: process.env.CODEIAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}

module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);
