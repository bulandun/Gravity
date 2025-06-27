import { 
  users, aiOutputChecks, trainingDataScans, auditReports, complianceMetrics,
  modelDriftData, biasDetectionResults, complianceAlerts,
  type User, type InsertUser, type AiOutputCheck, type InsertAiOutputCheck,
  type TrainingDataScan, type InsertTrainingDataScan, type AuditReport, type InsertAuditReport,
  type ComplianceMetrics, type InsertComplianceMetrics, type ModelDriftData, type InsertModelDriftData,
  type BiasDetectionResult, type InsertBiasDetectionResult, type ComplianceAlert, type InsertComplianceAlert
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, sql, count } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // AI Output Checks
  createAiOutputCheck(check: InsertAiOutputCheck): Promise<AiOutputCheck>;
  getAiOutputChecks(limit?: number): Promise<AiOutputCheck[]>;
  getRecentAiOutputChecks(hours?: number): Promise<AiOutputCheck[]>;

  // Training Data Scans
  createTrainingDataScan(scan: InsertTrainingDataScan): Promise<TrainingDataScan>;
  getTrainingDataScans(limit?: number): Promise<TrainingDataScan[]>;

  // Audit Reports
  createAuditReport(report: InsertAuditReport): Promise<AuditReport>;
  getAuditReports(limit?: number): Promise<AuditReport[]>;
  getAuditReport(id: number): Promise<AuditReport | undefined>;

  // Compliance Metrics
  createComplianceMetrics(metrics: InsertComplianceMetrics): Promise<ComplianceMetrics>;
  getLatestComplianceMetrics(): Promise<ComplianceMetrics | undefined>;
  getComplianceMetricsHistory(days?: number): Promise<ComplianceMetrics[]>;

  // Model Drift Data
  createModelDriftData(drift: InsertModelDriftData): Promise<ModelDriftData>;
  getModelDriftData(modelName?: string, days?: number): Promise<ModelDriftData[]>;

  // Bias Detection Results
  createBiasDetectionResult(result: InsertBiasDetectionResult): Promise<BiasDetectionResult>;
  getBiasDetectionResults(modelName?: string, days?: number): Promise<BiasDetectionResult[]>;

  // Compliance Alerts
  createComplianceAlert(alert: InsertComplianceAlert): Promise<ComplianceAlert>;
  getComplianceAlerts(status?: string, limit?: number): Promise<ComplianceAlert[]>;
  updateComplianceAlertStatus(id: number, status: string): Promise<ComplianceAlert | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createAiOutputCheck(check: InsertAiOutputCheck): Promise<AiOutputCheck> {
    const [result] = await db.insert(aiOutputChecks).values(check).returning();
    return result;
  }

  async getAiOutputChecks(limit: number = 50): Promise<AiOutputCheck[]> {
    return await db.select().from(aiOutputChecks)
      .orderBy(desc(aiOutputChecks.timestamp))
      .limit(limit);
  }

  async getRecentAiOutputChecks(hours: number = 24): Promise<AiOutputCheck[]> {
    const hoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000);
    return await db.select().from(aiOutputChecks)
      .where(gte(aiOutputChecks.timestamp, hoursAgo))
      .orderBy(desc(aiOutputChecks.timestamp));
  }

  async createTrainingDataScan(scan: InsertTrainingDataScan): Promise<TrainingDataScan> {
    const [result] = await db.insert(trainingDataScans).values(scan).returning();
    return result;
  }

  async getTrainingDataScans(limit: number = 50): Promise<TrainingDataScan[]> {
    return await db.select().from(trainingDataScans)
      .orderBy(desc(trainingDataScans.timestamp))
      .limit(limit);
  }

  async createAuditReport(report: InsertAuditReport): Promise<AuditReport> {
    const [result] = await db.insert(auditReports).values(report).returning();
    return result;
  }

  async getAuditReports(limit: number = 50): Promise<AuditReport[]> {
    return await db.select().from(auditReports)
      .orderBy(desc(auditReports.timestamp))
      .limit(limit);
  }

  async getAuditReport(id: number): Promise<AuditReport | undefined> {
    const [report] = await db.select().from(auditReports).where(eq(auditReports.id, id));
    return report || undefined;
  }

  async createComplianceMetrics(metrics: InsertComplianceMetrics): Promise<ComplianceMetrics> {
    const [result] = await db.insert(complianceMetrics).values(metrics).returning();
    return result;
  }

  async getLatestComplianceMetrics(): Promise<ComplianceMetrics | undefined> {
    const [metrics] = await db.select().from(complianceMetrics)
      .orderBy(desc(complianceMetrics.timestamp))
      .limit(1);
    return metrics || undefined;
  }

  async getComplianceMetricsHistory(days: number = 7): Promise<ComplianceMetrics[]> {
    const daysAgo = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return await db.select().from(complianceMetrics)
      .where(gte(complianceMetrics.timestamp, daysAgo))
      .orderBy(desc(complianceMetrics.timestamp));
  }

  async createModelDriftData(drift: InsertModelDriftData): Promise<ModelDriftData> {
    const [result] = await db.insert(modelDriftData).values(drift).returning();
    return result;
  }

  async getModelDriftData(modelName?: string, days: number = 30): Promise<ModelDriftData[]> {
    const daysAgo = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const query = db.select().from(modelDriftData)
      .where(gte(modelDriftData.timestamp, daysAgo))
      .orderBy(desc(modelDriftData.timestamp));

    if (modelName) {
      return await query.where(and(
        gte(modelDriftData.timestamp, daysAgo),
        eq(modelDriftData.modelName, modelName)
      ));
    }

    return await query;
  }

  async createBiasDetectionResult(result: InsertBiasDetectionResult): Promise<BiasDetectionResult> {
    const [biasResult] = await db.insert(biasDetectionResults).values(result).returning();
    return biasResult;
  }

  async getBiasDetectionResults(modelName?: string, days: number = 30): Promise<BiasDetectionResult[]> {
    const daysAgo = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const query = db.select().from(biasDetectionResults)
      .where(gte(biasDetectionResults.timestamp, daysAgo))
      .orderBy(desc(biasDetectionResults.timestamp));

    if (modelName) {
      return await query.where(and(
        gte(biasDetectionResults.timestamp, daysAgo),
        eq(biasDetectionResults.modelName, modelName)
      ));
    }

    return await query;
  }

  async createComplianceAlert(alert: InsertComplianceAlert): Promise<ComplianceAlert> {
    const [result] = await db.insert(complianceAlerts).values(alert).returning();
    return result;
  }

  async getComplianceAlerts(status?: string, limit: number = 50): Promise<ComplianceAlert[]> {
    const query = db.select().from(complianceAlerts)
      .orderBy(desc(complianceAlerts.timestamp))
      .limit(limit);

    if (status) {
      return await query.where(eq(complianceAlerts.status, status));
    }

    return await query;
  }

  async updateComplianceAlertStatus(id: number, status: string): Promise<ComplianceAlert | undefined> {
    const [alert] = await db.update(complianceAlerts)
      .set({ status, resolvedAt: status === 'resolved' ? new Date() : null })
      .where(eq(complianceAlerts.id, id))
      .returning();
    return alert || undefined;
  }
}

export const storage = new DatabaseStorage();
