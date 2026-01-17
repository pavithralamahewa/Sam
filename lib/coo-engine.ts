/**
 * AI COO Engine - The Brain
 *
 * This is the actual intelligence layer that:
 * 1. Continuously monitors business metrics
 * 2. Makes strategic decisions
 * 3. Proactively identifies opportunities
 * 4. Learns from business context
 */

import Anthropic from '@anthropic-ai/sdk';

export interface BusinessContext {
  // Company Intelligence
  name: string;
  positioning: string;
  caseStudies: Array<{
    client: string;
    problem: string;
    solution: string;
    results: string;
  }>;

  // Team Capabilities
  teamSize: number;
  expertise: string[];
  availability: 'high' | 'medium' | 'low';

  // Market Intelligence
  idealClient: string;
  pricingModel: string;
  avgProjectValue: number;

  // Current State
  activeProjects: number;
  pipeline: Lead[];
  recentConversations: Conversation[];
}

export interface Lead {
  id: string;
  company: string;
  contact: string;
  source: string;
  stage: 'cold' | 'warm' | 'hot' | 'proposal' | 'negotiation';
  value: number;
  lastInteraction: Date;
  context: string;
  intentScore: number;
}

export interface Conversation {
  id: string;
  leadId: string;
  messages: Array<{
    from: 'lead' | 'precious';
    content: string;
    timestamp: Date;
  }>;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface COODecision {
  type: 'intervention' | 'background_action' | 'strategic_insight';
  priority: 'critical' | 'high' | 'medium' | 'low';

  // For interventions
  title?: string;
  description?: string;
  suggestedActions?: Array<{
    label: string;
    action: string;
    reasoning: string;
  }>;

  // For background actions
  actionTaken?: string;
  result?: string;

  // For strategic insights
  insight?: string;
  recommendations?: string[];

  // Reasoning (always included)
  reasoning: string;
  confidence: number;
}

export class COOEngine {
  private client: Anthropic;
  private context: BusinessContext | null = null;
  private isThinking = false;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  /**
   * Initialize COO with business context
   * This is the "onboarding" phase where COO learns about Precious
   */
  async learn(context: BusinessContext): Promise<void> {
    this.context = context;
    console.log('🧠 COO learned business context:', {
      company: context.name,
      expertise: context.expertise,
      pipeline: context.pipeline.length,
    });
  }

  /**
   * Continuous monitoring loop
   * COO analyzes current state and decides what to do
   */
  async think(): Promise<COODecision | null> {
    if (!this.context || this.isThinking) return null;

    this.isThinking = true;

    try {
      const prompt = this.buildAnalysisPrompt();

      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        temperature: 0.7,
        system: this.getSystemPrompt(),
        messages: [{
          role: 'user',
          content: prompt,
        }],
      });

      const content = response.content[0];
      if (content.type !== 'text') return null;

      // Parse Claude's decision
      const decision = this.parseDecision(content.text);

