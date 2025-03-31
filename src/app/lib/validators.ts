export const validateRegistration = (data: {
    name: string;
    email: string;
    password: string;
  }): { valid: boolean; message?: string } => {
    // Required fields check
    if (!data.name?.trim()) return { valid: false, message: 'Name is required' };
    if (!data.email?.trim()) return { valid: false, message: 'Email is required' };
    if (!data.password) return { valid: false, message: 'Password is required' };
  
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { valid: false, message: 'Invalid email format' };
    }
  
    // Password strength
    if (data.password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters' };
    }
    if (!/[A-Z]/.test(data.password)) {
      return { valid: false, message: 'Password needs at least one uppercase letter' };
    }
    if (!/[0-9]/.test(data.password)) {
      return { valid: false, message: 'Password needs at least one number' };
    }
  
    return { valid: true };
  };
  
  // Additional validators can be added here
  export const validateLogin = (/* ... */) => { /* ... */ };