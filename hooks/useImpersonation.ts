import React, { useState, useCallback } from 'react';
import { Agency, UserRole, AgencySettings } from '../types';

interface UseImpersonationProps {
  setSettings: React.Dispatch<React.SetStateAction<AgencySettings>>;
  setUserRole: React.Dispatch<React.SetStateAction<UserRole>>;
}

export const useImpersonation = ({ setSettings, setUserRole }: UseImpersonationProps) => {
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedAgency, setImpersonatedAgency] = useState<Agency | null>(null);
  
  // Store the original identity to restore later
  const [originalRole, setOriginalRole] = useState<UserRole>('super_admin');
  const [originalSettings, setOriginalSettings] = useState<AgencySettings | null>(null);

  const startImpersonation = useCallback((agency: Agency, currentSettings: AgencySettings) => {
    // 1. Save current state
    setOriginalRole('super_admin'); // Assuming start is always from super admin
    setOriginalSettings(currentSettings);

    // 2. Set Impersonation State
    setImpersonatedAgency(agency);
    setIsImpersonating(true);

    // 3. Apply the "Mask" (Switch Context)
    // We degrade the role to 'admin' so the app renders the Agency View
    setUserRole('admin');
    
    // Switch the global settings context to the target agency
    setSettings({
      name: agency.name,
      nangoConnected: false // Default or fetch from agency data
    });

  }, [setSettings, setUserRole]);

  const stopImpersonation = useCallback(() => {
    if (!originalSettings) return;

    // 1. Restore original state
    setUserRole(originalRole);
    setSettings(originalSettings);

    // 2. Clear Impersonation State
    setIsImpersonating(false);
    setImpersonatedAgency(null);
    setOriginalSettings(null);

  }, [originalRole, originalSettings, setSettings, setUserRole]);

  return {
    isImpersonating,
    impersonatedAgency,
    startImpersonation,
    stopImpersonation
  };
};