      return decision;
    } catch (error) {
      console.error('COO thinking error:', error);
      return null;
    } finally {
      this.isThinking = false;
    }
  }

  /**
   * Generate intelligent response to a lead
   */
  async generateResponse(lead: Lead, conversation: Conversation): Promise<string> {
    if (!this.context) throw new Error('COO not initialized');

    const prompt = `
# Context
You are the AI COO for ${this.context.name}, a ${this.context.positioning}.

## Our Expertise
${this.context.expertise.join(', ')}

## Relevant Case Studies
${this.context.caseStudies.map(cs => `
- ${cs.client}: ${cs.problem} → ${cs.solution} (${cs.results})
`).join('\n')}

## Current Conversation
${conversation.messages.map(m => `${m.from}: ${m.content}`).join('\n\n')}

## Lead Details
- Company: ${lead.company}
- Contact: ${lead.contact}
- Stage: ${lead.stage}
- Potential Value: $${lead.value.toLocaleString()}
- Intent Score: ${lead.intentScore}/100

# Task
Draft a highly personalized, strategic reply that:
1. References specific pain points they mentioned
2. Ties to our most relevant case study
3. Moves them closer to booking a call
4. Feels human and genuine (not salesy)
5. Is concise (2-3 short paragraphs max)

Write ONLY the email body, no subject line.
`;

    const response = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      temperature: 0.8,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    return content.type === 'text' ? content.text : '';
  }

  /**
   * Analyze a new inbound message and score intent
   */
  async analyzeInbound(message: string, lead: Lead): Promise<{
    intentScore: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    urgency: 'critical' | 'high' | 'medium' | 'low';
    keySignals: string[];
    suggestedNextSteps: string[];
  }> {
    const prompt = `
Analyze this inbound message from ${lead.contact} at ${lead.company}:

"${message}"

Context:
- Current stage: ${lead.stage}
- Previous intent score: ${lead.intentScore}/100

Provide analysis in this JSON format:
{
  "intentScore": 0-100,
  "sentiment": "positive|neutral|negative",
  "urgency": "critical|high|medium|low",
  "keySignals": ["signal1", "signal2"],
  "suggestedNextSteps": ["step1", "step2"]
}

Key buying signals to look for:
- Mentions of budget, timeline, approval
- Questions about pricing, process, timeline
- Requests for case studies, references
- Urgency indicators ("ASAP", "this week", "urgent")
- Decision maker involvement
- Specific pain points mentioned
`;

    const response = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 512,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      return {
        intentScore: 50,
        sentiment: 'neutral',
        urgency: 'medium',
        keySignals: [],
        suggestedNextSteps: [],
      };
    }

    try {
      // Extract JSON from response
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse analysis:', e);
    }

    return {
      intentScore: 50,
      sentiment: 'neutral',
      urgency: 'medium',
      keySignals: [],
      suggestedNextSteps: [],
    };
  }

  /**
   * System prompt that defines COO personality and capabilities
   */
  private getSystemPrompt(): string {
    return `You are the AI Chief Operating Officer for ${this.context?.name || 'Precious'}.

Your role is to:
1. Continuously monitor business metrics and pipeline
2. Identify opportunities and risks proactively
3. Make strategic decisions about lead prioritization
4. Generate intelligent, personalized responses to leads
5. Optimize for revenue growth and client quality

Personality:
- Strategic and data-driven
- Proactive, not reactive
- Focused on high-value actions
- Direct and clear in communication
- Confident but not arrogant

Decision-making principles:
1. Prioritize high-intent leads over cold outreach
2. Speed matters - respond to hot leads within minutes
3. Personalization > Volume
4. Case studies and proof points are powerful
5. Always think about next steps and momentum

When you identify something that requires immediate human attention, create an intervention.
When you can handle something in the background, do it automatically.
When you spot strategic patterns, surface insights for long-term planning.`;
  }

  /**
   * Build analysis prompt with current business state
   */
  private buildAnalysisPrompt(): string {
    const ctx = this.context!;

    return `
# Current Business State

## Pipeline Overview
${ctx.pipeline.map(lead => `
- ${lead.company} (${lead.stage}): $${lead.value.toLocaleString()}
  Intent: ${lead.intentScore}/100 | Last contact: ${this.formatTimeAgo(lead.lastInteraction)}
  Context: ${lead.context}
`).join('\n')}

## Recent Activity
${ctx.recentConversations.slice(0, 3).map(conv => `
- Lead #${conv.leadId}: ${conv.messages.length} messages, ${conv.sentiment} sentiment
  Latest: "${conv.messages[conv.messages.length - 1]?.content.substring(0, 100)}..."
`).join('\n')}

## Team Status
- Active projects: ${ctx.activeProjects}
- Availability: ${ctx.availability}
- Team size: ${ctx.teamSize}

# Analysis Task
Review the current state and decide:

1. Is there anything that requires IMMEDIATE human intervention?
   (e.g., hot lead replied, deal at risk, urgent opportunity)

2. Are there actions I can take in the background?
   (e.g., draft replies, update CRM, prioritize leads)

3. Are there strategic insights worth surfacing?
   (e.g., patterns in pipeline, opportunities for optimization)

Respond with ONE decision in this format:

TYPE: intervention | background_action | strategic_insight | none
PRIORITY: critical | high | medium | low
TITLE: [if intervention]
DESCRIPTION: [1-2 sentences]
SUGGESTED_ACTIONS: [if intervention, list 2-3 specific actions]
REASONING: [your strategic thinking]
CONFIDENCE: [0-100]
`;
  }

  /**
   * Parse Claude's decision into structured format
   */
  private parseDecision(response: string): COODecision | null {
    try {
      const lines = response.split('\n');
      const data: any = {};

      lines.forEach(line => {
        const match = line.match(/^(\w+):\s*(.+)$/);
        if (match) {
          const [, key, value] = match;
          data[key.toLowerCase()] = value;
        }
      });

      if (data.type === 'none') return null;

      return {
        type: data.type || 'strategic_insight',
        priority: data.priority || 'medium',
        title: data.title,
        description: data.description,
        reasoning: data.reasoning || 'No reasoning provided',
        confidence: parseInt(data.confidence) || 50,
      } as COODecision;
    } catch (error) {
      console.error('Failed to parse decision:', error);
      return null;
    }
  }

  private formatTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }
}
