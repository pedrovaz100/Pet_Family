import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet, Appointment, User } from '../types';

const KEYS = {
  PET: '@petfamily:pet',
  APPOINTMENT: '@petfamily:appointment',
  USER: '@petfamily:user',
  SESSION: '@petfamily:session',
};

export const savePet = async (pet: Pet): Promise<void> => {
  await AsyncStorage.setItem(KEYS.PET, JSON.stringify(pet));
};

export const getPet = async (): Promise<Pet | null> => {
  const data = await AsyncStorage.getItem(KEYS.PET);
  return data ? JSON.parse(data) : null;
};

export const removePet = async (): Promise<void> => {
  await AsyncStorage.removeItem(KEYS.PET);
};

export const saveAppointment = async (appointment: Appointment): Promise<void> => {
  await AsyncStorage.setItem(KEYS.APPOINTMENT, JSON.stringify(appointment));
};

export const getAppointment = async (): Promise<Appointment | null> => {
  const data = await AsyncStorage.getItem(KEYS.APPOINTMENT);
  return data ? JSON.parse(data) : null;
};

export const saveUser = async (user: User): Promise<void> => {
  await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
};

export const getUser = async (): Promise<User | null> => {
  const data = await AsyncStorage.getItem(KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const setLoggedIn = async (value: boolean): Promise<void> => {
  await AsyncStorage.setItem(KEYS.SESSION, String(value));
};

export const isLoggedIn = async (): Promise<boolean> => {
  const val = await AsyncStorage.getItem(KEYS.SESSION);
  return val === 'true';
};

export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem(KEYS.SESSION);
};
