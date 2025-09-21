import { cookies } from 'next/headers';

const AUTH_COOKIE_NAME = 'bigcapital_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export interface AuthData {
  token: string;
  tenantId?: string | number;
  organizationId?: string;
  email?: string;
  timestamp?: number;
}

export async function setAuthCookie(authData: AuthData): Promise<void> {
  // This can only be called in Server Actions or Route Handlers
  const cookieStore = await cookies();

  const dataWithTimestamp = {
    ...authData,
    timestamp: Date.now()
  };

  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(dataWithTimestamp), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/'
  });
}

export async function getAuthCookie(): Promise<AuthData | null> {
  try {
    // Reading cookies is allowed in Server Components
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

    if (!authCookie) {
      return null;
    }

    try {
      return JSON.parse(authCookie.value) as AuthData;
    } catch {
      return null;
    }
  } catch {
    // If we can't access cookies, return null
    return null;
  }
}

export async function clearAuthCookie(): Promise<void> {
  // This can only be called in Server Actions or Route Handlers
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}