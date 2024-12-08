"use strict";
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
module.exports = {
    mongoURI: `mongodb+srv://${dbUser}:${dbPassword}@your-cluster-url/${dbName}?retryWrites=true&w=majority`,
    secretOrKey: process.env.SECRET_OR_KEY // Secret key for JWT
};
