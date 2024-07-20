export interface Task {
    id: number;
    name: string;
    reminderType: 'second' | 'minute' | 'hourly' | 'daily' | 'weekly' | 'monthly';
    timeToRemind: string;
    createdAt: Date;
  }