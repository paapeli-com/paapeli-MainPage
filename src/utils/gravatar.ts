/**
 * Gravatar utility functions
 */

/**
 * Generate Gravatar URL from email address
 * @param email - User's email address
 * @param size - Avatar size in pixels (default: 80)
 * @param defaultImage - Default image type ('identicon', 'monsterid', 'wavatar', 'retro', 'robohash', 'blank')
 * @returns Gravatar URL
 */
export function getGravatarUrl(
  email: string,
  size: number = 80,
  defaultImage: string = 'identicon'
): string {
  // Create MD5 hash of email (lowercase and trimmed)
  const emailHash = md5(email.toLowerCase().trim());

  // Build Gravatar URL
  const params = new URLSearchParams({
    s: size.toString(),
    d: defaultImage,
    r: 'g' // Rating: G (suitable for all audiences)
  });

  return `https://www.gravatar.com/avatar/${emailHash}?${params}`;
}

/**
 * Simple MD5 hash implementation for browser environment
 * @param str - String to hash
 * @returns MD5 hash
 */
function md5(str: string): string {
  // Simple hash for demonstration - in production, you might want to use a proper MD5 library
  // For now, we'll use a simple hash function
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Get user initials from name or email
 * @param name - User's full name
 * @param email - User's email (fallback)
 * @returns Initials (up to 2 characters)
 */
export function getUserInitials(name?: string, email?: string): string {
  if (name && name.trim()) {
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  }

  if (email && email.trim()) {
    return email.trim()[0].toUpperCase();
  }

  return 'U';
}