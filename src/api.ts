export interface Agent {
  id: string;
  title: string;
  avatarUrl?: string;
}

export interface Message {
  id: string;
  isSystem: boolean;
  text: string;
  dateCreated: string;
}

export interface Conversation {
  id: string;
  title: string;
  dateCreated: string;
  dateUpdated: string;
  messages?: Message[];
}

export interface SessionResponse {
  token: string;
  type: string;
  expires_in: number;
}

export class NimbleBrainAPI {
  private baseUrl: string;
  private bearerToken: string | null = null;

  constructor(baseUrl: string = 'https://api.nimblebrain.ai') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}, requireAuth: boolean = true): Promise<T> {
    const url = `${this.baseUrl}/v1${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (requireAuth) {
      if (this.bearerToken) {
        headers['Authorization'] = `Bearer ${this.bearerToken}`;
      } else {
        console.error('CRITICAL: No bearer token available for authenticated request to:', endpoint);
        throw new Error('Authentication token required but not available. Session may have failed to initialize.');
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        
        // Extract the actual error message from the API response structure
        // Structure: {"error":{"code":"FORBIDDEN","message":"Origin not allowed for this agent"}}
        let actualError = errorMessage;
        
        if (errorData.error && errorData.error.message) {
          actualError = errorData.error.message;
        } else if (errorData.message) {
          actualError = errorData.message;
        }
        
        // Handle specific error cases
        if (response.status === 403) {
          // Check if it's an origin-related error
          const fullErrorText = actualError.toLowerCase();
          if (fullErrorText.includes('origin not allowed') || 
              fullErrorText.includes('origin') && fullErrorText.includes('not allowed') ||
              fullErrorText.includes('cors') ||
              fullErrorText.includes('allowed')) {
            errorMessage = `Origin not allowed: The domain '${window.location.origin}' is not authorized for this agent. Please add this domain to your agent's allowed origins in the NimbleBrain dashboard.`;
          } else {
            errorMessage = `Access denied: ${actualError}`;
          }
        } else if (response.status === 401) {
          errorMessage = `Authentication failed: ${actualError}`;
        } else if (response.status === 404) {
          if (endpoint.includes('/agents/')) {
            errorMessage = `Agent not found: The agent ID may be invalid or you may not have access to it.`;
          } else {
            errorMessage = `Not found: ${actualError}`;
          }
        } else if (response.status === 429) {
          errorMessage = `Rate limit exceeded: Too many requests. Please wait a moment and try again.`;
        } else if (response.status === 422) {
          errorMessage = `Validation error: ${actualError}`;
        } else if (response.status === 500) {
          errorMessage = `Server error: ${actualError}`;
        } else {
          errorMessage = actualError;
        }
      } catch (parseError) {
        // If we can't parse the error response, use the default message
      }
      
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return null as T;
    }

    const jsonResponse = await response.json();
    
    // API responses for authenticated endpoints are wrapped in { data: ... }
    // Session endpoint returns unwrapped response
    if (requireAuth && jsonResponse.data !== undefined) {
      return jsonResponse.data;
    }
    
    return jsonResponse;
  }

  async createSession(agentId: string, origin?: string): Promise<void> {
    const body: any = {};
    
    if (origin) {
      body.origin = origin;
      body.agentId = agentId;
    }

    const response = await this.request<SessionResponse>('/session', {
      method: 'POST',
      body: JSON.stringify(body),
    }, false); // Session creation doesn't require authentication

    // Extract token from the secure response structure: { token: "...", type: "Bearer", expires_in: 2592000 }
    const token = response.token;
    
    if (!token) {
      throw new Error(`No authentication token received from session endpoint. Response: ${JSON.stringify(response)}`);
    }

    this.bearerToken = token;
  }

  async getAgent(agentId: string): Promise<Agent> {
    return this.request<Agent>(`/agents/${agentId}`);
  }

  async createConversation(agentId: string, text: string): Promise<Conversation> {
    return this.request<Conversation>(`/agents/${agentId}/conversations`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async sendMessage(agentId: string, conversationId: string, text: string): Promise<Message> {
    return this.request<Message>(`/agents/${agentId}/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }
}