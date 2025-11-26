
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

/**
 * createClientGroup
 * Groups multiple agents under one "Client" entity (e.g. "California Windows" uses Agent A, Agent B)
 */
export const createClientGroup = functions.https.onCall(async (data, context) => {
  if (!context.auth || context.auth.token.role !== 'admin') {
    throw new functions.https.HttpsError("permission-denied", "Only Admins can manage groups.");
  }

  const { name, agentIds } = data;
  const agencyId = context.auth.token.agencyId;

  if (!name || !agentIds || !Array.isArray(agentIds)) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid payload.");
  }

  const newGroupRef = db.collection("agencies").doc(agencyId).collection("groups").doc();
  
  await newGroupRef.set({
    name,
    agentIds,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    totalCalls: 0, // Will be aggregated by triggers
    totalMinutes: 0
  });

  return { id: newGroupRef.id, message: "Group created." };
});
