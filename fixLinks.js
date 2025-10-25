const mongoose = require("mongoose");
const Course = require("./models/Course"); // adapte le chemin si besoin

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  // Met à jour tous les cours qui commencent par http://localhost:5173
  const result = await Course.updateMany(
    { link: { $regex: /^http:\/\/localhost:5173/ } },
    [
      {
        $set: {
          link: {
            $replaceOne: {
              input: "$link",
              find: "http://localhost:5173",
              replacement: ""
            }
          }
        }
      }
    ]
  );

  console.log(`✅ ${result.modifiedCount} liens corrigés`);
  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
