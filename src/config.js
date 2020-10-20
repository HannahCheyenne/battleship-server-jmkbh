module.exports = {
    HTTP_PORT: process.env.HTTP_PORT || 8000,
    WS_PORT: process.env.WS_PORT || 4000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL
        || 'postgresql://dunder-mifflin@localhost/battleship',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
};