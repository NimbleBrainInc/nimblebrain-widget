import './widget.css';
import { NimbleBrainAPI, Agent, Conversation, Message } from './api';
import brainLogoWhite from './assets/nimblebrain_logo_white.png';
import { marked } from 'marked';

interface WidgetOptions {
  agentId: string;
  apiUrl?: string;
  position?: 'bottom-right' | 'bottom-left';
  primaryColor?: string;
}

export class ChatWidget {
  private api: NimbleBrainAPI;
  private agentId: string;
  private container: HTMLElement;
  private chatElement: HTMLElement | null = null;
  private messagesContainer: HTMLElement | null = null;
  private inputElement: HTMLTextAreaElement | null = null;
  private sendButton: HTMLButtonElement | null = null;
  private isOpen = false;
  private currentConversation: Conversation | null = null;
  private agent: Agent | null = null;
  private messages: Array<{text: string, isUser: boolean, id?: string}> = [];

  constructor(options: WidgetOptions) {
    this.agentId = options.agentId;
    this.api = new NimbleBrainAPI(options.apiUrl);
    this.container = this.createContainer(options);
    this.init();
  }

  private createContainer(options: WidgetOptions): HTMLElement {
    const container = document.createElement('div');
    container.className = 'nb-widget-container';
    
    if (options.position === 'bottom-left') {
      container.style.left = '20px';
      container.style.right = 'auto';
    }

    document.body.appendChild(container);
    return container;
  }

  private async init(): Promise<void> {
    try {
      // Create session first - this must succeed before getting agent info
      await this.api.createSession(this.agentId, window.location.origin);
      
      // Only get agent info if session creation succeeded
      this.agent = await this.api.getAgent(this.agentId);
      
      this.render();
    } catch (error) {
      console.error('Failed to initialize NimbleBrain widget:', error);
      
      let errorMessage = 'Failed to load chat widget';
      if (error instanceof Error) {
        if (error.message.includes('Origin not allowed')) {
          errorMessage = `Domain not authorized. Add ${window.location.origin} to your agent's allowed origins.`;
        } else if (error.message.includes('Agent not found')) {
          errorMessage = 'Agent not found. Check your agent ID.';
        } else if (error.message.includes('Authentication failed')) {
          errorMessage = 'Authentication failed. Check your agent configuration.';
        } else if (error.message.includes('Rate limit exceeded')) {
          errorMessage = 'Too many requests. Please wait and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      this.renderError(errorMessage);
    }
  }

  private render(): void {
    this.container.innerHTML = `
      <button class="nb-widget-button" id="nb-toggle-chat">
        <img src="${brainLogoWhite}" alt="Chat" class="nb-widget-button-icon" />
        <div class="nb-widget-button-caret"></div>
      </button>
      <button class="nb-widget-hide" id="nb-hide-widget" title="Hide widget">×</button>
      <div class="nb-widget-intro-popup" id="nb-intro-popup">
        <div class="nb-widget-intro-content">
          <div class="nb-widget-intro-text">
            <strong>👋 Hi there!</strong><br>
            I'm your NimbleBrain assistant. Click to ask me anything!
          </div>
          <button class="nb-widget-intro-close" id="nb-intro-close">×</button>
        </div>
        <div class="nb-widget-intro-arrow"></div>
      </div>
      <div class="nb-widget-chat" id="nb-chat-container">
        <div class="nb-widget-header">
          <h3>${this.agent?.title || 'Chat'}</h3>
          <div class="nb-widget-header-actions">
            <button class="nb-widget-reset" id="nb-reset-chat" title="New conversation">🔄</button>
            <button class="nb-widget-close" id="nb-close-chat">×</button>
          </div>
        </div>
        <div class="nb-widget-messages" id="nb-messages"></div>
        <div class="nb-widget-input-container">
          <textarea 
            class="nb-widget-input" 
            id="nb-message-input" 
            placeholder="Type your message..."
            rows="1"
          ></textarea>
          <button class="nb-widget-send" id="nb-send-button">→</button>
        </div>
        <div class="nb-widget-footer">
          <a href="https://www.nimblebrain.ai" target="_blank" rel="noopener" class="nb-widget-powered-by">Powered by NimbleBrain</a>
        </div>
      </div>
    `;

    this.setupElements();
    this.bindEvents();
  }

  private renderError(message: string): void {
    this.container.innerHTML = `
      <button class="nb-widget-button" style="background: #dc3545;">
        ⚠️
      </button>
      <div class="nb-widget-chat">
        <div class="nb-widget-error">
          ${message}
        </div>
      </div>
    `;
  }

  private setupElements(): void {
    this.chatElement = this.container.querySelector('#nb-chat-container');
    this.messagesContainer = this.container.querySelector('#nb-messages');
    this.inputElement = this.container.querySelector('#nb-message-input') as HTMLTextAreaElement;
    this.sendButton = this.container.querySelector('#nb-send-button') as HTMLButtonElement;
    
    // Show intro popup after a brief delay
    setTimeout(() => this.showIntroPopup(), 1500);
  }

  private bindEvents(): void {
    const toggleButton = this.container.querySelector('#nb-toggle-chat');
    const closeButton = this.container.querySelector('#nb-close-chat');
    const resetButton = this.container.querySelector('#nb-reset-chat');
    const hideButton = this.container.querySelector('#nb-hide-widget');
    const introClose = this.container.querySelector('#nb-intro-close');
    
    toggleButton?.addEventListener('click', () => this.toggleChat());
    closeButton?.addEventListener('click', () => this.closeChat());
    resetButton?.addEventListener('click', () => this.resetConversation());
    hideButton?.addEventListener('click', () => this.hideWidget());
    introClose?.addEventListener('click', () => this.dismissIntroPopup());

    if (this.inputElement) {
      this.inputElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });

      this.inputElement.addEventListener('input', () => {
        this.autoResize();
      });
    }

    this.sendButton?.addEventListener('click', () => this.sendMessage());
  }

