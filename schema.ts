import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, index, decimal, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User roles enum for staff dashboard access
export const userRoleEnum = pgEnum("user_role", ["super_user", "admin_managers", "admin_staff", "branch"]);
export const userStatusEnum = pgEnum("user_status", ["active", "inactive", "suspended"]);

// Enhanced user table for multi-level staff authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: userRoleEnum("role").default("branch").notNull(),
  status: userStatusEnum("status").default("active").notNull(),
  department: text("department"), // Sales, Admin, Support, etc.
  phone: text("phone"),
  session_data: jsonb("session_data"),
  lastLogin: timestamp("last_login"),
  loginAttempts: integer("login_attempts").default(0),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpiry: timestamp("password_reset_expiry"),
  createdBy: integer("created_by").references(() => users.id),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  permissions: jsonb("permissions"), // Specific permissions for fine-grained access
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    usernameIdx: index("username_idx").on(table.username),
    roleIdx: index("role_idx").on(table.role),
    userStatusIdx: index("user_status_idx").on(table.status),
    userEmailIdx: index("user_email_idx").on(table.email),
  };
});

// Password reset tokens table
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert and select schemas
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({ 
  id: true, 
  createdAt: true 
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;

// User activity logging for audit trail
export const userActivity = pgTable("user_activity", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  action: text("action").notNull(), // login, logout, view_client, update_payment, etc.
  resource: text("resource"), // client_id, payment_id, etc.
  details: jsonb("details"), // Additional context
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow(),
}, (table) => {
  return {
    userIdIdx: index("user_activity_user_id_idx").on(table.userId),
    actionIdx: index("user_activity_action_idx").on(table.action),
    timestampIdx: index("user_activity_timestamp_idx").on(table.timestamp),
  };
});

// User permissions mapping for granular access control
export const userPermissions = pgTable("user_permissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  permission: text("permission").notNull(), // view_clients, edit_payments, manage_users, etc.
  granted: boolean("granted").default(true),
  grantedBy: integer("granted_by").references(() => users.id),
  grantedAt: timestamp("granted_at").defaultNow(),
}, (table) => {
  return {
    userPermissionIdx: index("user_permission_idx").on(table.userId, table.permission),
  };
});

export const ticketStatusEnum = pgEnum("ticket_status", ["new", "in_progress", "resolved"]);
export const ticketPriorityEnum = pgEnum("ticket_priority", ["low", "medium", "high", "urgent"]);

// Define milestone types for the reward system
export const milestoneTypeEnum = pgEnum("milestone_type", ["payment_streak", "amount_paid", "goal_achieved", "debt_reduction"]);

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  ticketNumber: text("ticket_number").notNull().unique(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: ticketStatusEnum("status").notNull().default("new"),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  clientPhone: text("client_phone"),
  clientIdNumber: text("client_id_number"), // South African ID number
  category: text("category"),
  priority: ticketPriorityEnum("priority").default("medium"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  assignedToId: integer("assigned_to_id").references(() => users.id),
}, (table) => {
  return {
    ticketStatusIdx: index("ticket_status_idx").on(table.status),
    ticketPriorityIdx: index("ticket_priority_idx").on(table.priority),
    ticketClientEmailIdx: index("ticket_client_email_idx").on(table.clientEmail),
    ticketClientIdNumberIdx: index("ticket_client_id_number_idx").on(table.clientIdNumber),
    ticketCreatedAtIdx: index("ticket_created_at_idx").on(table.createdAt),
    ticketCategoryIdx: index("ticket_category_idx").on(table.category),
    ticketAssignedToIdIdx: index("ticket_assigned_to_id_idx").on(table.assignedToId),
  };
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").notNull().references(() => tickets.id),
  userId: integer("user_id").references(() => users.id),
  isClient: boolean("is_client").notNull().default(false),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
  return {
    ticketIdIdx: index("comments_ticket_id_idx").on(table.ticketId),
    userIdIdx: index("comments_user_id_idx").on(table.userId),
    createdAtIdx: index("comments_created_at_idx").on(table.createdAt),
  };
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").references(() => tickets.id),
  userId: integer("user_id").references(() => users.id),
  clientName: text("client_name"),
  action: text("action").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
  return {
    ticketIdIdx: index("activities_ticket_id_idx").on(table.ticketId),
    userIdIdx: index("activities_user_id_idx").on(table.userId),
    createdAtIdx: index("activities_created_at_idx").on(table.createdAt),
  };
});

