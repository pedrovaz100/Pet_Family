import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface KpiCardProps {
  label: string;
  value: string;
  icon: string;
  color?: string;
  trend?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  icon,
  color = Colors.primary,
  trend,
}) => {
  return (
    <View style={[styles.card, { borderTopColor: color, borderTopWidth: 3 }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {trend && <Text style={styles.trend}>{trend}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    width: '47%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: { fontSize: 26, marginBottom: 6 },
  value: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  trend: {
    fontSize: 11,
    color: Colors.green,
    marginTop: 4,
    fontWeight: '600',
  },
});
