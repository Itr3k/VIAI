
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import { AIAnalysis } from "../../types";

// Note: analyzeCallTranscript would be imported from a shared internal module in a real monorepo.
// For this single-file output, we assume it's available or mocked.

/**
 * syncRecentCalls
 * Triggers a synchronization of conversation data from ElevenLabs.
 * Can be triggered manually (callable) or scheduled (cron).
 */
export const syncRecentCalls = functions.https.onCall(async (data, context) => {
  // 1. Security & Validation
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Auth required.");
  
  const agencyId = context.auth.token.agencyId;
  const isBackfill = data.isBackfill || false;

  const db = admin.firestore();
  
  // 2. Get API Key for the Agency
  // In prod, this should be fetched securely from Secret Manager or Nango
  const integrationDoc = await db.collection("agencies").doc(agencyId).collection("integrations").doc("elevenlabs").get();
  
  if (!integrationDoc.exists || !integrationDoc.data()?.apiKey) {
    throw new functions.https.HttpsError("failed-precondition", "ElevenLabs Integration not configured.");
  }
  
  const apiKey = integrationDoc.data()?.apiKey;

  try {
    // 3. Call ElevenLabs API
    // Page size 100 is standard max.
    // If backfill, we might loop through pages (simplified here to 1 page).
    const response = await axios.get("https://api.elevenlabs.io/v1/convai/conversations", {
      headers: { 'xi-api-key': apiKey },
      params: {
        page_size: isBackfill ? 100 : 20
      }
    });

    const conversations = response.data.conversations;
    let newCount = 0;
    const batch = db.batch();

    // 4. Upsert Loop
    for (const conv of conversations) {
      const callRef = db.collection("agencies").doc(agencyId).collection("calls").doc(conv.conversation_id);
      const doc = await callRef.get();

      if (!doc.exists) {
        newCount++;
        // Transform API data to our Schema
        const callData = {
          elevenLabsCallId: conv.conversation_id,
          agentName: conv.agent_name || "Unknown Agent",
          clientName: "Unknown Client", // ElevenLabs doesn't give us this, usually derived from CRM
          status: "pending", // Mark as pending so the Analysis Trigger picks it up
          timestamp: new Date(conv.start_time_unix * 1000).toISOString(),
          duration: conv.duration_seconds ? `${Math.floor(conv.duration_seconds / 60)}:${conv.duration_seconds % 60}` : "0:00",
          transcript: conv.transcript || "",
          audioUrl: conv.audio_url || null
        };
        batch.set(callRef, callData);
      }
    }

    await batch.commit();

    // 5. Trigger Analysis (if handled synchronously here, or let Firestore triggers handle it)
    // For this example, we return stats.
    return { 
      success: true, 
      processed: conversations.length, 
      newCalls: newCount 
    };

  } catch (error) {
    console.error("Sync Failed", error);
    throw new functions.https.HttpsError("internal", "Sync failed due to upstream API error.");
  }
});

/**
 * Scheduled Trigger (e.g., Every Hour)
 * This would be deployed separately.
 */
export const scheduledSync = functions.pubsub.schedule('every 60 minutes').onRun(async (context) => {
    // Logic to iterate over ALL active agencies and run sync
    // Simplified for this output
    console.log("Running scheduled sync...");
    return null;
});
