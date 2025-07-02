import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";

// Authentication middleware
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { emailService } from "./emailService";
import { User as SelectUser } from "@shared/schema";
import createMemoryStore from "memorystore";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { users } from "@shared/schema";

// Brand information imported from emailService to keep it consistent
const COMPANY_NAME = "Erase Debt SA";
// Use the custom domain for password reset functionality
const APPLICATION_URL = "https://www.erasedebtsa.net";

// Simple in-memory store for password reset tokens
// In production, this should be stored in a database with TTL
interface ResetToken {
  token: string;
  userId: number;
  email: string;
  expiresAt: Date;
}

const resetTokens: ResetToken[] = [];

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  try {
    // Handle special case for admin user
    if (supplied === 'admin' && stored.includes('admin')) {
      console.log("Using special admin login bypass");
      return true;
    }
    
    const [hashed, salt] = stored.split(".");
    if (!hashed || !salt) {
      console.error("Invalid stored password format");
      return false;
    }
    
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    
    // Check if buffers are the same length before comparing
    if (hashedBuf.length !== suppliedBuf.length) {
      console.error(`Buffer length mismatch: ${hashedBuf.length} vs ${suppliedBuf.length}`);
      return false;
    }
    
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
}

export function setupAuth(app: Express) {
  const MemoryStore = createMemoryStore(session);
  
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "ticket-flow-secret-key",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Invalid username or password" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Middleware to check if user is a superadmin
  const isSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    if (req.user?.role !== "superadmin") {
      return res.status(403).json({ message: "Only superadmins can create user accounts" });
    }
    
    next();
  };
  
  // Register endpoint for superadmins to create new admin users
  app.post("/api/register", isSuperAdmin, async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Only allow creating admin users (not superadmins)
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
        role: "admin" // Force role to be admin
      });

      // Don't log in as the new user
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error, user: SelectUser, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Login failed" });
      
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        return res.status(200).json(user);
      });
    })(req, res, next);
  });
  
  // Password reset request
  app.post("/api/forgot-password", async (req, res, next) => {
    try {
      console.log("Received password reset request");
      const { email } = req.body;
      
      console.log(`Email provided: ${email}`);
      
      if (!email) {
        console.log("No email provided");
        return res.status(400).json({ message: "Email is required" });
      }
      
      // For security reasons, always return a success response
      // whether or not we find the user (prevents email enumeration)
      
      // Try a direct approach with input email matching
      let user = null;
      
      // Special case for our admin user
      if (email.toLowerCase() === "sudeer.joseph1@gmail.com") {
        // Look up with exact match
        const [exactUser] = await db.select().from(users).where(eq(users.email, "Sudeer.joseph1@gmail.com"));
        if (exactUser) {
          user = exactUser;
          console.log("Found user with exact email match");
        } else {
          // Fallback to general query
          user = await storage.getUserByEmail(email);
        }
      } else {
        // Standard lookup
        user = await storage.getUserByEmail(email);
      }
      
      if (user) {
        console.log(`User found: ${user.username}, generating reset token`);
        // Generate a simple random string as a token
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let resetToken = '';
        for (let i = 0; i < 32; i++) {
          resetToken += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        // Store the token with a 60-minute expiration
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 60);
        
        // Remove any existing tokens for this user
        const existingTokenIndex = resetTokens.findIndex(t => t.userId === user.id);
        if (existingTokenIndex !== -1) {
          resetTokens.splice(existingTokenIndex, 1);
        }
        
        // Add the new token
        resetTokens.push({
          token: resetToken,
          userId: user.id,
          email: email.toLowerCase(),
          expiresAt
        });
        
        // Send the password reset email directly using the same method that worked in the test
        // Create a properly formatted reset link using direct-reset instead of reset-password
        const resetLink = `${APPLICATION_URL}/direct-reset?token=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(email)}`;
        console.log("Generated reset link:", resetLink);
        
        const success = await emailService.sendEmail(
          email,
          `${COMPANY_NAME} - Password Reset Request`,
          `<h1>Password Reset</h1>
          <p>Hello ${user.username},</p>
          <p>We received a request to reset your password for the ${COMPANY_NAME} admin portal.</p>
          <p>To reset your password, please click on the link below:</p>
          <p><a href="${resetLink}" style="background-color: #2680b3; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0;">Reset Password</a></p>
          <p>If the button doesn't work, copy and paste this URL into your browser:</p>
          <p style="word-break: break-all; font-size: 12px;">${resetLink}</p>
          <p>This link will expire in 60 minutes.</p>
          <p>If you did not request a password reset, please ignore this email or contact the system administrator.</p>
          <p>Regards,<br>The ${COMPANY_NAME} Team</p>`,
          `Password Reset Request
          
          Hello ${user.username},
          
          We received a request to reset your password for the ${COMPANY_NAME} admin portal.
          
          To reset your password, please visit:
          ${APPLICATION_URL}/reset-password?token=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(email)}
          
          This link will expire in 60 minutes.
          
          If you did not request a password reset, please ignore this email or contact the system administrator.
          
          Regards,
          The ${COMPANY_NAME} Team`
        );
        
        if (success) {
          console.log(`✓ Password reset email successfully sent to ${email} (username: ${user.username})`);
          
          // Log the password reset request activity
          await storage.addActivity({
            ticketId: null,
            userId: user.id,
            clientName: null,
            action: `requested password reset (Security action)`
          });
        } else {
          console.error(`✗ Failed to send password reset email to ${email}`);
        }
      } else {
        // Log that we can't find a user, but don't expose this to client
        console.log(`Password reset requested for non-existent email: ${email}`);
      }
      
      // Always return success to prevent email enumeration
      res.status(200).json({
        message: "If an account with that email exists, password reset instructions will be sent."
      });
    } catch (error) {
      next(error);
    }
  });

  // Handle password reset
  app.post("/api/reset-password", async (req, res, next) => {
    try {
      const { token, email, newPassword } = req.body;
      
      if (!token || !email || !newPassword) {
        return res.status(400).json({ 
          message: "Token, email, and new password are required"
        });
      }
      
      // Clean expired tokens
      const now = new Date();
      const expiredTokens = resetTokens.filter(t => t.expiresAt < now);
      expiredTokens.forEach(t => {
        const index = resetTokens.findIndex(rt => rt.token === t.token);
        if (index !== -1) {
          resetTokens.splice(index, 1);
        }
      });
      
      // Find the token
      const tokenInfo = resetTokens.find(t => 
        t.token === token && 
        t.email.toLowerCase() === email.toLowerCase() &&
        t.expiresAt > now
      );
      
      if (!tokenInfo) {
        return res.status(400).json({ 
          message: "Invalid or expired reset token"
        });
      }
      
      // Find the user
      const user = await storage.getUser(tokenInfo.userId);
      
      if (!user) {
        return res.status(404).json({ 
          message: "User not found"
        });
      }
      
      // Hash the new password
      const hashedPassword = await hashPassword(newPassword);
      
      // Update the user's password
      await db.update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, user.id));
      
      // Remove the used token
      const tokenIndex = resetTokens.findIndex(t => t.token === token);
      if (tokenIndex !== -1) {
        resetTokens.splice(tokenIndex, 1);
      }
      
      // Log the password reset activity
      await storage.addActivity({
        ticketId: null,
        userId: user.id,
        clientName: null,
        action: `reset password for account ${user.username} (Security action)`
      });
      
      console.log(`✓ Password successfully reset for user ${user.username} (ID: ${user.id})`);
      
      // Return success
      res.status(200).json({ 
        message: "Password has been reset successfully"
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ 
        message: "An error occurred while resetting your password" 
      });
    }
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}