// Staff user creation schema (for forms)
export const staffUserCreateSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  role: true,
});

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  ticketNumber: true,
  createdAt: true,
  updatedAt: true,
  assignedToId: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

// Staff User Types
export type StaffUser = typeof users.$inferSelect;
export type InsertStaffUser = z.infer<typeof staffUserCreateSchema>;

export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Ticket = typeof tickets.$inferSelect;

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;



// Extended schemas for form validation
export const ticketFormSchema = insertTicketSchema.extend({
  clientName: z.string().min(2, "Name must be at least 2 characters").nonempty("Name is required"),
  clientEmail: z.string().email("Invalid email address").nonempty("Email is required"),
  clientPhone: z.string().min(10, "Phone number must be at least 10 digits").nonempty("Phone number is required"),
  subject: z.string().min(5, "Subject must be at least 5 characters").nonempty("Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters").nonempty("Message is required"),
  category: z.string().min(1, "Please select a query category"),
  priority: z.enum(["low", "medium", "high", "urgent"], {
    errorMap: () => ({ message: "Priority is required" })
  }),
  clientIdNumber: z.string()
    .length(13, "South African ID number must be exactly 13 digits")
    .regex(/^[0-9]{13}$/, "ID number must contain only numbers")
    .refine((val) => val.trim().length === 13, "ID number must be 13 digits"),
  receiveNotifications: z.boolean().optional(),
});



// Service types table for the different services offered (1-7)
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  termsAndConditions: text("terms_and_conditions"),
  isActive: boolean("is_active").default(true),
  details: text("details"),
  price: text("price"),
  durationMonths: integer("duration_months"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    nameIdx: index("service_name_idx").on(table.name)
  };
});

// Client authentication table for secure login
export const clientAuth = pgTable("client_auth", {
  id: serial("id").primaryKey(),
  idNumber: text("id_number").notNull().unique(), // South African ID number as login
  password: text("password").notNull(), // Hashed password
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  cellphone: text("cellphone").notNull(),
  isVerified: boolean("is_verified").default(false),
  verificationToken: text("verification_token"),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpiry: timestamp("password_reset_expiry"),
  lastLogin: timestamp("last_login"),
  loginAttempts: integer("login_attempts").default(0),
  accountLocked: boolean("account_locked").default(false),
  lockUntil: timestamp("lock_until"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    clientIdNumberIdx: index("client_auth_id_number_idx").on(table.idNumber),
    clientEmailIdx: index("client_auth_email_idx").on(table.email),
  };
});

