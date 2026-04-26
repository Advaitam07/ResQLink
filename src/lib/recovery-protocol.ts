
"use client";

import { User, Case, INITIAL_USERS, INITIAL_CASES } from './store';

/**
 * ResQLink System Recovery Protocol (Offline-First)
 * This protocol ensures the application remains functional even during 
 * critical database failures or sync errors.
 */

export const RecoveryProtocol = {
  /**
   * Sanitizes all mission data to ensure no broken slices or undefined fields
   */
  sanitizeMissions: (cases: Case[]): Case[] => {
    return cases.map(c => ({
      ...c,
      id: c.id || `AUTO-${Math.random().toString(36).substr(2, 9)}`,
      title: c.title || 'Untitled Mission',
      status: c.status || 'Pending',
      updates: c.updates || [],
      urgency: c.urgency || 'Medium'
    }));
  },

  /**
   * Repairs the user identity matrix if corruption is detected
   */
  repairUserDatabase: (users: User[]): User[] => {
    const validUsers = users.filter(u => u.id && u.role);
    if (validUsers.length === 0) return INITIAL_USERS;
    return validUsers;
  },

  /**
   * Generates emergency local fallbacks for critical infrastructure
   */
  generateEmergencyFallback: () => {
    console.warn("RECOVERY_PROTOCOL: Emergency data reconstruction initiated.");
    return {
      cases: INITIAL_CASES,
      users: INITIAL_USERS,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Validates the integrity of the current tactical state
   */
  validateSystemIntegrity: (state: any): boolean => {
    if (!state.users || !Array.isArray(state.users)) return false;
    if (!state.cases || !Array.isArray(state.cases)) return false;
    return true;
  }
};