  private autoResize(): void {
    if (!this.inputElement) return;
    
    this.inputElement.style.height = 'auto';
    this.inputElement.style.height = Math.min(this.inputElement.scrollHeight, 100) + 'px';
  }

  private toggleChat(): void {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  private openChat(): void {
    if (!this.chatElement) return;
    
    this.isOpen = true;
    this.chatElement.classList.add('open');
    
    // Dismiss intro popup when opening chat
    this.dismissIntroPopup();
    
    // Toggle button appearance
    const toggleButton = this.container.querySelector('#nb-toggle-chat');
    toggleButton?.classList.add('open');
    
    if (this.messages.length === 0) {
      this.addMessage('Hi! How can I help you today?', false);
    }
    
    setTimeout(() => {
      this.inputElement?.focus();
    }, 300);
  }

  private closeChat(): void {
    if (!this.chatElement) return;
    
    this.isOpen = false;
    this.chatElement.classList.remove('open');
    
    // Toggle button appearance back
    const toggleButton = this.container.querySelector('#nb-toggle-chat');
    toggleButton?.classList.remove('open');
  }

  private hideWidget(): void {
    this.container.style.display = 'none';
  }

  private showIntroPopup(): void {
    const popup = this.container.querySelector('#nb-intro-popup');
    if (popup && !this.isOpen) {
      popup.classList.add('show');
      
      // Auto-dismiss after 8 seconds if not manually closed
      setTimeout(() => {
        if (popup.classList.contains('show')) {
          this.dismissIntroPopup();
        }
      }, 8000);
    }
  }

  private dismissIntroPopup(): void {
    const popup = this.container.querySelector('#nb-intro-popup');
    if (popup) {
      popup.classList.remove('show');
    }
  }

  private resetConversation(): void {
    // Reset conversation state
    this.currentConversation = null;
    this.messages = [];
    
    // Clear messages display
    if (this.messagesContainer) {
      this.messagesContainer.innerHTML = '';
    }
    
    // Add initial greeting message
    this.addMessage('Hi! How can I help you today?', false);
  }

  private async sendMessage(): Promise<void> {
    if (!this.inputElement || !this.sendButton) return;
    
    const text = this.inputElement.value.trim();
    if (!text) return;

    this.inputElement.value = '';
    this.autoResize();
    this.sendButton.disabled = true;

    // Add user message
    this.addMessage(text, true);
    this.showTyping();

    try {
      let response: Message;

      if (!this.currentConversation) {
        // Create new conversation
        const conversation = await this.api.createConversation(this.agentId, text);
        this.currentConversation = conversation;
        
        // The first message response is included in the conversation
        if (conversation.messages && conversation.messages.length > 0) {
          response = conversation.messages[0];
        } else {
          throw new Error('No response received');
        }
      } else {
        // Send message to existing conversation
        response = await this.api.sendMessage(
          this.agentId, 
          this.currentConversation.id, 
          text
        );
      }

      this.hideTyping();
      this.addMessage(response.text, false, response.id);
    } catch (error) {
      console.error('Failed to send message:', error);
      this.hideTyping();
      this.addMessage('Sorry, I encountered an error. Please try again.', false);
    } finally {
      this.sendButton.disabled = false;
    }
  }

  private addMessage(text: string, isUser: boolean, id?: string): void {
    if (!this.messagesContainer) return;

    const messageElement = document.createElement('div');
    messageElement.className = `nb-widget-message ${isUser ? 'user' : 'bot'}`;
    
    if (isUser) {
      // User messages are always plain text for security
      messageElement.textContent = text;
      this.messagesContainer.appendChild(messageElement);
    } else {
      // Bot messages render markdown with clickable links
      const html = marked.parse(text, {
        breaks: true,
        gfm: true
      });
      
      if (typeof html === 'string') {
        messageElement.innerHTML = html;
        
        // Ensure all links open in new tab
        const links = messageElement.querySelectorAll('a');
        links.forEach(link => {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        });
        
        this.messagesContainer.appendChild(messageElement);
      } else {
        // Handle Promise case (async parsing)
        html.then(parsedHtml => {
          messageElement.innerHTML = parsedHtml;
          
          // Ensure all links open in new tab
          const links = messageElement.querySelectorAll('a');
          links.forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
          });
          
          if (this.messagesContainer) {
            this.messagesContainer.appendChild(messageElement);
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
          }
        });
        return; // Exit early to avoid double scroll
      }
    }

