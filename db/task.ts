export interface Task {
    id: string;
    name: string;
    reminderType: "Hourly" | 'Daily' | 'Weekly' | 'Monthly';
    createdAt: Date;
    email: string;
  }