import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ReminderCard } from '../src/components/ReminderCard';
import { getPet } from '../src/services/storage';
import { Reminder } from '../src/types';
import { Colors } from '../src/constants/colors';

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
  const [petName, setPetName] = useState('');

  useFocusEffect(useCallback(() => {
    (async () => {
      const pet = await getPet();
      const name = pet?.name || '';
      setPetName(name);
      setReminders(buildReminders(name));
    })();
  }, []));

  const markDone = (id: string) =>
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: 'done' as const } : r));

  const pending = reminders.filter(r => r.status === 'pending');
  const recommended = reminders.filter(r => r.status === 'recommended');
  const done = reminders.filter(r => r.status === 'done');
  const total = reminders.length;
  const pct = total > 0 ? Math.round((done.length / total) * 100) : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.gradientEnd} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── HEADER ── */}
        <LinearGradient
          colors={[Colors.gradientEnd, Colors.gradientStart, Colors.primaryMid]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Agenda de Saúde</Text>
          <Text style={styles.headerSub}>
            {petName ? `Cuidados e lembretes de ${petName}` : 'Acompanhe a saúde do seu pet'}
          </Text>

          {/* Progress ring area */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{pending.length}</Text>
              <Text style={styles.statLabel}>Pendentes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{recommended.length}</Text>
              <Text style={styles.statLabel}>Recomendados</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{done.length}</Text>
              <Text style={styles.statLabel}>Concluídos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{pct}%</Text>
              <Text style={styles.statLabel}>Progresso</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── SHEET ── */}
        <View style={styles.sheet}>
          {/* Progress bar */}
          <View style={styles.progressWrap}>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${pct}%` as any }]} />
            </View>
            <Text style={styles.progressText}>{done.length} de {total} lembretes realizados</Text>
          </View>

          {pending.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Pendentes</Text>
              {pending.map(r => <ReminderCard key={r.id} reminder={r} onMarkDone={markDone} />)}
            </>
          )}
          {recommended.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>Recomendados</Text>
              {recommended.map(r => <ReminderCard key={r.id} reminder={r} onMarkDone={markDone} />)}
            </>
          )}
          {done.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>Concluídos</Text>
              {done.map(r => <ReminderCard key={r.id} reminder={r} onMarkDone={markDone} />)}
            </>
          )}
          <View style={styles.bottomPad} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.gradientEnd },
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 0 },

  header: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: Colors.white },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 6, marginBottom: 24 },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
  },
  statBox: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '900', color: Colors.white },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 3, textAlign: 'center' },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.25)', marginHorizontal: 4 },

  sheet: { backgroundColor: Colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -24, padding: 20 },

  progressWrap: { marginBottom: 28 },
  progressBg: { height: 8, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: Colors.green, borderRadius: 4 },
  progressText: { fontSize: 13, color: Colors.textSecondary, textAlign: 'right', fontWeight: '500' },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 12, marginTop: 4, letterSpacing: 0.2 },
  sectionTitleSpaced: { marginTop: 24 },
  bottomPad: { height: 32 },
});