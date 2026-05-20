import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Reminder } from '../types';

interface ReminderCardProps {
  reminder: Reminder;
  onMarkDone: (id: string) => void;
}

const STATUS_CONFIG = {
  pending: { label: 'Pendente', color: '#D97706', bg: '#FFFBEB', accent: '#F59E0B' },
  done:    { label: 'Concluído', color: '#059669', bg: '#F0FDF4', accent: '#10B981' },
  recommended: { label: 'Recomendado', color: '#4F46E5', bg: '#EEF2FF', accent: '#6366F1' },
};

export const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onMarkDone }) => {
  const cfg = STATUS_CONFIG[reminder.status];

  return (
    <View style={[styles.card, reminder.status === 'done' && styles.cardDone]}>
      <View style={[styles.accent, { backgroundColor: cfg.accent }]} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text
            style={[styles.title, reminder.status === 'done' && styles.titleDone]}
            numberOfLines={1}
          >
            {reminder.title}
          </Text>
          <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>{reminder.description}</Text>

        <View style={styles.footer}>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={11} color="#9CA3AF" />
            <Text style={styles.date}>{reminder.date}</Text>
          </View>
          {reminder.status !== 'done' && (
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => onMarkDone(reminder.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.doneBtnText}>Marcar como feito</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  cardDone: { opacity: 0.55 },
  accent: { width: 3, alignSelf: 'stretch' },
  body: { flex: 1, padding: 14, paddingLeft: 16 },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    letterSpacing: -0.1,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    flexShrink: 0,
  },
  badgeText: { fontSize: 10, fontWeight: '600', letterSpacing: 0.1 },

  description: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 17,
    marginBottom: 10,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  date: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },

  doneBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#F3EDFF',
  },
  doneBtnText: {
    fontSize: 11,
    color: '#6F3CC3',
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});
