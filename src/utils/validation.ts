export const validateName = (name: string): string | null => {
  if (name.length < 20) return 'Name must be at least 20 characters long';
  if (name.length > 60) return 'Name must not exceed 60 characters';
  return null;
};

export const validateAddress = (address: string): string | null => {
  if (address.length > 400) return 'Address must not exceed 400 characters';
  if (address.length < 10) return 'Address must be at least 10 characters long';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 8 || password.length > 16) {
    return 'Password must be between 8-16 characters';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must include at least one uppercase letter';
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Password must include at least one special character';
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};