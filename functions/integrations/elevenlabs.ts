
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

// Tool Definition for VIAI Email Capability
const VIAI_EMAIL_TOOL_DEF = {
  name: "viai_email_tool",
  description: "Triggers a draft email in Outlook when the user asks to send a follow-up or summary.",
  parameters: {
    type: "object",
    properties: {
      recipient_name: {
        type: "string",
        description: "Name of the person to email"
      },
      topic: {
        type: "string",
        description: "The main subject of the email"
      }
    },
    required: ["recipient_name", "topic"]
  }
};

/**
 * Configures an ElevenLabs Agent with the VIAI tool.
 * Input: { agencyId, agentId, apiKey }
 */
export const configureAgentTools = functions.https.onCall(async (data, context) => {
  // 1. Security Check
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Auth required.");
  
  const { agencyId, agentId, apiKey } = data;
  const callerAgencyId = context.auth.token.agencyId;

  // Ensure user belongs to the agency they are modifying
  if (callerAgencyId !== agencyId && context.auth.token.role !== 'super_admin') {
     throw new functions.https.HttpsError("permission-denied", "Unauthorized.");
  }

  try {
    // 2. Fetch Current Agent Configuration
    const getResponse = await axios.get(`https://api.elevenlabs.io/v1/convai/agents/${agentId}`, {
      headers: { 'xi-api-key': apiKey }
    });

    const agentConfig = getResponse.data;
    
    // 3. Check if tool exists
    const tools = agentConfig.conversation_config?.agent?.tools || [];
    const hasTool = tools.some((t: any) => t.name === "viai_email_tool");

    if (hasTool) {
      return { message: "Agent already has VIAI tools configured." };
    }

    // 4. Inject Tool
    const updatedTools = [...tools, VIAI_EMAIL_TOOL_DEF];

    // 5. PATCH Update to ElevenLabs
    await axios.patch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}`, {
      conversation_config: {
        agent: {
          tools: updatedTools
        }
      }
    }, {
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' }
    });

    // 6. Log success in Firestore
    await admin.firestore()
      .collection('agencies')
      .doc(agencyId)
      .collection('integrations')
      .doc('elevenlabs')
      .set({
        agentId,
        lastSynced: admin.firestore.FieldValue.serverTimestamp(),
        toolInjected: true
      }, { merge: true });

    return { success: true, message: "VIAI Email Tool injected successfully." };

  } catch (error: any) {
    console.error("ElevenLabs Sync Error", error.response?.data || error);
    throw new functions.https.HttpsError("internal", "Failed to sync with ElevenLabs API.");
  }
});