// Enhanced client table for Google Sheets integration
export const sheetClients = pgTable("sheet_clients", {
  id: serial("id").primaryKey(),
  idNumber: text("id_number").notNull().unique(), // South African ID number as primary identifier
  signupDate: timestamp("signup_date").defaultNow(), // Date the client signed up
  fullName: text("full_name").notNull(), // Client's full name
  cellphone: text("cellphone").notNull(), // Cellphone number
  email: text("email").notNull(), // Client's email address
  serviceType: integer("service_type"), // Service ID (1-7) - triggers welcome email with service link
  monthlyPayment: decimal("monthly_payment", { precision: 10, scale: 2 }), // Monthly payment amount
  term: integer("term"), // Term length (determines full amount based on service price)
  paymentDate: integer("payment_date"), // Day of month when payment is due (for reminders)
  month1Payment: decimal("month1_payment", { precision: 10, scale: 2 }), // Month 1 payment
  month2Payment: decimal("month2_payment", { precision: 10, scale: 2 }), // Month 2 payment
  month3Payment: decimal("month3_payment", { precision: 10, scale: 2 }), // Month 3 payment
  month4Payment: decimal("month4_payment", { precision: 10, scale: 2 }), // Month 4 payment
  month5Payment: decimal("month5_payment", { precision: 10, scale: 2 }), // Month 5 payment
  month6Payment: decimal("month6_payment", { precision: 10, scale: 2 }), // Month 6 payment
  month7Payment: decimal("month7_payment", { precision: 10, scale: 2 }), // Month 7 payment
  month8Payment: decimal("month8_payment", { precision: 10, scale: 2 }), // Month 8 payment
  month9Payment: decimal("month9_payment", { precision: 10, scale: 2 }), // Month 9 payment
  month10Payment: decimal("month10_payment", { precision: 10, scale: 2 }), // Month 10 payment
  totalPaid: decimal("total_paid", { precision: 10, scale: 2 }).default("0"), // Total amount paid so far
  remainingBalance: decimal("remaining_balance", { precision: 10, scale: 2 }).default("0"), // Remaining balance
  nextPaymentDate: timestamp("next_payment_date"), // Date of next payment
  lastReminderSent: timestamp("last_reminder_sent"), // When last reminder was sent
  paymentStatus: text("payment_status").default("pending"), // Current payment status
  completionStatus: text("completion_status"), // Progress towards completion
  notes: text("notes"), // Additional notes
  lastUpdated: timestamp("last_updated").defaultNow(),
  accessToken: text("access_token"), // For secure service page access
  tokenExpiry: timestamp("token_expiry"),
}, (table) => {
  return {
    sheetClientIdNumberIdx: index("sheet_client_id_number_idx").on(table.idNumber),
    emailIdx: index("client_email_idx").on(table.email),
    serviceTypeIdx: index("client_service_type_idx").on(table.serviceType),
    fullNameIdx: index("client_name_idx").on(table.fullName),
    paymentStatusIdx: index("client_payment_status_idx").on(table.paymentStatus)
  };
});

// Client-Service relationship table
export const clientServices = pgTable("client_services", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => sheetClients.id),
  serviceId: integer("service_id").notNull().references(() => services.id),
  dateAdded: timestamp("date_added").defaultNow(),
  status: text("status").default("active"),
  notes: text("notes")
}, (table) => {
  return {
    clientServiceIdx: index("client_service_idx").on(table.clientId, table.serviceId)
  };
});

// Google Sheets sync tracking
export const sheetSyncHistory = pgTable("sheet_sync_history", {
  id: serial("id").primaryKey(),
  spreadsheetId: text("spreadsheet_id").notNull(),
  sheetName: text("sheet_name").notNull(),
  rowsProcessed: integer("rows_processed").notNull(),
  rowsAdded: integer("rows_added"),
  rowsUpdated: integer("rows_updated"),
  syncStartTime: timestamp("sync_start_time").defaultNow(),
  syncEndTime: timestamp("sync_end_time"),
  success: boolean("success"),
  errorMessage: text("error_message"),
}, (table) => {
  return {
    sheetSyncIdx: index("sheet_sync_idx").on(table.spreadsheetId, table.sheetName)
  };
});

// Service access tokens for secure access to service details
export const serviceAccessTokens = pgTable("service_access_tokens", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => sheetClients.id),
  token: text("token").notNull().unique(),
  serviceId: integer("service_id").references(() => services.id),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  usedAt: timestamp("used_at")
}, (table) => {
  return {
    tokenIdx: index("token_idx").on(table.token),
    clientTokenIdx: index("client_token_idx").on(table.clientId)
  };
});

// Client queries without login (using ID number for tracking)
export const clientQueries = pgTable("client_queries", {
  id: serial("id").primaryKey(),
  referenceNumber: text("reference_number").notNull().unique(),
  idNumber: text("id_number").notNull(), // For client to track their query
  clientName: text("client_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").default("new").notNull(),
  category: text("category"),
  dateSubmitted: timestamp("date_submitted").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow(),
  assignedToId: integer("assigned_to_id").references(() => users.id),
}, (table) => {
  return {
    referenceIdx: index("query_reference_idx").on(table.referenceNumber),
    idNumberIdx: index("query_id_number_idx").on(table.idNumber),
    statusIdx: index("query_status_idx").on(table.status)
  };
});

