import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  messageType: text("message_type").notNull().$type<'user' | 'assistant'>(),
  sessionId: text("session_id").notNull(),
  userId: text("user_id").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  toolsUsed: text("tools_used").array(),
  confidence: real("confidence"),
  metadata: text("metadata"), // JSON string
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastActivity: timestamp("last_activity").notNull().defaultNow(),
});

export const networkStats = pgTable("network_stats", {
  id: serial("id").primaryKey(),
  tps: integer("tps").notNull(),
  gasUsed: real("gas_used").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const gasPrice = pgTable("gas_price", {
  id: serial("id").primaryKey(),
  arbitrum: real("arbitrum").notNull(),
  ethereum: real("ethereum").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true,
  lastActivity: true,
});

export const insertNetworkStatsSchema = createInsertSchema(networkStats).omit({
  id: true,
  timestamp: true,
});

export const insertGasPriceSchema = createInsertSchema(gasPrice).omit({
  id: true,
  timestamp: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertNetworkStats = z.infer<typeof insertNetworkStatsSchema>;
export type NetworkStats = typeof networkStats.$inferSelect;
export type InsertGasPrice = z.infer<typeof insertGasPriceSchema>;
export type GasPrice = typeof gasPrice.$inferSelect;
