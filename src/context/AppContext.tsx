"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserData, Quest } from '../types';

const defaultUserData: UserData = {
  hasCompletedOnboarding: false,
  antiVision: '',
  vision: '',
  oneYearGoal: '',
  oneMonthProject: '',
  dailyQuests: [],
  constraints: [],
};

interface AppContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  toggleQuest: (id: string) => void;
  resetApp: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('lifeRebootData');
    if (savedData) {
      try {
        setUserData(JSON.parse(savedData));
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('lifeRebootData', JSON.stringify(userData));
    }
  }, [userData, isLoaded]);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const toggleQuest = (id: string) => {
    setUserData((prev) => ({
      ...prev,
      dailyQuests: prev.dailyQuests.map((quest) =>
        quest.id === id ? { ...quest, completed: !quest.completed } : quest
      ),
    }));
  };

  const resetApp = () => {
    setUserData(defaultUserData);
  };

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <AppContext.Provider value={{ userData, updateUserData, toggleQuest, resetApp }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