// Query updates for tracking progress
export const queryUpdates = pgTable("query_updates", {
  id: serial("id").primaryKey(),
  queryId: integer("query_id").notNull().references(() => clientQueries.id),
  updateMessage: text("update_message").notNull(),
  status: text("status").notNull(),
  updatedBy: integer("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
  notificationSent: boolean("notification_sent").default(false),
  notificationSentAt: timestamp("notification_sent_at")
});

export type TicketFormData = z.infer<typeof ticketFormSchema>;

export const commentFormSchema = z.object({
  message: z.string().min(1, "Message is required"),
  ticketId: z.number(),
});

export type CommentFormData = z.infer<typeof commentFormSchema>;

// CRM Module - Payment Tracking (Optimized for high volume)
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "in_progress", "completed", "overdue", "defaulted", "cancelled"]);
export const serviceTypeEnum = pgEnum("service_type", ["debt_counseling", "debt_review", "credit_repair", "credit_report", "financial_planning", "legal_advice", "loan_consolidation", "other"]);
export const reminderStatusEnum = pgEnum("reminder_status", ["pending", "sent", "failed", "cancelled"]);
export const paymentMethodEnum = pgEnum("payment_method", ["debit_order", "eft", "cash", "credit_card", "other"]);
export const importSourceEnum = pgEnum("import_source", ["google_sheets", "manual", "bulk_import", "api", "migration"]);

// Service categories for different payment plans
export const serviceCategories = pgTable("service_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  serviceType: serviceTypeEnum("service_type").notNull(),
  defaultInstallments: integer("default_installments"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    nameIdx: index("svc_category_name_idx").on(table.name),
    typeIdx: index("svc_category_type_idx").on(table.serviceType),
  };
});

// Client table separate from payment plans for normalization
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  clientId: text("client_id").notNull().unique(), // Unique identifier (ED-12345)
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  idNumber: text("id_number"), // South African ID number
  address: text("address"),
  city: text("city"),
  postalCode: text("postal_code"),
  notes: text("notes"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    clientRefIdx: index("crm_client_id_idx").on(table.clientId),
    clientEmailIdx: index("crm_client_email_idx").on(table.email),
    clientNameIdx: index("crm_client_name_idx").on(table.name),
    clientIdNumberIdx: index("crm_client_id_number_idx").on(table.idNumber),
  };
});

// Enhanced payment plans table optimized for high volume
export const paymentPlans = pgTable("payment_plans", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id).notNull(), // Foreign key to clients table
  idNumber: text("id_number"), // South African ID number - direct on payment plan for easier lookups
  serviceType: integer("service_type").default(1), // Service type (1-7) for direct email template matching
  clientEmail: text("client_email"), // Direct client email for easier lookups
  clientName: text("client_name"), // Direct client name for easier display 
  serviceCategoryId: integer("service_category_id").references(() => serviceCategories.id),
  accountNumber: text("account_number").notNull(), // Account/reference number for this plan
  totalAmount: text("total_amount").notNull(), // Using text to handle currency formatting
  installmentAmount: text("installment_amount").notNull(),
  totalInstallments: integer("total_installments").notNull(),
  paidInstallments: integer("paid_installments").default(0),
  startDate: timestamp("start_date", { mode: "date" }),
  nextPaymentDate: timestamp("next_payment_date", { mode: "date" }),
  lastPaymentDate: timestamp("last_payment_date", { mode: "date" }),
  lastPaymentAmount: text("last_payment_amount"),
  paymentMethod: paymentMethodEnum("payment_method").default("debit_order"),
  paymentDay: integer("payment_day"), // Day of month payment is due (1-31)
  status: paymentStatusEnum("status").default("pending"),
  notes: text("notes"),
  importSource: importSourceEnum("import_source").default("manual"),
  externalReferenceId: text("external_reference_id"), // For tracking in external systems
  active: boolean("active").default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    planClientFkIdx: index("crm_payment_client_fk_idx").on(table.clientId),
    planIdNumberIdx: index("crm_payment_id_number_idx").on(table.idNumber), // New index for ID number lookups
    planClientEmailIdx: index("crm_payment_email_idx").on(table.clientEmail), // New index for email lookups
    planServiceTypeIdx: index("crm_payment_service_type_idx").on(table.serviceType), // New index for service type
    planAccountIdx: index("crm_payment_account_idx").on(table.accountNumber),
    planStatusIdx: index("crm_payment_status_idx").on(table.status),
    planNextPaymentIdx: index("crm_payment_next_date_idx").on(table.nextPaymentDate),
    planServiceIdx: index("crm_payment_service_idx").on(table.serviceCategoryId),
    planActiveStatusIdx: index("crm_payment_active_status_idx").on(table.active, table.status),
  };
});

