
import { CallData, SentimentTrend, AgentPerformanceMetric, CallVolumeMetric } from '../types';

export const MOCK_CALLS: CallData[] = [
  {
    id: 'call-101',
    clientName: 'Dr. Smith Dental',
    agentName: 'Sarah (Sales)',
    timestamp: '2023-10-27T09:30:00Z',
    duration: '5:12',
    status: 'processed',
    transcript: `Agent: "Hi, this is Sarah from VIAI. How are you?"
Client: "I'm okay, but I'm really frustrated with the billing issues we've had lately."
Agent: "I completely understand, Dr. Smith. I see the discrepancy here. I can fix that immediately and issue a credit."
Client: "That would be great. Also, do you integrate with Outlook yet?"
Agent: "Yes, we actually just launched that feature! I can send you a guide."
Client: "Please do, that would save my receptionist a lot of time."
Agent: "Consider it done. Anything else?"
Client: "No, thanks for fixing the bill."`,
    analysis: {
      sentimentScore: 75,
      summary: "Client was initially frustrated about billing but satisfied with the immediate resolution. Interested in Outlook integration.",
      missedEmailOpportunity: false, // Set to false because we actually "sent" it via tool
      emailBody: "Subject: VIAI Outlook Integration Guide\n\nHi Dr. Smith,\n\nIt was great speaking with you. As promised, here is the guide to integrating VIAI with Outlook...",
      keywords: [
        { text: "billing", value: 90 },
        { text: "frustrated", value: 60 },
        { text: "integrate", value: 50 },
        { text: "Outlook", value: 80 },
        { text: "credit", value: 40 },
        { text: "guide", value: 30 }
      ]
    },
    toolExecutions: [
      {
        tool: 'viai_email_tool',
        status: 'success',
        timestamp: '2023-10-27T09:34:12Z',
        payload: {
          recipient_name: 'Dr. Smith',
          topic: 'Outlook Integration Guide'
        },
        result: 'Draft created in Outlook Sent Items'
      },
      {
        tool: 'crm_update',
        status: 'success',
        timestamp: '2023-10-27T09:34:15Z',
        payload: {
          field: 'satisfaction',
          value: 'high'
        },
        result: 'Updated Salesforce Record'
      }
    ]
  },
  {
    id: 'call-102',
    clientName: 'Greenwood Legal',
    agentName: 'Mike (Support)',
    timestamp: '2023-10-27T10:15:00Z',
    duration: '2:45',
    status: 'processed',
    transcript: `Agent: "Tech support, Mike speaking."
Client: "Hi Mike, the system is down again."
Agent: "I'm sorry to hear that. Let me check the logs."
Client: "This is the third time this week. It's unacceptable."
Agent: "I see a server timeout. I'm rebooting the instance now. It should be up in 2 minutes."
Client: "It better be. We are losing billable hours."`,
    analysis: {
      sentimentScore: 20,
      summary: "Client is highly dissatisfied due to recurring system outages. Risk of churn.",
      missedEmailOpportunity: false,
      keywords: [
        { text: "down", value: 85 },
        { text: "unacceptable", value: 90 },
        { text: "timeout", value: 40 },
        { text: "billable", value: 50 },
        { text: "week", value: 30 }
      ]
    },
    // No tools used - testing fallback state
    toolExecutions: []
  },
  {
    id: 'call-103',
    clientName: 'TechFlow Inc',
    agentName: 'Sarah (Sales)',
    timestamp: '2023-10-27T11:00:00Z',
    duration: '8:20',
    status: 'pending',
    transcript: `Agent: "Hello, calling about your recent inquiry regarding our Enterprise plan."
Client: "Yes, hello. We are looking to scale our operations."
Agent: "Fantastic. VIAI can handle unlimited concurrent calls."
Client: "What about pricing for 50 agents?"
Agent: "We have a volume discount. I can send over a quote."
Client: "Please send that to my email. Also, does it support SSO?"
Agent: "Yes, we support Okta and Google Auth."
Client: "Perfect. Send the quote and the security compliance doc."`,
    // No analysis yet - testing "Pending" state in UI
  }
];

// Phase 4: Dedicated Mock Call for Safety Mode
export const MOCK_CALL_DETAIL: CallData = {
  id: 'mock-safe-call',
  clientName: 'Safety Mode Inc.',
  agentName: 'Demo Agent',
  timestamp: new Date().toISOString(),
  duration: '15:30',
  status: 'processed',
  transcript: `Agent: "Welcome to Safety Mode. This data is rendered when the live connection is missing."
Client: "That is a great feature. It prevents the white screen of death."
Agent: "Exactly. It uses a robust mock object to populate all UI zones."
Client: "Does it support tool cards?"
Agent: "Yes, check the top row. You should see an Email tool execution."
Client: "Perfect. Proceed with the demo."`,
  analysis: {
    sentimentScore: 95,
    summary: "This is a fallback call record used to stabilize the UI during development or data fetching errors. It ensures all components have valid data to render.",
    missedEmailOpportunity: false,
    keywords: [
      { text: "Safety", value: 100 },
      { text: "Stabilization", value: 80 },
      { text: "Mock Data", value: 90 },
      { text: "UI", value: 60 }
    ]
  },
  toolExecutions: [
    {
      tool: 'viai_email_tool',
      status: 'success',
      timestamp: new Date().toISOString(),
      payload: { topic: 'Safety Protocols' },
      result: 'Email sent successfully'
    }
  ]
};

export const MOCK_TRENDS: SentimentTrend[] = [
  { date: 'Mon', score: 65 },
  { date: 'Tue', score: 58 },
  { date: 'Wed', score: 72 },
  { date: 'Thu', score: 81 },
  { date: 'Fri', score: 68 },
  { date: 'Sat', score: 75 },
  { date: 'Sun', score: 78 },
];

export const MOCK_AGENT_PERFORMANCE: AgentPerformanceMetric[] = [
  { agentName: 'Sarah (Sales)', calls: 145 },
  { agentName: 'Mike (Support)', calls: 132 },
  { agentName: 'Jessica (Booking)', calls: 98 },
  { agentName: 'Tom (Tech)', calls: 87 },
  { agentName: 'Emma (Sales)', calls: 76 },
  { agentName: 'David (Support)', calls: 65 },
  { agentName: 'Bot-01', calls: 12 },
];

export const MOCK_CALL_VOLUME: CallVolumeMetric[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
  volume: Math.floor(Math.random() * 50) + 20
}));
