import { query } from '../../db';
import {
  EmailLead,
  CreateEmailLeadInput,
  DatabaseError,
} from '../types';

/**
 * Create a new email lead
 */
export async function createEmailLead(leadData: CreateEmailLeadInput): Promise<EmailLead> {
  try {
    const result = await query(
      `INSERT INTO email_leads (email, scan_id, converted_to_paid, last_contacted)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        leadData.email,
        leadData.scan_id || null,
        leadData.converted_to_paid || false,
        leadData.last_contacted || null,
      ]
    );
    
    return result.rows[0];
  } catch (error) {
    throw new DatabaseError('Failed to create email lead', error);
  }
}

/**
 * Find email lead by email address
 */
export async function findEmailLeadByEmail(email: string): Promise<EmailLead | null> {
  try {
    const result = await query(
      'SELECT * FROM email_leads WHERE email = $1 ORDER BY created_at DESC LIMIT 1',
      [email]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    throw new DatabaseError('Failed to find email lead by email', error);
  }
}

/**
 * Get all email leads for a scan
 */
export async function getEmailLeadsForScan(scanId: string): Promise<EmailLead[]> {
  try {
    const result = await query(
      'SELECT * FROM email_leads WHERE scan_id = $1 ORDER BY created_at DESC',
      [scanId]
    );
    
    return result.rows;
  } catch (error) {
    throw new DatabaseError('Failed to get email leads for scan', error);
  }
}

/**
 * Mark email lead as converted to paid
 */
export async function markEmailLeadAsConverted(email: string): Promise<EmailLead | null> {
  try {
    const result = await query(
      `UPDATE email_leads 
       SET converted_to_paid = true 
       WHERE email = $1 
       RETURNING *`,
      [email]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    throw new DatabaseError('Failed to mark email lead as converted', error);
  }
}

/**
 * Update last contacted timestamp
 */
export async function updateLastContacted(email: string): Promise<EmailLead | null> {
  try {
    const result = await query(
      `UPDATE email_leads 
       SET last_contacted = NOW() 
       WHERE email = $1 
       RETURNING *`,
      [email]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    throw new DatabaseError('Failed to update last contacted', error);
  }
}

/**
 * Get unconverted leads for marketing campaigns
 */
export async function getUnconvertedLeads(
  limit: number = 100,
  daysSinceLastContact: number = 7
): Promise<EmailLead[]> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysSinceLastContact);
    
    const result = await query(
      `SELECT * FROM email_leads 
       WHERE converted_to_paid = false 
       AND (last_contacted IS NULL OR last_contacted < $1)
       ORDER BY created_at DESC 
       LIMIT $2`,
      [cutoffDate.toISOString(), limit]
    );
    
    return result.rows;
  } catch (error) {
    throw new DatabaseError('Failed to get unconverted leads', error);
  }
}

/**
 * Get email lead statistics
 */
export async function getEmailLeadStatistics(days: number = 30): Promise<{
  total_leads: number;
  converted_leads: number;
  conversion_rate: number;
  recent_leads: number;
}> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    // Total leads
    const totalResult = await query(
      'SELECT COUNT(*) as total FROM email_leads WHERE created_at >= $1',
      [cutoffDate.toISOString()]
    );
    
    // Converted leads
    const convertedResult = await query(
      `SELECT COUNT(*) as converted 
       FROM email_leads 
       WHERE created_at >= $1 AND converted_to_paid = true`,
      [cutoffDate.toISOString()]
    );
    
    // Recent leads (last 7 days)
    const recentCutoff = new Date();
    recentCutoff.setDate(recentCutoff.getDate() - 7);
    
    const recentResult = await query(
      'SELECT COUNT(*) as recent FROM email_leads WHERE created_at >= $1',
      [recentCutoff.toISOString()]
    );
    
    const totalLeads = parseInt(totalResult.rows[0].total);
    const convertedLeads = parseInt(convertedResult.rows[0].converted);
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
    
    return {
      total_leads: totalLeads,
      converted_leads: convertedLeads,
      conversion_rate: Math.round(conversionRate * 100) / 100,
      recent_leads: parseInt(recentResult.rows[0].recent),
    };
  } catch (error) {
    throw new DatabaseError('Failed to get email lead statistics', error);
  }
}

/**
 * Check if email already exists in leads
 */
export async function emailLeadExists(email: string): Promise<boolean> {
  try {
    const result = await query(
      'SELECT 1 FROM email_leads WHERE email = $1 LIMIT 1',
      [email]
    );
    
    return result.rows.length > 0;
  } catch (error) {
    throw new DatabaseError('Failed to check if email lead exists', error);
  }
}

/**
 * Get leads that need follow-up
 */
export async function getLeadsForFollowUp(
  daysSinceCreation: number = 3,
  limit: number = 50
): Promise<EmailLead[]> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysSinceCreation);
    
    const result = await query(
      `SELECT el.*, sr.url, sr.overall_score 
       FROM email_leads el
       LEFT JOIN scan_results sr ON el.scan_id = sr.id
       WHERE el.converted_to_paid = false 
       AND el.created_at <= $1
       AND (el.last_contacted IS NULL OR el.last_contacted < el.created_at + INTERVAL '1 day')
       ORDER BY el.created_at ASC 
       LIMIT $2`,
      [cutoffDate.toISOString(), limit]
    );
    
    return result.rows;
  } catch (error) {
    throw new DatabaseError('Failed to get leads for follow-up', error);
  }
}

/**
 * Delete old unconverted leads (GDPR compliance)
 */
export async function deleteOldLeads(daysOld: number = 365): Promise<number> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const result = await query(
      `DELETE FROM email_leads 
       WHERE converted_to_paid = false 
       AND created_at < $1`,
      [cutoffDate.toISOString()]
    );
    
    return result.rowCount || 0;
  } catch (error) {
    throw new DatabaseError('Failed to delete old leads', error);
  }
} 