// Individual payment transactions
export const paymentTransactions = pgTable("payment_transactions", {
  id: serial("id").primaryKey(),
  paymentPlanId: integer("payment_plan_id").references(() => paymentPlans.id).notNull(),
  amount: text("amount").notNull(),
  paymentDate: timestamp("payment_date").defaultNow(),
  paymentMethod: paymentMethodEnum("payment_method").default("debit_order"),
  reference: text("reference"),
  successful: boolean("successful").default(true),
  failureReason: text("failure_reason"),
  notes: text("notes"),
  processedBy: integer("processed_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    txPlanIdx: index("crm_transaction_plan_idx").on(table.paymentPlanId),
    txDateIdx: index("crm_transaction_date_idx").on(table.paymentDate),
    txSuccessIdx: index("crm_transaction_success_idx").on(table.successful),
  };
});

// Payment reminders
export const paymentReminders = pgTable("payment_reminders", {
  id: serial("id").primaryKey(),
  paymentPlanId: integer("payment_plan_id").references(() => paymentPlans.id).notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  reminderType: text("reminder_type").notNull(), // upcoming, overdue, final_notice, etc.
  daysOffset: integer("days_offset"), // Days before/after payment date
  status: reminderStatusEnum("status").default("pending"),
  emailContent: text("email_content"),
  smsContent: text("sms_content"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    reminderPlanIdx: index("crm_reminder_plan_idx").on(table.paymentPlanId),
    reminderDateIdx: index("crm_reminder_date_idx").on(table.scheduledDate),
    reminderStatusIdx: index("crm_reminder_status_idx").on(table.status),
    reminderTypeIdx: index("crm_reminder_type_idx").on(table.reminderType),
    reminderCompoundIdx: index("crm_reminder_compound_idx").on(table.status, table.scheduledDate),
  };
});

// Enhanced notification tracking
export const paymentNotifications = pgTable("payment_notifications", {
  id: serial("id").primaryKey(),
  paymentPlanId: integer("payment_plan_id").references(() => paymentPlans.id),
  reminderId: integer("reminder_id").references(() => paymentReminders.id),
  notificationType: text("notification_type").notNull(), // email, sms, etc.
  channel: text("channel").notNull(), // email, sms, etc.
  recipient: text("recipient").notNull(), // email or phone
  subject: text("subject"),
  messageContent: text("message_content").notNull(),
  sentAt: timestamp("sent_at").defaultNow(),
  status: text("status").default("sent"), // sent, delivered, failed, bounced
  errorDetails: text("error_details"),
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    notifPlanIdx: index("crm_notif_plan_idx").on(table.paymentPlanId),
    notifReminderIdx: index("crm_notif_reminder_idx").on(table.reminderId),
    notifTypeIdx: index("crm_notif_type_idx").on(table.notificationType),
    notifSentAtIdx: index("crm_notif_sent_at_idx").on(table.sentAt),
    notifStatusIdx: index("crm_notif_status_idx").on(table.status),
  };
});

// Configuration and settings for Google Sheets integration
export const spreadsheetConfigs = pgTable("spreadsheet_configs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  spreadsheetId: text("spreadsheet_id").notNull(),
  sheetName: text("sheet_name").notNull(),
  columnMappings: text("column_mappings").notNull(), // JSON string of mappings
  serviceCategory: integer("service_category_id").references(() => serviceCategories.id),
  autoImport: boolean("auto_import").default(false),
  importFrequency: text("import_frequency").default("daily"), // daily, weekly, manual
  lastImportedAt: timestamp("last_imported_at"),
  lastImportCount: integer("last_import_count").default(0),
  webAppUrl: text("web_app_url"), // For simpler Google Apps Script integration
  webAppApiKey: text("web_app_api_key"),
  active: boolean("active").default(true),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    configNameIdx: index("crm_config_name_idx").on(table.name),
    configSheetIdx: index("crm_config_sheet_idx").on(table.spreadsheetId, table.sheetName),
    configActiveIdx: index("crm_config_active_idx").on(table.active),
  };
});

