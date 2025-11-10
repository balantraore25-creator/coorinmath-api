// redisClient.js
const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.connect()
  .then(() => console.log("✅ Redis connecté"))
  .catch(err => console.error("❌ Erreur de connexion Redis:", err));

module.exports = redisClient;
