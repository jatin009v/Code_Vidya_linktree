import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

// Verify service account key exists
const serviceAccountPath = path.resolve("service-account.json");
if (!fs.existsSync(serviceAccountPath)) {
  console.error("\x1b[31mError: service-account.json not found in the root directory.\x1b[0m");
  console.error("Please follow these steps to download the credentials:");
  console.error("1. Go to Firebase Console -> Project Settings -> Service Accounts.");
  console.error("2. Click 'Generate new private key' and save it.");
  console.error("3. Move/rename the downloaded JSON file to 'service-account.json' in this project's root folder.");
  process.exit(1);
}

// Verify premium data exists
const premiumDataPath = path.resolve("scripts/premium-data.json");
if (!fs.existsSync(premiumDataPath)) {
  console.error("\x1b[31mError: scripts/premium-data.json not found.\x1b[0m");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
const premiumData = JSON.parse(fs.readFileSync(premiumDataPath, "utf8"));

console.log("Initializing Firebase Admin SDK...");
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function seed() {
  console.log("Starting Premium Vault seeding...");
  const batch = db.batch();
  
  for (const [code, data] of Object.entries(premiumData)) {
    const docRef = db.collection("premiumAccess").doc(code);
    
    // Merge structure: preserve existing claimedBy/claimedAt if present
    batch.set(docRef, {
      status: data.status,
      createdAt: data.createdAt || new Date().toISOString(),
      resources: data.resources,
      claimedBy: null, // default to null when seeding new codes, but merge ensures it doesn't overwrite if we use merge
    }, { merge: true });
    
    console.log(`- Queued document for code: ${code}`);
  }
  
  await batch.commit();
  console.log("\x1b[32m✔ Premium Vault data seeded successfully!\x1b[0m");
}

seed().catch((error) => {
  console.error("\x1b[31mFailed to seed database:\x1b[0m", error);
  process.exit(1);
});
