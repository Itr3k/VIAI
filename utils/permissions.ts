import { User, Agency, UserRole } from '../types';

/**
 * Checks if a user has permission to access a specific resource.
 * This simulates backend Row Level Security (RLS).
 * 
 * Rules:
 * 1. Super Admins can access EVERYTHING.
 * 2. Agency Admins can access:
 *    - Their own Agency data.
 *    - Data of Clients belonging to their Agency.
 * 3. Clients can ONLY access their own data.
 */
export const canAccessResource = (user: User, resourceOwnerId: string, resourceAgencyId?: string): boolean => {
    if (user.role === 'super_admin') return true;

    if (user.role === 'agency_admin') {
        // Can access if resource belongs to their agency
        if (resourceAgencyId === user.agencyId) return true;
        // Can access if they are the direct owner (unlikely for client resources, but possible for agency settings)
        if (resourceOwnerId === user.id) return true;
        return false;
    }

    if (user.role === 'client') {
        // Can ONLY access if they are the owner
        return resourceOwnerId === user.id;
    }

    return false;
};

/**
 * Determines the scope of Korra AI for a given user.
 */
export const getKorraScope = (user: User): 'global' | 'agency' | 'client' => {
    if (user.role === 'super_admin') return 'global';
    if (user.role === 'agency_admin') return 'agency';
    return 'client';
};

/**
 * Returns the "Root" ID for RAG isolation.
 * - For Clients, it's their own ID.
 * - For Agencies, it's their Agency ID.
 * - For Super Admins, it's 'global'.
 */
export const getRAGRootId = (user: User): string => {
    if (user.role === 'super_admin') return 'global';
    if (user.role === 'agency_admin') return user.agencyId || user.id;
    return user.id;
};
