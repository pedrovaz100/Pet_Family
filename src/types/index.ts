export interface Pet {
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed: string;
  age: string;
  weight: string;
  healthNotes: string;
  specialConditions: string;
}

export interface Appointment {
  tutorName: string;
  petName: string;
  type: 'preventive' | 'vaccination' | 'return' | 'emergency' | 'checkup';
  date: string;
  time: string;
  notes: string;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'done' | 'recommended';
  icon: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface User {
  name: string;
  email: string;
  password: string;
}
