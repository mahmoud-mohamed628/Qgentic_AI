export interface AgentLog {
  id: string;
  timestamp: string;
  agent: 'researcher' | 'analyst' | 'editor' | 'system';
  type: 'thought' | 'action' | 'observation' | 'output' | 'info';
  message: string;
  metadata?: Record<string, any>;
}

export interface AgentInfo {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  bgLight: string;
  borderColor: string;
  goal: string;
  backstory: string;
  tools: string[];
}

export interface ResearchPreset {
  id: string;
  title: string;
  category: string;
  icon: string;
  topic: string;
  description: string;
}

export interface FileItem {
  name: string;
  path: string;
  language: string;
  description: string;
  content: string;
}
