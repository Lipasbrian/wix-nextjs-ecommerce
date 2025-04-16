interface ValidationResult {
  valid: boolean;
  message?: string;
}

interface RegistrationData {
  name: string;
  email: string;
  password: string;
}

export const validateRegistration = (data: RegistrationData): ValidationResult => {
  // Required fields check with improved null checking
  if (!data?.name?.trim()) return { valid: false, message: 'Name is required' };
  if (!data?.email?.trim()) return { valid: false, message: 'Email is required' };
  if (!data?.password) return { valid: false, message: 'Password is required' };

  // Email validation with more comprehensive regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, message: 'Invalid email format' };
  }

  // Password validation with combined regex
  const passwordChecks = {
    length: data.password.length >= 8,
    uppercase: /[A-Z]/.test(data.password),
    number: /[0-9]/.test(data.password),
    special: /[!@#$%^&*]/.test(data.password)
  };

  if (!passwordChecks.length) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (!passwordChecks.uppercase) {
    return { valid: false, message: 'Password needs at least one uppercase letter' };
  }
  if (!passwordChecks.number) {
    return { valid: false, message: 'Password needs at least one number' };
  }
  if (!passwordChecks.special) {
    return { valid: false, message: 'Password needs at least one special character' };
  }

  return { valid: true };
};

export function validateLogin(data: { email: string; password: string }): ValidationResult {
  if (!data.email || !data.password) {
    return { valid: false, message: "Email and password are required" };
  }

  if (!data.email.includes('@')) {
    return { valid: false, message: "Invalid email format" };
  }

  if (data.password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters" };
  }

  return { valid: true };
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email?.trim()) return { valid: false, message: 'Email is required' };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Invalid email format' };
  }

  return { valid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password)
  };

  if (!checks.length) return { valid: false, message: 'Password must be at least 8 characters' };
  if (!checks.uppercase) return { valid: false, message: 'Password needs at least one uppercase letter' };
  if (!checks.number) return { valid: false, message: 'Password needs at least one number' };
  if (!checks.special) return { valid: false, message: 'Password needs at least one special character' };

  return { valid: true };
};