import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema, insertSessionSchema } from "@shared/schema";
import { z } from "zod";
import { nanoid } from "nanoid";

const assistantPersonalities = {
  alice: {
    name: "Alice",
    role: "Trading Assistant",
    specialties: ["gas prices", "trading optimization", "MEV protection", "bridge fees"],
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
  },
  bob: {
    name: "Bob", 
    role: "Developer Assistant",
    specialties: ["contract interactions", "debugging", "ABIs", "development tools"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  charlie: {
    name: "Charlie",
    role: "Analytics Assistant", 
    specialties: ["whale tracking", "transaction analysis", "market trends", "on-chain data"],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  }
};

function generateAssistantResponse(message: string, userId: string): {
  response: string;
  toolsUsed: string[];
  confidence: number;
} {
  const assistant = assistantPersonalities[userId as keyof typeof assistantPersonalities];
  
  if (!assistant) {
    return {
      response: "Sorry, I'm not sure how to help with that.",
      toolsUsed: [],
      confidence: 0.5
    };
  }

  // Simple keyword-based responses
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('gas') || lowerMessage.includes('price')) {
    return {
      response: `Based on current data, Arbitrum gas prices are significantly lower than Ethereum mainnet. Current Arbitrum gas price is around 0.1 gwei compared to Ethereum's ~25 gwei. This represents a 99.6% cost savings! Perfect for high-frequency trading strategies.`,
      toolsUsed: ["Gas Tracker API", "Price Oracle"],
      confidence: 0.95
    };
  }
  
  if (lowerMessage.includes('whale') || lowerMessage.includes('large')) {
    return {
      response: `I'm detecting some interesting whale activity! Recent large transactions include: 1,250 ETH transfer, 500K USDC swap, and 2.1M ARB accumulation. These movements often signal market shifts.`,
      toolsUsed: ["Whale Tracker", "Transaction Monitor"],
      confidence: 0.88
    };
  }
  
  if (lowerMessage.includes('contract') || lowerMessage.includes('abi')) {
    return {
      response: `For contract interactions, I recommend using the latest ABIs from the official Arbitrum documentation. Top active contracts include Uniswap V3, 1inch Router, and Arbitrum Bridge. Would you like specific ABI details?`,
      toolsUsed: ["Contract Scanner", "ABI Parser"],
      confidence: 0.92
    };
  }

  // Default response based on assistant role
  return {
    response: `As your ${assistant.role.toLowerCase()}, I specialize in ${assistant.specialties.join(', ')}. How can I help you with ${assistant.specialties[0]} today?`,
    toolsUsed: [assistant.role.split(' ')[0] + " Analytics"],
    confidence: 0.85
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat endpoints
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, userId, sessionId: providedSessionId } = req.body;
      
      if (!message || !userId) {
        return res.status(400).json({ error: "Message and userId are required" });
      }

      // Generate or use provided session ID
      const sessionId = providedSessionId || `ARB-${nanoid(4).toUpperCase()}`;
      
      // Create session if it doesn't exist
      let session = await storage.getSession(sessionId);
      if (!session) {
        session = await storage.createSession({ sessionId, userId });
      }

      // Save user message
      const userMessage = await storage.createMessage({
        content: message,
        messageType: 'user',
        sessionId,
        userId,
        toolsUsed: [],
        metadata: null
      });

      // Generate AI response
      const { response, toolsUsed, confidence } = generateAssistantResponse(message, userId);
      
      // Save assistant message
      const assistantMessage = await storage.createMessage({
        content: response,
        messageType: 'assistant',
        sessionId,
        userId,
        toolsUsed,
        confidence,
        metadata: JSON.stringify({
          contextUsed: true,
          fallbackLevel: "none"
        })
      });

      // Update session activity
      await storage.updateSessionActivity(sessionId);

      res.json({
        response,
        toolsUsed,
        sessionId,
        confidence,
        metadata: {
          contextUsed: true,
          fallbackLevel: "none"
        }
      });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/chat/history/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getMessagesBySession(sessionId);
      res.json(messages);
    } catch (error) {
      console.error('Chat history error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Analytics endpoints
  app.get("/api/analytics/gas-prices", async (req, res) => {
    try {
      const gasPrice = await storage.getLatestGasPrice();
      if (!gasPrice) {
        return res.status(404).json({ error: "No gas price data available" });
      }
      res.json(gasPrice);
    } catch (error) {
      console.error('Gas prices error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/analytics/network-stats", async (req, res) => {
    try {
      const stats = await storage.getLatestNetworkStats();
      if (!stats) {
        return res.status(404).json({ error: "No network stats available" });
      }
      res.json(stats);
    } catch (error) {
      console.error('Network stats error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/analytics/top-contracts", async (req, res) => {
    try {
      // Mock top contracts data
      const topContracts = [
        {
          name: "Uniswap V3",
          address: "0x1f98...c73e",
          txCount: 1247,
          icon: "cube"
        },
        {
          name: "1inch Router", 
          address: "0x1111...567b",
          txCount: 894,
          icon: "exchange-alt"
        },
        {
          name: "Arbitrum Bridge",
          address: "0x8315...bc21", 
          txCount: 623,
          icon: "coins"
        }
      ];
      res.json(topContracts);
    } catch (error) {
      console.error('Top contracts error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/analytics/whale-activity", async (req, res) => {
    try {
      // Mock whale activity data
      const whaleActivity = [
        {
          type: "Large ETH Transfer",
          amount: "1,250 ETH",
          timestamp: new Date().toISOString()
        },
        {
          type: "USDC Swap",
          amount: "500K USDC", 
          timestamp: new Date(Date.now() - 300000).toISOString()
        },
        {
          type: "ARB Accumulation",
          amount: "2.1M ARB",
          timestamp: new Date(Date.now() - 600000).toISOString()
        }
      ];
      res.json(whaleActivity);
    } catch (error) {
      console.error('Whale activity error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
