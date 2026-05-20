import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ReminderCard } from '../src/components/ReminderCard';
import { getPet } from '../src/services/storage';
import { Reminder } from '../src/types';

const buildReminders = (petName: string): Reminder[] => [
  { id: '1', title: `Vacina V10${petName ? ` — ${petName}` : ''}`, description: 'Polivalente anual obrigatória. Protege contra 10 doenças.', date: '15/05/2026', status: 'pending', icon: '💉' },
  { id: '2', title: 'Vermifugação Trimestral', description: 'Vermifugação preventiva recomendada. Produto indicado pelo veterinário.', date: '01/06/2026', status: 'recommended', icon: '🐛' },
  { id: '3', title: 'Check-up Anual', description: 'Consulta preventiva com exames de sangue, urina e fezes.', date: '20/06/2026', status: 'recommended', icon: '🔬' },
  { id: '4', title: 'Medicamento Contínuo', description: 'Administração diária do medicamento prescrito.', date: 'Diário', status: 'pending', icon: '💊' },
  { id: '5', title: 'Retorno Pós-consulta', description: 'Retorno para avaliação do tratamento iniciado.', date: '10/05/2026', status: 'pending', icon: '🩺' },
  { id: '6', title: 'Nutrição e Bem-estar', description: 'Avaliação nutricional e ajuste de dieta com veterinário.', date: '30/06/2026', status: 'recommended', icon: '🥗' },
  { id: '7', title: 'Antirrábica', description: 'Vacina antirrábica anual obrigatória por lei.', date: '25/07/2026', status: 'pending', icon: '🛡️' },
  { id: '8', title: 'Banho e Tosa', description: 'Higiene mensal para saúde da pelagem e pele.', date: '08/05/2026', status: 'done', icon: '🛁' },
];

export default function AgendaScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useFocusEffect(useCallback(() => {
    (async () => {
      const pet = await getPet();
      setReminders(buildReminders(pet?.name || ''));
    })();
  }, []));

  const markDone = (id: string) =>
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: 'done' as const } : r));

  const pending     = reminders.filter(r => r.status === 'pending');
  const recommended = reminders.filter(r => r.status === 'recommended');
  const done        = reminders.filter(r => r.status === 'done');
  const total       = reminders.length;
  const pct         = total > 0 ? Math.round((done.length / total) * 100) : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER ── */}
        <LinearGradient
          colors={['#3B0F8C', '#6D28D9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.eyebrow}>SAÚDE DO PET</Text>
          <Text style={styles.headerTitle}>Lembretes</Text>
          <Text style={styles.headerSub}>Vacinas, consultas e cuidados</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{pending.length}</Text>
              <Text style={styles.statLabel}>Pendentes</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{recommended.length}</Text>
              <Text style={styles.statLabel}>Recomendados</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{done.length}</Text>
              <Text style={styles.statLabel}>Concluídos</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, styles.statNumAccent]}>{pct}%</Text>
              <Text style={[styles.statLabel, styles.statLabelAccent]}>Progresso</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── SHEET ── */}
        <View style={styles.sheet}>
          <View style={styles.progressWrap}>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${pct}%` as any }]} />
            </View>
            <Text style={styles.progressText}>{done.length} de {total} concluídos</Text>
          </View>

          {pending.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.sectionTitle}>Pendentes</Text>
              </View>
              {pending.map(r => <ReminderCard key={r.id} reminder={r} onMarkDone={markDone} />)}
            </View>
          )}

          {recommended.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionDot, { backgroundColor: '#6366F1' }]} />
                <Text style={styles.sectionTitle}>Recomendados</Text>
              </View>
              {recommended.map(r => <ReminderCard key={r.id} reminder={r} onMarkDone={markDone} />)}
            </View>
          )}

          {done.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.sectionTitle}>Concluídos</Text>
              </View>
              {done.map(r => <ReminderCard key={r.id} reminder={r} onMarkDone={markDone} />)}
            </View>
          )}

          <View style={styles.bottomPad} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#3B0F8C' },
  scroll:  { flex: 1, backgroundColor: '#F7F7F9' },
  content: { paddingBottom: 0 },

  // Header
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 48 },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 2.5,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 4,
    fontWeight: '400',
    marginBottom: 24,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingVertical: 14,
  },
  statItem:  { flex: 1, alignItems: 'center' },
  statSep:   { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'center' },
  statNum:   { fontSize: 20, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.5 },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 3, fontWeight: '500' },
  statNumAccent:   { color: '#C4B5FD' },
  statLabelAccent: { color: 'rgba(196,181,253,0.7)' },

  // Sheet
  sheet: {
    backgroundColor: '#F7F7F9',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  // Progress
  progressWrap: { marginBottom: 28 },
  progressBg: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: { height: '100%', backgroundColor: '#10B981', borderRadius: 2 },
  progressText: { fontSize: 12, color: '#9CA3AF', textAlign: 'right', fontWeight: '500' },

  // Sections
  section:       { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionDot:    { width: 6, height: 6, borderRadius: 3 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  bottomPad: { height: 40 },
});
