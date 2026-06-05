import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for updating user profile
 * Handles both API calls and local state synchronization
 * Ensures updates are reflected everywhere (context + localStorage + other tabs)
 */
export const useProfileUpdate = () => {
  const { user, token, updateUser } = useAuth();

  const updateProfile = useCallback(async (formData, options = {}) => {
    const {
      userId = user?._id,
      resumeFile = null,
      avatarFile = null,
      onSuccess = null,
      onError = null,
      isFormData = false, // Whether to use FormData or JSON
    } = options;

    if (!userId) {
      const error = 'User ID not found';
      onError?.(error);
      throw new Error(error);
    }

    try {
      let body;
      let headers = { Authorization: `Bearer ${token}` };

      // Prepare request body
      if (resumeFile || avatarFile || isFormData) {
        // Use FormData for file uploads
        const formDataToSend = new FormData();
        
        // Add all form fields
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            if (typeof value === 'object') {
              formDataToSend.append(key, JSON.stringify(value));
            } else {
              formDataToSend.append(key, value);
            }
          }
        });

        // Add files if present
        if (resumeFile) {
          formDataToSend.append('resume', resumeFile);
        }
        if (avatarFile) {
          formDataToSend.append('avatar', avatarFile);
        }

        body = formDataToSend;
        // Don't set Content-Type for FormData, browser will set it with boundary
      } else {
        // Use JSON for regular updates
        body = JSON.stringify(formData);
        headers['Content-Type'] = 'application/json';
      }

      // Make API call
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers,
        body,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = errorData.message || 'Failed to update profile';
        onError?.(error);
        throw new Error(error);
      }

      const responseData = await response.json();
      const updatedUser = responseData.user || { ...user, ...formData };

      // Update context (this also updates localStorage)
      updateUser(updatedUser);

      // Call success callback
      onSuccess?.(updatedUser);

      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      // SECURITY: Do not apply updates without server confirmation to prevent data loss
      onError?.(error.message || 'Network error. Please check your connection and try again.');
      throw error;
    }
  }, [user, token, updateUser]);

  return { updateProfile, user };
};
