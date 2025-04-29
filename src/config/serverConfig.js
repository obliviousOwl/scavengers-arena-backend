const SERVER_PORT = process.env.PORT || 5001;
console.log(`server config logs ${process.env.PORT}`);
module.exports = {
    SERVER_PORT,
    CORS_OPTIONS: {
        origin: "*",
        methods: ["GET", "POST"]
    }
};
