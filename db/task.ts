export interface Task {
    id: number;
    name: string;
    reminderType: 'hourly' | 'daily' | 'weekly' | 'monthly';
    timeToRemind: string;
    createdAt: Date;
  }