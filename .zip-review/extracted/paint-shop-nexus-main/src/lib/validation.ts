import { z } from 'zod';

// Authentication schemas
export const authSchemas = {
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-\.]+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes'),
  
  companyName: z
    .string()
    .trim()
    .max(100, 'Company name must be less than 100 characters')
    .optional()
};

// Sign in validation schema
export const signInSchema = z.object({
  email: authSchemas.email,
  password: z.string().min(1, 'Password is required'), // Less strict for sign in
});

// Sign up validation schema
export const signUpSchema = z.object({
  email: authSchemas.email,
  password: authSchemas.password,
  fullName: authSchemas.fullName,
  companyName: authSchemas.companyName,
});

// Profile validation schema
export const profileSchema = z.object({
  fullName: authSchemas.fullName,
  companyName: authSchemas.companyName,
});

// Product validation schemas
export const productSchemas = {
  name: z
    .string()
    .trim()
    .min(1, 'Product name is required')
    .max(200, 'Product name must be less than 200 characters'),
  
  hsnCode: z
    .string()
    .trim()
    .regex(/^\d{4,8}$/, 'HSN code must be 4-8 digits')
    .optional()
    .or(z.literal('')),
  
  price: z
    .number()
    .positive('Price must be positive')
    .max(999999.99, 'Price must be less than ₹10,00,000'),
  
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .min(0, 'Quantity cannot be negative')
    .max(999999, 'Quantity must be less than 10,00,000'),
  
  unit: z
    .string()
    .trim()
    .min(1, 'Unit is required')
    .max(20, 'Unit must be less than 20 characters'),
};

// Vendor/Customer validation schemas  
export const vendorCustomerSchemas = {
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  
  contactPerson: z
    .string()
    .trim()
    .max(100, 'Contact person name must be less than 100 characters')
    .optional(),
  
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters')
    .optional()
    .or(z.literal('')),
  
  phone: z
    .string()
    .trim()
    .regex(/^[\+]?[\d\s\-\(\)]{10,15}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  
  address: z
    .string()
    .trim()
    .max(500, 'Address must be less than 500 characters')
    .optional(),
  
  gstNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please enter a valid GST number')
    .optional()
    .or(z.literal('')),
};

// Financial validation schemas
export const financialSchemas = {
  amount: z
    .number()
    .positive('Amount must be positive')
    .max(99999999.99, 'Amount must be less than ₹10 crores'),
  
  percentage: z
    .number()
    .min(0, 'Percentage cannot be negative')
    .max(100, 'Percentage cannot exceed 100'),
  
  invoiceNumber: z
    .string()
    .trim()
    .min(1, 'Invoice number is required')
    .max(50, 'Invoice number must be less than 50 characters'),
};

// Generic validation utilities
export const validateInput = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; error?: string } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Validation failed' };
  }
};

// Sanitization utilities
export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, ''); // Remove potential HTML tags
};

export const sanitizeNumber = (input: number): number => {
  if (isNaN(input) || !isFinite(input)) {
    throw new Error('Invalid number');
  }
  return input;
};