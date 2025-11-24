

export const validateUsername = (username: string): string | null => {
  if (!username || !username.trim()) return "Username is required";
  const v = username.trim();
  if (v.length < 3) return "Username must be at least 3 characters";
  if (/\s/.test(v)) return "Username cannot contain spaces";
  return null;
};

export const validatePin = (pin: string): string | null => {
  if (!pin) return "PIN is required";
  if (!/^\d+$/.test(pin)) return "PIN must contain only digits";
  if (pin.length < 4) return "PIN must be at least 4 digits";
  // you can add a max length check if you want
  return null;
};

export const validateTitle = (title: string): string | null => {
  if (!title || !title.trim()) return "Title cannot be empty";
  if (title.trim().length > 120) return "Title is too long (max 120 characters)";
  return null;
};

export const validateNoteBody = (body: string): string | null => {
  if (!body || !body.trim()) return "Note body cannot be empty";
  // optional: length checks
  return null;
};
