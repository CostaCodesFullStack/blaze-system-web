const mongoose = require("mongoose");

// Conectar direto sem usar SRV
const MONGODB_URL =
  "mongodb://blazesystem:Ca200306@ac-icod9np-shard-00-00.4fsuixs.mongodb.net:27017,ac-icod9np-shard-00-01.4fsuixs.mongodb.net:27017,ac-icod9np-shard-00-02.4fsuixs.mongodb.net:27017/?ssl=true&authSource=admin&replicaSet=atlas-13ebh9-shard-0&retryWrites=true";

console.log("🔍 Testando conexão direta aos shards (sem SRV)...\n");

mongoose
  .connect(MONGODB_URL, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
  })
  .then(() => {
    console.log("✅ Conexão bem-sucedida!");
    console.log("⚠️  Use a string de conexão acima como fallback");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Erro:", err.message);
    console.error("Code:", err.code);
    process.exit(1);
  });