// Insert schemas for CRM module with high volume optimization
export const insertServiceCategorySchema = createInsertSchema(serviceCategories).omit({
  id: true,
  createdAt: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentPlanSchema = createInsertSchema(paymentPlans).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
  active: true,
});

export const insertPaymentTransactionSchema = createInsertSchema(paymentTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentReminderSchema = createInsertSchema(paymentReminders).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentNotificationSchema = createInsertSchema(paymentNotifications).omit({
  id: true,
  sentAt: true,
  createdAt: true,
});

export const insertSpreadsheetConfigSchema = createInsertSchema(spreadsheetConfigs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastImportedAt: true,
});

// Types for CRM module
export type InsertServiceCategory = z.infer<typeof insertServiceCategorySchema>;
export type ServiceCategory = typeof serviceCategories.$inferSelect;

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

export type InsertPaymentPlan = z.infer<typeof insertPaymentPlanSchema>;
export type PaymentPlan = typeof paymentPlans.$inferSelect;

export type InsertPaymentTransaction = z.infer<typeof insertPaymentTransactionSchema>;
export type PaymentTransaction = typeof paymentTransactions.$inferSelect;

export type InsertPaymentReminder = z.infer<typeof insertPaymentReminderSchema>;
export type PaymentReminder = typeof paymentReminders.$inferSelect;

export type InsertPaymentNotification = z.infer<typeof insertPaymentNotificationSchema>;
export type PaymentNotification = typeof paymentNotifications.$inferSelect;

export type InsertSpreadsheetConfig = z.infer<typeof insertSpreadsheetConfigSchema>;
export type SpreadsheetConfig = typeof spreadsheetConfigs.$inferSelect;

// Form validation schemas
export const clientFormSchema = insertClientSchema.extend({
  clientId: z.string().min(1, "Client ID is required")
    .regex(/^ED-\d{5,}$/, "Client ID must be in format ED-xxxxx (with at least 5 digits)"),
  email: z.string().email("Valid email address is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
});

export const paymentPlanFormSchema = insertPaymentPlanSchema.extend({
  totalAmount: z.string().min(1, "Total amount is required"),
  installmentAmount: z.string().min(1, "Installment amount is required"),
  startDate: z.date({
    required_error: "Start date is required",
    invalid_type_error: "Start date must be a valid date",
  }),
  nextPaymentDate: z.date({
    required_error: "Next payment date is required",
    invalid_type_error: "Next payment date must be a valid date",
  }),
});

export const spreadsheetConfigFormSchema = insertSpreadsheetConfigSchema.extend({
  name: z.string().min(3, "Configuration name must be at least 3 characters"),
  columnMappings: z.string().refine(
    (val) => {
      try {
        const parsed = JSON.parse(val);
        return typeof parsed === 'object' && parsed !== null;
      } catch {
        return false;
      }
    }, 
    { message: "Column mappings must be a valid JSON object" }
  ),
  webAppUrl: z.string().url("Web App URL must be a valid URL").optional(),
  webAppApiKey: z.string().min(5, "API key must be at least 5 characters").optional(),
});

export const batchProcessFormSchema = z.object({
  serviceCategory: z.number().optional(),
  status: z.string().optional(),
  paymentDateFrom: z.date().optional(),
  paymentDateTo: z.date().optional(),
  batchSize: z.number().min(10).max(500).default(100),
  sendNotifications: z.boolean().default(true),
});

// Financial Goal Tracking
export const goalCategoryEnum = pgEnum("goal_category", ["emergency_fund", "debt_payoff", "savings", "retirement", "education", "home", "vehicle", "travel", "other"]);

// Financial Goals
export const financialGoals = pgTable("financial_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: goalCategoryEnum("category").default("other"),
  targetAmount: text("target_amount").notNull(),
  currentAmount: text("current_amount").default("0").notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  targetDate: timestamp("target_date"),
  isCompleted: boolean("is_completed").default(false),
  isArchived: boolean("is_archived").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index("goal_user_id_idx").on(table.userId),
    categoryIdx: index("goal_category_idx").on(table.category),
    statusIdx: index("goal_status_idx").on(table.isCompleted, table.isArchived),
  };
});

