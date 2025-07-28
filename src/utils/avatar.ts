/**
 * Generates a placeholder avatar for users registering with local credentials
 */
export function generatePlaceholderAvatar(
  name: string | null,
  email: string | null,
): string {
  if (name?.trim()) {
    const initials = name
      .trim()
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=ef4444&color=ffffff&size=128&font-size=0.5&bold=true&format=png`;
  }

  const initial = email?.[0]?.toUpperCase() ?? "U";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initial)}&background=ef4444&color=ffffff&size=128&font-size=0.5&bold=true&format=png`;
}

/**
 * Gets user avatar with fallback to placeholder
 */
export function getUserAvatar(user: {
  image?: string | null;
  name?: string | null;
  email?: string | null;
}): string {
  if (user.image) {
    return user.image;
  }

  return generatePlaceholderAvatar(user.name ?? null, user.email ?? null);
}
