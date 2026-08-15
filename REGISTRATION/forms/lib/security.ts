import crypto from 'crypto';
import { cookies } from 'next/headers';
import { prisma } from './db';

function getAuthSecret(): string {
  return process.env.ADMIN_JWT_SECRET || 'aarambham_2026_production_secret_fallback_key';
}

export function createAdminToken(): string | null {
  const secret = getAuthSecret();
  if (!secret) return null;

  const timestamp = Date.now();
  const payload = `admin:${timestamp}`;
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${hmac}`;
}

export function verifyAdminToken(token: string | undefined | null): boolean {
  if (!token || typeof token !== 'string') return false;

  const secret = getAuthSecret();
  if (!secret) return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payload, hmac] = parts;
  const [role, timestampStr] = payload.split(':');

  if (role !== 'admin' || !timestampStr) return false;

  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Expire after 24 hours
  const maxAgeMs = 24 * 60 * 60 * 1000;
  if (Date.now() - timestamp > maxAgeMs) return false;

  const expectedHmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');

  return timingSafeCompare(hmac, expectedHmac);
}

export async function isRequestAuthorized(req?: Request): Promise<boolean> {
  try {
    if (req && typeof req.headers?.get === 'function') {
      const authHeader = req.headers.get('authorization') || req.headers.get('x-admin-token');
      if (authHeader) {
        const token = authHeader.replace(/^Bearer\s+/i, '').trim();
        if (verifyAdminToken(token)) return true;
      }
    }
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value || cookieStore.get('aarambham_admin_session')?.value;
    return verifyAdminToken(token);
  } catch {
    return false;
  }
}

export function timingSafeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export function sanitizeInput(str: string | undefined | null): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// Rate limiters
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const loginLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string, maxRequests = 10, windowMs = 15 * 60 * 1000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: maxRequests - record.count };
}

export function checkLoginRateLimit(ip: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = loginLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    loginLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (record.count >= maxAttempts) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: maxAttempts - record.count };
}

// Persistent Database Audit Logs
export async function addAuditLog(
  action: string,
  description: string,
  details?: any,
  actor: string = 'admin',
  targetId?: string
) {
  try {
    const detailsStr = details ? (typeof details === 'string' ? details : JSON.stringify(details)) : null;
    return await prisma.auditLog.create({
      data: {
        action,
        actor,
        targetId: targetId || null,
        description,
        details: detailsStr
      }
    });
  } catch (err) {
    console.error('Failed to create AuditLog in PostgreSQL:', err);
    return null;
  }
}

export async function getAuditLogs(limit = 50) {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit
    });
    return logs.map((l) => ({
      id: l.id,
      timestamp: l.createdAt.toISOString(),
      action: l.action,
      actor: l.actor,
      targetId: l.targetId,
      description: l.description,
      details: l.details ? JSON.parse(l.details) : null
    }));
  } catch (err) {
    console.error('Failed to query AuditLogs from PostgreSQL:', err);
    return [];
  }
}
