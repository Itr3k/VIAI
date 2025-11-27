

export interface WordFrequency {
  text: string;
  value: number;
}

export interface AIAnalysis {
  sentimentScore: number; // 0-100
  summary: string;
  missedEmailOpportunity: boolean;
  emailBody?: string;
  keywords: WordFrequency[];
}

export interface ToolExecution {
  tool: string;
  status: 'success' | 'failed';
  payload: any;
  timestamp: string;
  result?: string;
}

export interface CallData {
  id: string;
  clientName: string;
  agentName: string;
  timestamp: string;
  duration: string; // e.g., "4:32"
  transcript: string;
  status: 'processed' | 'analyzing' | 'pending';
  analysis?: AIAnalysis;
  audioUrl?: string; // Mocked
  elevenLabsCallId?: string;
  toolExecutions?: ToolExecution[];
}

export interface AgencySettings {
  name: string;
  nangoConnected: boolean;
}

// For chart data
export interface SentimentTrend {
  date: string;
  score: number;
}

// Admin & User Management
export type UserRole = 'super_admin' | 'admin' | 'user' | 'client';
export type UserStatus = 'active' | 'invited' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin?: string;
  agencyId: string;
  avatarUrl?: string;
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
}

// Integrations
export interface ElevenLabsConfig {
  apiKey?: string; // masked in frontend
  agentId?: string;
  isSynced: boolean;
  lastSync?: string;
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
  | 'users' 
  | 'agencies' 
  | 'integrations' 
  | 'sync' 
  | 'reporting'
  | 'portal_dashboard'
  | 'portal_calls'
  | 'portal_analytics'
  | 'portal_settings';