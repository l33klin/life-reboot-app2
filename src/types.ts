export interface UserData {
  hasCompletedOnboarding: boolean;
  
  // Morning - Psychological Excavation
  antiVision: string; // The life you never want to experience again
  vision: string; // The ideal life you want
  
  // Goals
  oneYearGoal: string; // Mission: What will life look like in 1 year
  oneMonthProject: string; // Boss fight: What to learn/build this month
  
  // Daily
  dailyQuests: Quest[]; // Quests: Priority needle-moving tasks
  
  // Rules
  constraints: string[]; // Rules: Limitations to encourage creativity
}

export interface Quest {
  id: string;
  title: string;
  completed: boolean;
}
