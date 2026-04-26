
"use client";

import { useState, useEffect, useCallback } from 'react';
import { authAPI, caseAPI, userAPI, volunteerAPI } from './api';

export type Role = 'admin' | 'coordinator' | 'volunteer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  skills?: string[];
  status?: 'Available' | 'Busy';
  location?: string;
  avatar?: string;
  isAuthorized?: boolean;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  category: string;
  type?: 'case' | 'volunteer' | 'relief camp' | 'danger zone';
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  location: string;
  coordinates?: { lat: number; lng: number };
  skillRequired?: string;
  status: 'Open' | 'In Progress' | 'Completed' | 'Pending' | 'Active';
  assignedTo?: string;
  createdBy?: string;
  createdAt: string;
  updates: Array<{ timestamp: string; note: string; user: string }>;
  suggestedActions?: string[];
}

export interface Volunteer extends User {
  isAuthorized?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'case' | 'volunteer' | 'system' | 'urgent';
  isRead: boolean;
}

export const INITIAL_USERS: User[] = [
  { id: '1', name: 'Alice Admin', email: 'admin@resqlink.com', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Charlie Coord', email: 'coordinator@resqlink.com', role: 'coordinator', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Ravi Deshmukh', email: 'volunteer@resqlink.com', role: 'volunteer', skills: ['Medical', 'Logistics'], status: 'Available', location: 'Nagpur, Maharashtra', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Sanjay Patil', email: 'sanjay@resqlink.com', role: 'volunteer', skills: ['Construction', 'Rescue'], status: 'Busy', location: 'Mumbai, Maharashtra', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'Sarah Smith', email: 'sarah@resqlink.com', role: 'volunteer', skills: ['Medical', 'Nursing'], status: 'Available', location: 'Pune, Maharashtra', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: '6', name: 'James Wilson', email: 'james@resqlink.com', role: 'volunteer', skills: ['Logistics', 'Driving'], status: 'Available', location: 'Nashik, Maharashtra', avatar: 'https://i.pravatar.cc/150?u=6' },
  { id: '7', name: 'Elena Rodriguez', email: 'elena@resqlink.com', role: 'volunteer', skills: ['Translation', 'Communication'], status: 'Available', location: 'Delhi', avatar: 'https://i.pravatar.cc/150?u=7' },
  { id: '8', name: 'David Chen', email: 'david@resqlink.com', role: 'volunteer', skills: ['Search and Rescue', 'Firefighting'], status: 'Busy', location: 'Bengaluru', avatar: 'https://i.pravatar.cc/150?u=8' },
  { id: '9', name: 'Maria Garcia', email: 'maria@resqlink.com', role: 'volunteer', skills: ['Psychology', 'Counseling'], status: 'Available', location: 'Kolkata', avatar: 'https://i.pravatar.cc/150?u=9' },
  { id: '10', name: 'Kevin Lee', email: 'kevin@resqlink.com', role: 'volunteer', skills: ['IT', 'Communication'], status: 'Available', location: 'Chennai', avatar: 'https://i.pravatar.cc/150?u=10' },
  { id: '11', name: 'Lisa Brown', email: 'lisa@resqlink.com', role: 'coordinator', avatar: 'https://i.pravatar.cc/150?u=11' },
  { id: '12', name: 'Michael Taylor', email: 'michael@resqlink.com', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=12' },
];

export const INITIAL_CASES: Case[] = [
  {
    id: 'CASE-101',
    title: 'Nagpur Flood Relief',
    description: 'High water levels in Sector 4. Logistics support needed for heavy vehicle transit.',
    category: 'Flood Relief',
    type: 'case',
    urgency: 'Critical',
    location: 'Nagpur, Maharashtra',
    coordinates: { lat: 21.1458, lng: 79.0882 },
    skillRequired: 'Logistics',
    status: 'In Progress',
    assignedTo: '3',
    createdAt: '2024-05-01T12:00:00.000Z',
    updates: [{ timestamp: '2024-05-01T12:00:00.000Z', note: 'Case opened.', user: 'Charlie Coord' }],
    suggestedActions: ['Deploy supply trucks', 'Establish distribution point']
  },
  {
    id: 'CASE-102',
    title: 'Pune Vaccination Drive',
    description: 'Community medical support for mass vaccination program at central hub.',
    category: 'Medical',
    type: 'case',
    urgency: 'Medium',
    location: 'Pune, Maharashtra',
    coordinates: { lat: 18.5204, lng: 73.8567 },
    skillRequired: 'Medical',
    status: 'In Progress',
    assignedTo: '5',
    createdAt: '2024-05-02T10:00:00.000Z',
    updates: [
      { timestamp: '2024-05-02T10:00:00.000Z', note: 'Case opened.', user: 'Charlie Coord' },
      { timestamp: '2024-05-02T10:15:00.000Z', note: 'Volunteer assigned.', user: 'Charlie Coord' }
    ],
  },
  {
    id: 'CASE-103',
    title: 'Amravati Landslide Rescue',
    description: 'Search and rescue mission in remote village sector B7 following soil instability.',
    category: 'Rescue',
    type: 'case',
    urgency: 'High',
    location: 'Amravati, Maharashtra',
    coordinates: { lat: 20.9320, lng: 77.7523 },
    skillRequired: 'Medical',
    status: 'Open',
    createdAt: '2024-05-03T08:00:00.000Z',
    updates: [{ timestamp: '2024-05-03T08:00:00.000Z', note: 'Case opened.', user: 'Alice Admin' }],
  },
  {
    id: 'CASE-104',
    title: 'Nashik Food Logistics',
    description: 'Urgent supply chain coordination for food distribution to 500 displaced families.',
    category: 'Food',
    type: 'case',
    urgency: 'Medium',
    location: 'Nashik, Maharashtra',
    coordinates: { lat: 19.9975, lng: 73.7898 },
    skillRequired: 'Logistics',
    status: 'Completed',
    assignedTo: '6',
    createdAt: '2024-05-03T09:30:00.000Z',
    updates: [{ timestamp: '2024-05-03T09:30:00.000Z', note: 'Distribution started.', user: 'Lisa Brown' }],
  },
  {
    id: 'CASE-105',
    title: 'Mumbai Search Mission',
    description: 'Tactical search and rescue operation active in the Western Ghats periphery.',
    category: 'Rescue',
    type: 'case',
    urgency: 'High',
    location: 'Mumbai, Maharashtra',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    skillRequired: 'Rescue',
    status: 'In Progress',
    assignedTo: '4',
    createdAt: '2024-05-04T06:00:00.000Z',
    updates: [{ timestamp: '2024-05-04T06:00:00.000Z', note: 'Rescue mission active.', user: 'Alice Admin' }],
  },
  {
    id: 'CAMP-201',
    title: 'Amravati Relief Hub',
    description: 'Primary shelter and medical station providing essential services.',
    category: 'Shelter',
    type: 'relief camp',
    urgency: 'Low',
    location: 'Amravati, Maharashtra',
    coordinates: { lat: 21.0000, lng: 77.8000 },
    status: 'Open',
    createdAt: '2024-05-04T11:00:00.000Z',
    updates: [{ timestamp: '2024-05-04T11:00:00.000Z', note: 'Camp established.', user: 'Charlie Coord' }],
  },
  {
    id: 'CASE-106',
    title: 'Akola Shelter Management',
    description: 'Coordinating alternative housing sites as occupancy reaches 90% threshold.',
    category: 'Shelter',
    type: 'case',
    urgency: 'High',
    location: 'Akola, Maharashtra',
    coordinates: { lat: 20.7002, lng: 77.0082 },
    skillRequired: 'Communication',
    status: 'Open',
    createdAt: '2024-05-05T09:00:00.000Z',
    updates: [{ timestamp: '2024-05-05T09:00:00.000Z', note: 'Site assessment started.', user: 'Alice Admin' }],
  },
  {
    id: 'CASE-107',
    title: 'Kolkata Medical Outpost',
    description: 'Setting up temporary medical screening in Sector 12 following urban flooding.',
    category: 'Medical',
    type: 'case',
    urgency: 'Medium',
    location: 'Kolkata, West Bengal',
    coordinates: { lat: 22.5726, lng: 88.3639 },
    skillRequired: 'Medical',
    status: 'Open',
    createdAt: '2024-05-05T10:00:00.000Z',
    updates: [{ timestamp: '2024-05-05T10:00:00.000Z', note: 'Logistics en route.', user: 'Lisa Brown' }],
  },
  {
    id: 'CASE-108',
    title: 'Bengaluru Water Crisis',
    description: 'Immediate water supply logistics required for marginalized sectors.',
    category: 'Logistics',
    type: 'case',
    urgency: 'Critical',
    location: 'Bengaluru, Karnataka',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    skillRequired: 'Logistics',
    status: 'Open',
    createdAt: '2024-05-05T11:00:00.000Z',
    updates: [{ timestamp: '2024-05-05T11:00:00.000Z', note: 'Priority 1 assigned.', user: 'Alice Admin' }],
  },
  {
    id: 'CASE-109',
    title: 'Chennai Cyclone Response',
    description: 'Emergency grid readiness and evacuation planning for low-lying sectors.',
    category: 'Emergency',
    type: 'case',
    urgency: 'High',
    location: 'Chennai, Tamil Nadu',
    coordinates: { lat: 13.0827, lng: 80.2707 },
    skillRequired: 'Communication',
    status: 'Open',
    createdAt: '2024-05-05T07:00:00.000Z',
    updates: [{ timestamp: '2024-05-05T07:00:00.000Z', note: 'Alert broadcasted.', user: 'Lisa Brown' }],
  },
  {
    id: 'CAMP-202',
    title: 'Delhi Command Shelter',
    description: 'Central coordination hub and primary emergency housing facility.',
    category: 'Shelter',
    type: 'relief camp',
    urgency: 'Low',
    location: 'Delhi',
    coordinates: { lat: 28.6500, lng: 77.2500 },
    status: 'Open',
    createdAt: '2024-05-01T09:00:00.000Z',
    updates: [{ timestamp: '2024-05-01T09:00:00.000Z', note: 'Ready for intake.', user: 'Alice Admin' }],
  },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'New case created', description: 'Flood Relief Support case has been opened in Eastern District.', time: '2m ago', type: 'case', isRead: false },
  { id: 'n2', title: 'Volunteer assigned', description: 'Sarah Smith has been assigned to Food Distribution Request.', time: '15m ago', type: 'volunteer', isRead: false },
  { id: 'n3', title: 'Urgent alert updated', description: 'Cyclone Alert Support priority elevated to Critical.', time: '1h ago', type: 'urgent', isRead: true },
  { id: 'n4', title: 'System sync complete', description: 'All mission nodes successfully synchronized with central core.', time: '3h ago', type: 'system', isRead: true },
  { id: 'n5', title: 'Mission completed', description: 'Clean Water Supply mission successfully closed.', time: '5h ago', type: 'case', isRead: true },
];

export const getStoreData = <T>(key: string, initial: T): T => {
  if (typeof window === 'undefined') return initial;
  const stored = localStorage.getItem(`ResQLink_${key}`);
  if (!stored) return initial;
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.warn(`Failed to parse store data for ${key}`, e);
    return initial;
  }
};