// Goal Transactions (deposits & withdrawals)
export const goalTransactions = pgTable("goal_transactions", {
  id: serial("id").primaryKey(),
  goalId: integer("goal_id").references(() => financialGoals.id, { onDelete: "cascade" }).notNull(),
  amount: text("amount").notNull(),
  isDeposit: boolean("is_deposit").default(true),
  date: timestamp("date").defaultNow().notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    goalIdIdx: index("goal_transaction_goal_id_idx").on(table.goalId),
    dateIdx: index("goal_transaction_date_idx").on(table.date),
  };
});

// Insert schemas for Financial Goals
export const insertFinancialGoalSchema = createInsertSchema(financialGoals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isCompleted: true,
  isArchived: true,
  currentAmount: true,
});

export const insertGoalTransactionSchema = createInsertSchema(goalTransactions).omit({
  id: true,
  createdAt: true,
});

// Types for Financial Goals
export type InsertFinancialGoal = z.infer<typeof insertFinancialGoalSchema>;
export type FinancialGoal = typeof financialGoals.$inferSelect;

export type InsertGoalTransaction = z.infer<typeof insertGoalTransactionSchema>;
export type GoalTransaction = typeof goalTransactions.$inferSelect;

// Form validation schemas
export const financialGoalFormSchema = insertFinancialGoalSchema.extend({
  name: z.string().min(3, "Goal name must be at least 3 characters"),
  targetAmount: z.string().min(1, "Target amount is required"),
  targetDate: z.date().min(new Date(), "Target date must be in the future").optional(),
});

export const goalTransactionFormSchema = insertGoalTransactionSchema.extend({
  amount: z.string().min(1, "Amount is required"),
  isDeposit: z.boolean().default(true),
  date: z.date().default(() => new Date()),
});

// Mandate schema
export const mandates = pgTable("mandates", {
  id: serial("id").primaryKey(),
  clientId: text("client_id"),
  idNumber: text("id_number").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  serviceType: text("service_type").notNull(),
  serviceNumber: text("service_number"), // S1-S7 identifier
  totalAmount: text("total_amount").notNull(),
  signature: text("signature").notNull(),
  status: text("status").default("active").notNull(),
  confirmationToken: text("confirmation_token"),
  emailSent: boolean("email_sent").default(false),
  emailOpened: boolean("email_opened").default(false),
  emailOpenedAt: timestamp("email_opened_at"),
  confirmedAt: timestamp("confirmed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertMandateSchema = createInsertSchema(mandates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export type InsertMandate = z.infer<typeof insertMandateSchema>;
export type Mandate = typeof mandates.$inferSelect;

// Client Mandate form schema
export const mandateFormSchema = insertMandateSchema.extend({
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions'
  }),
  serviceNumber: z.string()
    .regex(/^S[1-7]$/, { message: 'Service number must be in format S1-S7' })
    .optional()
    .describe('Service number (S1-S7)') 
});

export type MandateFormData = z.infer<typeof mandateFormSchema>;

// Form data types
// Milestone and reward system tables
export const milestones = pgTable("milestones", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: milestoneTypeEnum("type").notNull(),
  threshold: decimal("threshold", { precision: 10, scale: 2 }).notNull(), // Value to reach for milestone
  rewardPoints: integer("reward_points").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  iconName: text("icon_name"), // Icon to represent the milestone
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
  return {
    typeIdx: index("milestone_type_idx").on(table.type),
  };
});

// User achieved milestones
export const userMilestones = pgTable("user_milestones", {
  id: serial("id").primaryKey(),
  clientIdNumber: text("client_id_number").notNull(), // Link to client by ID number
  milestoneId: integer("milestone_id").notNull().references(() => milestones.id),
  achievedAt: timestamp("achieved_at").notNull().defaultNow(),
  pointsAwarded: integer("points_awarded").notNull(),
  isRedeemed: boolean("is_redeemed").notNull().default(false),
  redeemedAt: timestamp("redeemed_at"),
}, (table) => {
  return {
    clientIdIdx: index("user_milestone_client_id_idx").on(table.clientIdNumber),
    milestoneIdx: index("user_milestone_milestone_id_idx").on(table.milestoneId),
  };
});

