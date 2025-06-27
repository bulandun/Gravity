import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const aiOutputChecks = pgTable("ai_output_checks", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  modelName: varchar("model_name", { length: 255 }).notNull(),
  inputData: text("input_data").notNull(),
  outputData: text("output_data").notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  riskScore: real("risk_score").notNull(),
  reasons: jsonb("reasons").$type<string[]>().default([]),
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
});

export const trainingDataScans = pgTable("training_data_scans", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileSize: integer("file_size").notNull(),
  totalRows: integer("total_rows").notNull(),
  flaggedRows: integer("flagged_rows").notNull(),
  privacyRisks: integer("privacy_risks").notNull(),
  biasFlags: integer("bias_flags").notNull(),
  missingDocs: integer("missing_docs").notNull(),
  scanResults: jsonb("scan_results").$type<Record<string, any>>().notNull(),
  status: varchar("status", { length: 50 }).notNull(),
});

export const auditReports = pgTable("audit_reports", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  reportType: varchar("report_type", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).notNull(),
  complianceFramework: varchar("compliance_framework", { length: 100 }).notNull(),
  findings: jsonb("findings").$type<Record<string, any>>().notNull(),
  recommendations: jsonb("recommendations").$type<string[]>().default([]),
  pdfPath: text("pdf_path"),
});

export const complianceMetrics = pgTable("compliance_metrics", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  complianceScore: real("compliance_score").notNull(),
  flaggedOutputs24h: integer("flagged_outputs_24h").notNull(),
  modelDriftPercent: real("model_drift_percent").notNull(),
  activeAudits: integer("active_audits").notNull(),
  hipaaCompliance: boolean("hipaa_compliance").notNull(),
  gdprCompliance: boolean("gdpr_compliance").notNull(),
  totalChecks24h: integer("total_checks_24h").notNull(),
});

export const modelDriftData = pgTable("model_drift_data", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  modelName: varchar("model_name", { length: 255 }).notNull(),
  driftScore: real("drift_score").notNull(),
  baselineAccuracy: real("baseline_accuracy").notNull(),
  currentAccuracy: real("current_accuracy").notNull(),
  dataDistributionShift: real("data_distribution_shift").notNull(),
  performanceMetrics: jsonb("performance_metrics").$type<Record<string, any>>().notNull(),
});

export const biasDetectionResults = pgTable("bias_detection_results", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  modelName: varchar("model_name", { length: 255 }).notNull(),
  demographicGroup: varchar("demographic_group", { length: 100 }).notNull(),
  biasScore: real("bias_score").notNull(),
  fairnessMetrics: jsonb("fairness_metrics").$type<Record<string, any>>().notNull(),
  mitigationSuggestions: jsonb("mitigation_suggestions").$type<string[]>().default([]),
});

export const complianceAlerts = pgTable("compliance_alerts", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  alertType: varchar("alert_type", { length: 100 }).notNull(),
  severity: varchar("severity", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  modelName: varchar("model_name", { length: 255 }),
  status: varchar("status", { length: 50 }).notNull(),
  resolvedAt: timestamp("resolved_at"),
});

// Schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAiOutputCheckSchema = createInsertSchema(aiOutputChecks).omit({
  id: true,
  timestamp: true,
});

export const insertTrainingDataScanSchema = createInsertSchema(trainingDataScans).omit({
  id: true,
  timestamp: true,
});

export const insertAuditReportSchema = createInsertSchema(auditReports).omit({
  id: true,
  timestamp: true,
});

export const insertComplianceMetricsSchema = createInsertSchema(complianceMetrics).omit({
  id: true,
  timestamp: true,
});

export const insertModelDriftDataSchema = createInsertSchema(modelDriftData).omit({
  id: true,
  timestamp: true,
});

export const insertBiasDetectionResultSchema = createInsertSchema(biasDetectionResults).omit({
  id: true,
  timestamp: true,
});

export const insertComplianceAlertSchema = createInsertSchema(complianceAlerts).omit({
  id: true,
  timestamp: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type AiOutputCheck = typeof aiOutputChecks.$inferSelect;
export type InsertAiOutputCheck = z.infer<typeof insertAiOutputCheckSchema>;

export type TrainingDataScan = typeof trainingDataScans.$inferSelect;
export type InsertTrainingDataScan = z.infer<typeof insertTrainingDataScanSchema>;

export type AuditReport = typeof auditReports.$inferSelect;
export type InsertAuditReport = z.infer<typeof insertAuditReportSchema>;

export type ComplianceMetrics = typeof complianceMetrics.$inferSelect;
export type InsertComplianceMetrics = z.infer<typeof insertComplianceMetricsSchema>;

export type ModelDriftData = typeof modelDriftData.$inferSelect;
export type InsertModelDriftData = z.infer<typeof insertModelDriftDataSchema>;

export type BiasDetectionResult = typeof biasDetectionResults.$inferSelect;
export type InsertBiasDetectionResult = z.infer<typeof insertBiasDetectionResultSchema>;

export type ComplianceAlert = typeof complianceAlerts.$inferSelect;
export type InsertComplianceAlert = z.infer<typeof insertComplianceAlertSchema>;
