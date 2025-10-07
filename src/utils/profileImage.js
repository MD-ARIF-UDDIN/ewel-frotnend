// Utility function to get user profile image URL
export const getProfileImageUrl = (profilePhoto) => {
    // If no profile photo, return null
    if (!profilePhoto) return null;

    // If profilePhoto is already a full URL (preview), return it directly
    if (profilePhoto.startsWith('http') || profilePhoto.startsWith('data:')) {
        return profilePhoto;
    }

    // Use environment variable or fallback to localhost
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    // Remove '/api' from the end if present and add '/uploads/user/'
    const cleanBaseUrl = baseUrl.replace(/\/api$/, '');
    return `${cleanBaseUrl}/uploads/user/${profilePhoto}`;
};

// Utility function to get user initials
export const getInitials = (name) => {
    return name
        ?.split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase() || 'U';
};