export const validators = {
  projectName: (input: string): boolean | string => {
    const trimmed = input.trim();
    if (trimmed.length === 0) {
      return 'Project name cannot be empty.';
    }
    // Allow alphanumeric characters, dashes, and underscores (safe folder names)
    const validPattern = /^[a-zA-Z0-9\-_]+$/;
    if (!validPattern.test(trimmed)) {
      return 'Project name can only contain alphanumeric characters, dashes, and underscores.';
    }
    return true;
  },
};