export const setStoreData = (key: string, data: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`ResQLink_${key}`, JSON.stringify(data));
};

export const clearSession = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('ResQLink_currentUser');
  localStorage.removeItem('resqlink_token');
};

export const saveToken = (token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('resqlink_token', token);
};

import { RecoveryProtocol } from './recovery-protocol';

export const useStore = () => {
  const [users, setUsersState] = useState<User[]>(INITIAL_USERS);
  const [cases, setCasesState] = useState<Case[]>(INITIAL_CASES);
  const [notifications, setNotificationsState] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Automatic Bug Fixing Protocol
  const runSystemAudit = useCallback((casesData: Case[], usersData: User[]) => {
    const cleanCases = RecoveryProtocol.sanitizeMissions(casesData);
    const cleanUsers = RecoveryProtocol.repairUserDatabase(usersData);
    
    // Check if any repairs were actually made to avoid infinite loops
    if (JSON.stringify(cleanCases) !== JSON.stringify(casesData)) {
      setCasesState(cleanCases);
      setStoreData('cases', cleanCases);
    }
    if (JSON.stringify(cleanUsers) !== JSON.stringify(usersData)) {
      setUsersState(cleanUsers);
      setStoreData('users', cleanUsers);
    }
  }, []);

  // Fetch initial data from API
  const fetchFromAPI = useCallback(async () => {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('resqlink_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Concurrent fetch for performance
      const [userRes, casesRes, usersRes] = await Promise.allSettled([
        authAPI.me(),
        caseAPI.getAll(),
        userAPI.getAllUsers()
      ]);

      if (userRes.status === 'fulfilled' && userRes.value.success) {
        setCurrentUserState(userRes.value.data as User);
        setStoreData('currentUser', userRes.value.data);
      }

      if (casesRes.status === 'fulfilled' && casesRes.value.success) {
        setCasesState(casesRes.value.data as Case[]);
        setStoreData('cases', casesRes.value.data);
      }

      if (usersRes.status === 'fulfilled' && usersRes.value.success) {
        setUsersState(usersRes.value.data as User[]);
        setStoreData('users', usersRes.value.data);
      }

      // Run Audit to fix any API data bugs
      runSystemAudit(
        casesRes.status === 'fulfilled' ? casesRes.value.data as Case[] : cases,
        usersRes.status === 'fulfilled' ? usersRes.value.data as User[] : users
      );
    } catch (err) {
      console.error('API fetch error:', err);
      // Fallback to local storage is already handled by initial state
    } finally {
      setLoading(false);
    }
  }, [runSystemAudit]);

  useEffect(() => {
    // Initial load from localStorage
    const localUsers = getStoreData<User[]>('users', INITIAL_USERS);
    const localCases = getStoreData<Case[]>('cases', INITIAL_CASES);
    const localNotifications = getStoreData<Notification[]>('notifications', INITIAL_NOTIFICATIONS);
    const localCurrentUser = getStoreData<User | null>('currentUser', null);

    setUsersState(localUsers);
    setCasesState(localCases);
    setNotificationsState(localNotifications);
    setCurrentUserState(localCurrentUser);
    
    // Immediate Audit
    runSystemAudit(localCases, localUsers);
    
    fetchFromAPI();
  }, [fetchFromAPI, runSystemAudit]);

  const saveUsers = useCallback((newUsers: User[] | ((prev: User[]) => User[])) => {
    setUsersState(prev => {
      const updated = typeof newUsers === 'function' ? newUsers(prev) : newUsers;
      setStoreData('users', updated);
      return updated;
    });
  }, []);

  const saveCases = useCallback((newCases: Case[] | ((prev: Case[]) => Case[])) => {
    setCasesState(prev => {
      const updated = typeof newCases === 'function' ? newCases(prev) : newCases;
      setStoreData('cases', updated);
      return updated;
    });
  }, []);

  const loginUser = useCallback(async (user: User, token?: string) => {
    if (token) saveToken(token);
    setStoreData('currentUser', user);
    setCurrentUserState(user);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotificationsState(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, isRead: true } : n);
      setStoreData('notifications', updated);
      return updated;
    });
  }, []);

  const updateCurrentUser = useCallback(async (user: User) => {
    setStoreData('currentUser', user);
    setCurrentUserState(user);
    saveUsers(prev => prev.map(u => u.id === user.id ? user : u));
  }, [saveUsers]);

  const refreshCases = useCallback(async () => {
    try {
      const res = await caseAPI.getAll();
      if (res.success && res.data) {
        setCasesState(res.data as Case[]);
        setStoreData('cases', res.data);
      }
    } catch (err) {
      console.error('Failed to refresh cases:', err);
    }
  }, []);

  const refreshUsers = useCallback(async () => {
    try {
      const res = await userAPI.getAllUsers();
      if (res.success && res.data) {
        setUsersState(res.data as User[]);
        setStoreData('users', res.data);
      }
    } catch (err) {
      console.error('Failed to refresh users:', err);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      // Ignore logout errors
    }
    clearSession();
    setCurrentUserState(null);
  }, []);

  return { 
    users, 
    cases, 
    notifications,
    currentUser, 
    saveUsers, 
    saveCases, 
    loginUser, 
    updateCurrentUser,
    refreshCases,
    refreshUsers,
    logout,
    markNotificationRead,
    runSystemAudit,
    loading,
    error
  };
};
