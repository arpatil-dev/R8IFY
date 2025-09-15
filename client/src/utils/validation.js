export function validateForm(data) {
  const errors = [];

  // ✅ Name validation (20–60 characters)
  if (data.name !== undefined) {
    if (data.name.length < 20 || data.name.length > 60) {
      errors.push("Name must be between 20 and 60 characters.");
    }
  }

  // ✅ Email validation (only if provided)
  if (data.email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push("Please enter a valid email address.");
    }
  }

  // ✅ Address validation (only if provided)
  if (data.address !== undefined) {
    if (data.address.length > 400) {
      errors.push("Address must not exceed 400 characters.");
    }
  }

  // ✅ Password validation (only if provided)
  if (data.password !== undefined) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
    if (!passwordRegex.test(data.password)) {
      errors.push("Password must be 8–16 characters long, contain at least 1 uppercase and 1 special character.");
    }
  }

  // ✅ Show errors in alert
  if (errors.length > 0) {
    alert(errors.join("\n"));
    return false; // ❌ prevent form submit
  }

  return true; // ✅ valid, allow submit
}
