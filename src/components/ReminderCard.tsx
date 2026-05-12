import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Reminder } from '../types';
import { Colors } from '../constants/colors';

interface ReminderCardProps {
  reminder: Reminder;
  onMarkDone: (id: string) => void;
}

const statusColors: Record<string, string> = {
  pending: Colors.yellow,
  done: Colors.green,
  recommended: Colors.blue,
};

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  done: 'Concluído',
  recommended: 'Recomendado',
};

export const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onMarkDone }) => {
  const statusColor = statusColors[reminder.status];

  return (
    <View style={[styles.card, reminder.status === 'done' && styles.cardDone]}>
      <View style={styles.iconBox}>
        <Text style={styles.iconText}>{reminder.icon}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.title, reminder.status === 'done' && styles.titleDone]}>
            {reminder.title}
          </Text>
          <View style={[styles.badge, { backgroundColor: statusColor + '22' }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>
              {statusLabels[reminder.status]}
            </Text>
          </View>
        </View>
        <Text style={styles.description}>{reminder.description}</Text>
        <Text style={styles.date}>📅 {reminder.date}</Text>
        {reminder.status !== 'done' && (
          <TouchableOpacity style={styles.doneBtn} onPress={() => onMarkDone(reminder.id)}>
            <Ionicons name="checkmark-circle-outline" size={16} color={Colors.primary} />
            <Text style={styles.doneBtnText}>Marcar como feito</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  cardDone: {
    opacity: 0.7,
    backgroundColor: '#F9FFF9',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: { fontSize: 22 },
  content: { flex: 1 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 8,
  },
  badgeText: { fontSize: 11, fontWeight: '600' },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
    lineHeight: 18,
  },
  date: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 8,
  },
  doneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  doneBtnText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
});