// Rewards catalog that users can redeem points for
export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  pointsCost: integer("points_cost").notNull(),
  category: text("category").notNull(), // Discount, Service, etc.
  isActive: boolean("is_active").notNull().default(true),
  iconName: text("icon_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Record of redeemed rewards
export const userRewards = pgTable("user_rewards", {
  id: serial("id").primaryKey(),
  clientIdNumber: text("client_id_number").notNull(), // Link to client by ID number
  rewardId: integer("reward_id").notNull().references(() => rewards.id),
  pointsSpent: integer("points_spent").notNull(),
  redeemedAt: timestamp("redeemed_at").notNull().defaultNow(),
  status: text("status").notNull().default("pending"), // pending, approved, delivered, expired
  redemptionCode: text("redemption_code"), // Generated code for claiming reward
  expiresAt: timestamp("expires_at"), // When the reward expires if applicable
}, (table) => {
  return {
    clientIdIdx: index("user_reward_client_id_idx").on(table.clientIdNumber),
    rewardIdx: index("user_reward_reward_id_idx").on(table.rewardId),
  };
});

// Insert schemas for milestone and reward system
export const insertMilestoneSchema = createInsertSchema(milestones).omit({
  id: true,
  createdAt: true,
});

export const insertUserMilestoneSchema = createInsertSchema(userMilestones).omit({
  id: true,
  achievedAt: true,
  redeemedAt: true,
});

export const insertRewardSchema = createInsertSchema(rewards).omit({
  id: true,
  createdAt: true,
});

export const insertUserRewardSchema = createInsertSchema(userRewards).omit({
  id: true,
  redeemedAt: true,
});

// Types for milestone and reward system
export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;
export type Milestone = typeof milestones.$inferSelect;

export type InsertUserMilestone = z.infer<typeof insertUserMilestoneSchema>;
export type UserMilestone = typeof userMilestones.$inferSelect;

export type InsertReward = z.infer<typeof insertRewardSchema>;
export type Reward = typeof rewards.$inferSelect;

export type InsertUserReward = z.infer<typeof insertUserRewardSchema>;
export type UserReward = typeof userRewards.$inferSelect;

// Form schemas for milestone and reward system
export const milestoneFormSchema = insertMilestoneSchema.extend({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  threshold: z.string().min(1, "Threshold is required"),
  rewardPoints: z.number().min(1, "Reward points must be at least 1"),
});

export const rewardFormSchema = insertRewardSchema.extend({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  pointsCost: z.number().min(1, "Points cost must be at least 1"),
  category: z.string().min(3, "Category is required"),
});

// Form data types for milestone and reward system
export type MilestoneFormData = z.infer<typeof milestoneFormSchema>;
export type RewardFormData = z.infer<typeof rewardFormSchema>;

export type ClientFormData = z.infer<typeof clientFormSchema>;
export type PaymentPlanFormData = z.infer<typeof paymentPlanFormSchema>;
export type SpreadsheetConfigFormData = z.infer<typeof spreadsheetConfigFormSchema>;
export type BatchProcessFormData = z.infer<typeof batchProcessFormSchema>;
export type FinancialGoalFormData = z.infer<typeof financialGoalFormSchema>;
export type GoalTransactionFormData = z.infer<typeof goalTransactionFormSchema>;

// Client authentication schemas and types (defined after table definitions to avoid initialization errors)
export const insertClientAuthSchema = createInsertSchema(clientAuth).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
  loginAttempts: true,
  accountLocked: true,
  lockUntil: true,
});

export const clientRegistrationSchema = insertClientAuthSchema.extend({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string(),
  idNumber: z.string()
    .length(13, "South African ID number must be exactly 13 digits")
    .regex(/^[0-9]{13}$/, "ID number must contain only numbers"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  cellphone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\d\s\+\-\(\)]+$/, "Invalid phone number format"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const clientLoginSchema = z.object({
  idNumber: z.string()
    .length(13, "South African ID number must be exactly 13 digits")
    .regex(/^[0-9]{13}$/, "ID number must contain only numbers"),
  password: z.string().min(1, "Password is required"),
});

// Client authentication types
export type ClientAuth = typeof clientAuth.$inferSelect;
export type InsertClientAuth = z.infer<typeof insertClientAuthSchema>;
export type ClientRegistration = z.infer<typeof clientRegistrationSchema>;
export type ClientLogin = z.infer<typeof clientLoginSchema>;
