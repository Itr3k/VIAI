import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

/**
 * Creates a new user with specific agency claims.
 * Only accessible by authenticated Admins.
 */
export const createUser = functions.https.onCall(async (data, context) => {
  // 1. Security Check: Ensure caller is authenticated and is an Admin
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const callerUid = context.auth.uid;
  const callerUserRecord = await admin.auth().getUser(callerUid);
  const callerClaims = callerUserRecord.customClaims || {};

  // Check if caller is 'admin' or 'super_admin'
  if (callerClaims.role !== 'admin' && callerClaims.role !== 'super_admin') {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can create new users."
    );
  }

  // 2. Validate Input
  const { email, password, role, agencyId, name } = data;
  
  if (!email || !password || !role || !agencyId) {
    throw new functions.https.HttpsError("invalid-argument", "Missing fields.");
  }

  // Enforce Agency Isolation: Admin can only create users for THEIR agency
  if (callerClaims.role !== 'super_admin' && callerClaims.agencyId !== agencyId) {
    throw new functions.https.HttpsError("permission-denied", "You can only create users for your own agency.");
  }

  try {
    // 3. Create User in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // 4. Set Custom Claims (The "Magic" of Multi-tenancy)
    // These claims are embedded in the Auth Token and used in Firestore Rules
    const customClaims = {
      agencyId: agencyId,
      role: role // 'admin' | 'user'
    };

    await admin.auth().setCustomUserClaims(userRecord.uid, customClaims);

    return { message: `User ${email} created successfully with role ${role}.` };

  } catch (error) {
    throw new functions.https.HttpsError("internal", "Error creating user", error);
  }
});

/**
 * Trigger: Detects if the Super Admin signs up and grants permission automatically.
 */
export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;

  if (user.email === SUPER_ADMIN_EMAIL) {
    await admin.auth().setCustomUserClaims(user.uid, {
      role: 'super_admin',
      agencyId: 'master' // Special agency ID for system owners
    });
    console.log(`Granted Super Admin privileges to ${user.email}`);
  }
});