    this.messages.push({ text, isUser, id });
    
    // Scroll to bottom
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  private showTyping(): void {
    if (!this.messagesContainer) return;

    const typingElement = document.createElement('div');
    typingElement.className = 'nb-widget-typing';
    typingElement.id = 'nb-typing-indicator';
    typingElement.innerHTML = `
      <div class="nb-widget-typing-dot"></div>
      <div class="nb-widget-typing-dot"></div>
      <div class="nb-widget-typing-dot"></div>
    `;

    this.messagesContainer.appendChild(typingElement);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  private hideTyping(): void {
    const typingElement = this.container.querySelector('#nb-typing-indicator');
    typingElement?.remove();
  }

  public destroy(): void {
    this.container.remove();
  }
}

// Export for manual initialization
declare global {
  interface Window {
    NimbleBrainWidget: typeof ChatWidget;
  }
}

// Export as default for webpack
export default ChatWidget;

// Ensure the class is exported correctly to window
if (typeof window !== 'undefined') {
  window.NimbleBrainWidget = ChatWidget;
  console.log('NimbleBrain Widget: Class exported to window.NimbleBrainWidget');
}

// Auto-initialize when script loads
function initializeWidget(): void {
  try {
    let options: WidgetOptions | null = null;

    // Method 1: Check for global configuration
    if ((window as any).NimbleBrainConfig) {
      options = (window as any).NimbleBrainConfig;
    }
    // Method 2: Try to get from script src (if available)
    else if (document.currentScript) {
      const url = new URL((document.currentScript as HTMLScriptElement).src);
      
      if (url.searchParams.has('noAutoInit')) {
        console.log('NimbleBrain Widget: Auto-initialization disabled');
        return;
      }
      
      const agentId = url.searchParams.get('agentId');
      if (agentId) {
        options = {
          agentId,
          apiUrl: url.searchParams.get('apiUrl') || undefined,
          position: (url.searchParams.get('position') as any) || 'bottom-right',
          primaryColor: url.searchParams.get('primaryColor') || undefined,
        };
      }
    }
    // Method 3: Fallback - search for widget script in DOM
    else {
      const scripts = Array.from(document.querySelectorAll('script[src]')) as HTMLScriptElement[];
      for (const script of scripts) {
        if (script.src.includes('widget') && script.src.includes('nimblebrain')) {
          const url = new URL(script.src);
          
          if (url.searchParams.has('noAutoInit')) {
            console.log('NimbleBrain Widget: Auto-initialization disabled');
            return;
          }
          
          const agentId = url.searchParams.get('agentId');
          if (agentId) {
            options = {
              agentId,
              apiUrl: url.searchParams.get('apiUrl') || undefined,
              position: (url.searchParams.get('position') as any) || 'bottom-right',
              primaryColor: url.searchParams.get('primaryColor') || undefined,
            };
            break;
          }
        }
      }
    }

    if (!options || !options.agentId) {
      console.log('NimbleBrain Widget: No configuration found, skipping auto-initialization');
      return;
    }

    console.log('NimbleBrain Widget: Auto-initializing with agentId:', options.agentId);
    new ChatWidget(options);
  } catch (error) {
    console.error('NimbleBrain Widget: Auto-initialization failed:', error);
  }
}

// Initialize when DOM is ready, but don't fail if there are issues
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeWidget);
} else {
  // Small delay to ensure script is fully loaded
  setTimeout(initializeWidget, 0);
}