import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MIN_PASSWORD_LENGTH } from '@/constants/constants';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(MIN_PASSWORD_LENGTH),
});

export type UserCredentials = z.infer<typeof userSchema>;

// Mock user database
const users = new Map<
  string,
  { email: string; password: string; id: string }
>();

export async function register(credentials: UserCredentials) {
  const { email, password } = userSchema.parse(credentials);

  if (users.has(email)) {
    throw new Error('User already exists');
  }

  const SALT_LENGTH = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_LENGTH);

  // eslint-disable-next-line
  const id = Math.random().toString(36).substring(2, 11);

  users.set(email, {
    email,
    password: hashedPassword,
    id,
  });

  const token = jwt.sign({ email, id }, JWT_SECRET, { expiresIn: '24h' });

  return {
    token,
    user: {
      id,
      email,
      balance: 100000, // Starting balance of $100,000
      portfolio: {},
    },
  };
}

export async function login(credentials: UserCredentials) {
  const { email, password } = userSchema.parse(credentials);

  const user = users.get(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ email, id: user.id }, JWT_SECRET, {
    expiresIn: '24h',
  });

  return {
    token,
    user: {
      id: user.id,
      email,
      balance: 100000, // In a real app, this would come from the database
      portfolio: {},
    },
  };
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { email: string; id: string };
  } catch {
    throw new Error('Invalid token');
  }
}

// Next auth options
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
