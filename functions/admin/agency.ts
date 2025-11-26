
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Ensure admin is initialized in the main index or here if separate
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Creates a new Agency and its first Admin User.
 * Input: { name, slug, adminEmail, plan }
 */
export const createAgency = functions.https.onCall(async (data, context) => {
  // 1. Security: Only Super Admins can create agencies
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Must be logged in.");
  }
  
  const callerUid = context.auth.uid;
  const callerUser = await admin.auth().getUser(callerUid);
  
  if (callerUser.customClaims?.role !== 'super_admin') {
    throw new functions.https.HttpsError("permission-denied", "Only Super Admins can create agencies.");
  }

  const { name, slug, adminEmail, plan } = data;

  if (!name || !slug || !adminEmail) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required fields.");
  }

  // 2. Uniqueness Check: Ensure slug doesn't exist
  const existingAgency = await admin.firestore().collection("agencies").doc(slug).get();
  if (existingAgency.exists) {
    throw new functions.https.HttpsError("already-exists", `Agency with slug ${slug} already exists.`);
  }

  const db = admin.firestore();
  const batch = db.batch();

  // 3. Create Agency Document
  const agencyRef = db.collection("agencies").doc(slug);
  batch.set(agencyRef, {
    name,
    slug,
    plan: plan || 'free',
    status: 'active',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    ownerEmail: adminEmail,
    settings: {
        nangoConnected: false
    }
  });

  // 4. Create/Get User and Assign Role
  let userRecord;
  try {
    userRecord = await admin.auth().getUserByEmail(adminEmail);
  } catch (e) {
    // User doesn't exist, create them
    userRecord = await admin.auth().createUser({
      email: adminEmail,
      emailVerified: false,
      password: 'TemporaryPassword123!' // In prod, trigger a password reset email instead
    });
  }

  // 5. Assign 'admin' role for this specific agency
  await admin.auth().setCustomUserClaims(userRecord.uid, {
    agencyId: slug,
    role: 'admin'
  });

  // 6. Create User Profile in Firestore under the agency
  const userProfileRef = agencyRef.collection("users").doc(userRecord.uid);
  batch.set(userProfileRef, {
    email: adminEmail,
    role: 'admin',
    status: 'active',
    name: adminEmail.split('@')[0] // default name
  });

  await batch.commit();

  return { message: `Agency ${name} created successfully.` };
});
