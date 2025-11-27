
export interface WordFrequency {
  text: string;
  value: number;
}

export interface AIAnalysis {
  sentimentScore: number; // 0-100
  summary: string;
  missedEmailOpportunity?: boolean;
  emailBody?: string;
}
export interface ToolExecution {
  tool: string;
  status: 'success' | 'failed';
  payload: any;
  timestamp: string;
  result?: string;
}

export interface AnalysisResult {
  summary: string;
  sentimentScore: number;
  actionItems: string[];
}

export interface CallLog {
  id: string;
  clientName: string;
  agentName: string;
  timestamp: string;
  duration: string;
  status: 'processed' | 'flagged' | 'review_needed';
  direction: 'inbound' | 'outbound';
  outcome: 'answered' | 'voicemail' | 'hangup';
  recordingUrl: string;
  transcript: string;
  analysis?: AnalysisResult;
  crmActions?: string[];
}

export interface CallData {
  calls: CallLog[];
}

export interface AgencySettings {
  name: string;
  nangoConnected: boolean;
  korraEnabled?: boolean;
}

// For chart data
export interface SentimentTrend {
  date: string;
  score: number;
}

// Admin & User Management
export type UserRole = 'super_admin' | 'agency_admin' | 'client' | 'user';
export type UserStatus = 'active' | 'invited' | 'suspended';

// --- RAG & Knowledge Base Types ---

export interface RAGConfig {
  enabled: boolean;
  status: 'indexing' | 'ready' | 'error';
  lastSynced?: string;
  sources: KnowledgeSource[];
}

export interface KnowledgeSource {
  id: string;
  type: 'document' | 'integration' | 'url';
  name: string;
  status: 'synced' | 'syncing' | 'error';
  details?: string; // e.g., filename, URL, or integration name
  size?: string;
  updatedAt: string;
}

// --- Voice & Phone Types ---

export interface PhoneNumber {
  id: string;
  number: string;
  status: 'active' | 'provisioning' | 'released';
  assignedTo?: {
    type: 'agent' | 'user' | 'campaign';
    id: string;
    name: string;
  };
  capabilities: ('voice' | 'sms')[];
}

export interface KorraConfig {
  scope: 'global' | 'agency' | 'client';
  accessLevel: 'read_only' | 'read_write' | 'admin';
  modelPreference: 'google_gemini' | 'gpt4' | 'claude';
  voiceId?: string;
  phoneNumberId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin?: string;
  agencyId: string;
  avatarUrl?: string;
  clientSettings?: {
    korraEnabled: boolean;
  };
  // Enhanced Management Fields
  firstName?: string;
  lastName?: string;
  features?: {
    korra: boolean;
    reporting: boolean;
    apiAccess: boolean;
  };
  usageStats?: {
    lastActiveDate: string;
    averageCallsPerDay: number;
    totalMinutesUsed: number;
  };
}

// Agency Management (Super Admin)
export type PlanType = 'free' | 'pro' | 'enterprise';

export interface Agency {
  id: string;
  name: string;
  slug: string; // subdomain
  adminEmail: string;
  plan: PlanType;
  status: 'active' | 'inactive';
  createdAt: string;
  logoUrl?: string;
  customDomain?: string;
  primaryColor?: string;
}

// Integrations
export interface ElevenLabsConfig {
  apiKey?: string; // masked in frontend
  agentId?: string;
  isSynced: boolean;
  lastSync?: string;
}

export interface Agent {
  id: string;
  name: string;
  type: 'voice' | 'chat';
  status: 'active' | 'inactive';
  lastActive?: string;
}

// --- PHASE 2 TYPES ---

export interface ClientGroup {
  id: string;
  name: string;
  agencyId: string;
  agentIds: string[];
  totalCalls: number;
  totalMinutes: number;
}

export interface SyncStatus {
  state: 'idle' | 'syncing' | 'error' | 'success';
  lastRun: string | null;
  itemsProcessed: number;
  type: 'regular' | 'backfill';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  chartData?: any; // Optional data payload for charts
  chartType?: 'bar' | 'line' | 'pie';
}

export interface AgentPerformanceMetric {
  agentName: string;
  calls: number;
  sentiment?: number;
  avgDuration?: number;
}

export interface CallVolumeMetric {
  date: string;
  volume: number;
}

// --- PHASE 3 TYPES (Client Portal) ---

export interface ClientKPIs {
  totalCalls7d: number;
  sentimentScore: number;
  missedOpportunities: number;
}

export type ViewState =
  | 'dashboard'
  | 'calls'
  | 'call-detail'
  | 'agencies'
  | 'users'
  | 'integrations'
  | 'sync'
  | 'reporting'
  | 'portal_dashboard'
  | 'portal_calls'
  | 'portal_analytics'
  | 'portal_settings'
  | 'portal_reports'
  | 'admin_calls'
  | 'admin_reporting'
  | 'admin_integrations'
  | 'admin_sync'
  | 'admin_agents'
  | 'admin_users'
  | 'helpdesk'
  | 'notifications'
  | 'agency_clients'
  | 'agency_users';

// --- PHASE 4 TYPES (Helpdesk & Notifications) ---

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  timestamp: string;
  attachments?: string[];
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requesterId: string;
  requesterName: string;
  requesterRole: UserRole;
  agencyId: string; // Context for the ticket
  assigneeRole: 'super_admin' | 'agency_admin'; // Who is this ticket FOR?
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  targetAudience: 'global' | 'agency' | 'user';
  targetAgencyId?: string; // If audience is agency
  targetUserId?: string; // If audience is user
  createdAt: string;
  read: boolean;
}