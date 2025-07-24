// import mongoose from "mongoose";
// import Wallet from "../models/wallet.js";
// import dotenv from "dotenv";
// dotenv.config();
// if (!process.env.MONGODB_URI) {
//   console.error("❌ MONGODB_URI is not defined in the environment variables.");
//   process.exit(1);
// }

// async function insertWallets() {
//   await mongoose.connect(process.env.MONGODB_URI);

//   const wallets = [
//     { name: "Bank B" },
//     { name: "Wallet App" },
//     { name: "Bank C" },
//     { name: "PayPal" },
//     { name: "Cash Reserve" },
//     { name: "Prepaid Card" },
//     { name: "Business Account" },
//     { name: "Foreign Currency" },
//     { name: "Travel Card" }
//   ];

//   try {
//     const inserted = await Wallet.insertMany(wallets);
//     console.log("Wallets inserted:", inserted);
//   } catch (err) {
//     console.error("Insert failed:", err);
//   } finally {
//     await mongoose.disconnect();
//   }
// }

// insertWallets();
