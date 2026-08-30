export const saveToStorage = (key, value) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }
  return false;
};

export const loadFromStorage = (key, fallback) => {
  if (typeof window !== "undefined") {
    const item = localStorage.getItem(key);

    if (item) {
      try {
        return JSON.parse(item);
      } catch {
        return fallback;
      }
    }
  }

  return fallback;
};

export const removeFromStorage = (key) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
  return false;
};
