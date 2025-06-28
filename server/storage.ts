import { messages, sessions, networkStats, gasPrice, type Message, type Session, type NetworkStats, type GasPrice, type InsertMessage, type InsertSession, type InsertNetworkStats, type InsertGasPrice } from "@shared/schema";

export interface IStorage {
  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBySession(sessionId: string): Promise<Message[]>;
  
  // Sessions
  createSession(session: InsertSession): Promise<Session>;
  getSession(sessionId: string): Promise<Session | undefined>;
  updateSessionActivity(sessionId: string): Promise<void>;
  
  // Network Stats
  createNetworkStats(stats: InsertNetworkStats): Promise<NetworkStats>;
  getLatestNetworkStats(): Promise<NetworkStats | undefined>;
  
  // Gas Prices
  createGasPrice(price: InsertGasPrice): Promise<GasPrice>;
  getLatestGasPrice(): Promise<GasPrice | undefined>;
}

export class MemStorage implements IStorage {
  private messages: Map<number, Message>;
  private sessions: Map<string, Session>;
  private networkStats: Map<number, NetworkStats>;
  private gasPrices: Map<number, GasPrice>;
  private currentMessageId: number;
  private currentSessionId: number;
  private currentNetworkStatsId: number;
  private currentGasPriceId: number;

  constructor() {
    this.messages = new Map();
    this.sessions = new Map();
    this.networkStats = new Map();
    this.gasPrices = new Map();
    this.currentMessageId = 1;
    this.currentSessionId = 1;
    this.currentNetworkStatsId = 1;
    this.currentGasPriceId = 1;

    // Initialize with some sample data
    this.initializeData();
  }

  private initializeData() {
    // Create initial gas price data
    const initialGasPrice: GasPrice = {
      id: this.currentGasPriceId++,
      arbitrum: 0.1,
      ethereum: 25.4,
      timestamp: new Date(),
    };
    this.gasPrices.set(initialGasPrice.id, initialGasPrice);

    // Create initial network stats
    const initialStats: NetworkStats = {
      id: this.currentNetworkStatsId++,
      tps: 2847,
      gasUsed: 68.2,
      timestamp: new Date(),
    };
    this.networkStats.set(initialStats.id, initialStats);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = {
      ...insertMessage,
      id,
      timestamp: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessagesBySession(sessionId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => msg.sessionId === sessionId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = this.currentSessionId++;
    const session: Session = {
      ...insertSession,
      id,
      createdAt: new Date(),
      lastActivity: new Date(),
    };
    this.sessions.set(insertSession.sessionId, session);
    return session;
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    return this.sessions.get(sessionId);
  }

  async updateSessionActivity(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActivity = new Date();
    }
  }

  async createNetworkStats(insertStats: InsertNetworkStats): Promise<NetworkStats> {
    const id = this.currentNetworkStatsId++;
    const stats: NetworkStats = {
      ...insertStats,
      id,
      timestamp: new Date(),
    };
    this.networkStats.set(id, stats);
    return stats;
  }

  async getLatestNetworkStats(): Promise<NetworkStats | undefined> {
    const allStats = Array.from(this.networkStats.values());
    return allStats.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
  }

  async createGasPrice(insertPrice: InsertGasPrice): Promise<GasPrice> {
    const id = this.currentGasPriceId++;
    const price: GasPrice = {
      ...insertPrice,
      id,
      timestamp: new Date(),
    };
    this.gasPrices.set(id, price);
    return price;
  }

  async getLatestGasPrice(): Promise<GasPrice | undefined> {
    const allPrices = Array.from(this.gasPrices.values());
    return allPrices.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
  }
}

export const storage = new MemStorage();
