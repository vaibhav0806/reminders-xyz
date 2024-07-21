export interface Task {
    id: string;
    name: string;
    reminderType: "Minutely" | 'Daily' | 'Weekly' | 'Monthly';
    createdAt: Date;
    email: string;
  }