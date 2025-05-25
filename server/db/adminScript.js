import db from "./connection.js";
import bcrypt from "bcrypt";

async function seedAdmins() {
  try {
    const col = db.collection("adminAuth");
    const count = await col.countDocuments();

    if (count > 0) {
      console.log("Admin already exists. Skipping insert.");
      return;
    }

    // Insert admin documents
    const adminDocuments = [
      {
        username: "Alan",
        password: await bcrypt.hash("1234", 10),
      },
      {
        username: "Grace",
        password: await bcrypt.hash("123", 10),
      },
    ];

    const result = await col.insertMany(adminDocuments);
    console.log(`${result.insertedCount} admin(s) inserted.`);
  } catch (err) {
    console.error("Error seeding admin accounts:", err);
  }
}

await seedAdmins();
process.exit();
