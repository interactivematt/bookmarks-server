module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_TOKEN: process.env.API_TOKEN || '74989572-4fd1-11eb-ae93-0242ac130002',
  DB_URL: process.env.DB_URL || 'postgresql://dunder_mifflin@localhost/bookmarks',
}