import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { KpiCard } from '../src/components/KpiCard';
import { getPet, getAppointment } from '../src/services/storage';
import { Pet, Appointment } from '../src/types';
import { Colors } from '../src/constants/colors';

const { width } = Dimensions.get('window');

const KPIS = [
  { label: 'Retenção 90 dias', value: '87%', icon: '📈', color: Colors.green, trend: '↑ +5%' },
  { label: 'Adesão Vacinal', value: '92%', icon: '💉', color: Colors.blue, trend: '↑ +3%' },
  { label: 'NPS da Clínica', value: '78', icon: '⭐', color: Colors.yellow, trend: 'Excelente' },
  { label: 'Pets Ativos', value: '214', icon: '🐾', color: Colors.primary, trend: '↑ +12' },
  { label: 'Prev. Agendadas', value: '48', icon: '📋', color: Colors.teal, trend: 'Este mês' },
  { label: 'Retorno Mensal', value: '63%', icon: '🔄', color: Colors.orange, trend: '↑ +8%' },
];

const ALERTS = [
  { id: 1, text: 'Vacina V10 vence em 7 dias', color: Colors.yellow, icon: '⚠️', bg: '#FFF3CD' },
  { id: 2, text: 'Check-up anual em aberto há 3 meses', color: Colors.errorRed, icon: '🚨', bg: '#FEE2E2' },
  { id: 3, text: 'Vermifugação recomendada este mês', color: Colors.blue, icon: 'ℹ️', bg: Colors.blueLight },
];

const HISTORY = [
  { date: '10/03/2026', action: 'Consulta preventiva', vet: 'Dr. Carvalho', icon: '🩺' },
  { date: '15/01/2026', action: 'Vacinação V10 aplicada', vet: 'Dra. Ribeiro', icon: '💉' },
  { date: '05/11/2025', action: 'Check-up anual completo', vet: 'Dr. Carvalho', icon: '🔬' },
  { date: '20/08/2025', action: 'Consulta de retorno', vet: 'Dra. Fernandes', icon: '🔄' },
];

const TYPE_LABELS: Record<string, string> = {
  preventive: 'Preventiva', vaccination: 'Vacinação',
  return: 'Retorno', emergency: 'Emergência', checkup: 'Check-up',
};

export default function DashboardScreen() {
  const [pet, setPet] = useState<Pet | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  useFocusEffect(useCallback(() => {
    (async () => {
      const [p, a] = await Promise.all([getPet(), getAppointment()]);
      setPet(p); setAppointment(a);
    })();
  }, []));

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
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Dashboard Clínico</Text>
              <Text style={styles.headerSub}>PetFamily Veterinária · SP</Text>
            </View>
            <View style={styles.clinicBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.clinicBadgeText}>Ao vivo</Text>
            </View>
          </View>

          {/* Mini KPIs no header */}
          <View style={styles.miniKpiRow}>
            <View style={styles.miniKpi}>
              <Text style={styles.miniKpiVal}>214</Text>
              <Text style={styles.miniKpiLabel}>Pets</Text>
            </View>
            <View style={styles.miniDivider} />
            <View style={styles.miniKpi}>
              <Text style={styles.miniKpiVal}>87%</Text>
              <Text style={styles.miniKpiLabel}>Retenção</Text>
            </View>
            <View style={styles.miniDivider} />
            <View style={styles.miniKpi}>
              <Text style={styles.miniKpiVal}>NPS 78</Text>
              <Text style={styles.miniKpiLabel}>Satisfação</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── SHEET BRANCO ── */}
        <View style={styles.sheet}>

          {/* ── PET CADASTRADO ── */}
          <Text style={styles.sectionTitle}>Pet em Acompanhamento</Text>
          <View style={styles.petCard}>
            {pet ? (
              <View style={styles.petRow}>
                <View style={styles.petAvatarBg}>
                  <Text style={styles.petEmoji}>
                    {pet.species === 'dog' ? '🐶' : pet.species === 'cat' ? '🐱' : '🐾'}
                  </Text>
                </View>
                <View style={styles.petInfo}>
                  <Text style={styles.petName}>{pet.name}</Text>
                  <Text style={styles.petSub}>
                    {pet.species === 'dog' ? 'Cão' : pet.species === 'cat' ? 'Gato' : 'Animal'} · {pet.breed || 'SRD'} · {pet.age} anos
                  </Text>
                  {pet.healthNotes ? <Text style={styles.petNote} numberOfLines={1}>📋 {pet.healthNotes}</Text> : null}
                </View>
                <View style={styles.activePill}>
                  <View style={styles.activeDotGreen} />
                  <Text style={styles.activePillText}>Ativo</Text>
                </View>
              </View>
            ) : (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyEmoji}>🐾</Text>
                <Text style={styles.emptyTitle}>Nenhum pet cadastrado</Text>
                <Text style={styles.emptySub}>Cadastre na aba "Meu Pet"</Text>
              </View>
            )}
          </View>

          {/* ── ÚLTIMA IA ── */}
          <Text style={styles.sectionTitle}>Última Interação com IA</Text>
          <LinearGradient
            colors={[Colors.blueDark, Colors.blue]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.iaCard}
          >
            <View style={styles.iaRow}>
              <View style={styles.iaAvatar}><Text style={{ fontSize: 22 }}>🤖</Text></View>
              <View style={styles.iaInfo}>
                <Text style={styles.iaTitle}>Assistente Pet Family</Text>
                <Text style={styles.iaSub}>Hoje, durante a sessão</Text>
                <Text style={styles.iaMsg}>Tutor consultou sobre vacinação e agendamento preventivo.</Text>
              </View>
            </View>
          </LinearGradient>

          {/* ── PRÓXIMA CONSULTA ── */}
          <Text style={styles.sectionTitle}>Próxima Consulta</Text>
          <View style={[styles.apptCard, !appointment && styles.cardEmpty]}>
            {appointment ? (
              <View style={styles.apptRow}>
                <LinearGradient
                  colors={[Colors.green, Colors.greenDark]}
                  style={styles.apptIconBox}
                >
                  <Text style={{ fontSize: 22 }}>📅</Text>
                </LinearGradient>
                <View style={styles.apptInfo}>
                  <Text style={styles.apptPet}>{appointment.petName}</Text>
                  <Text style={styles.apptSub}>Tutor: {appointment.tutorName}</Text>
                  <Text style={styles.apptSub}>{TYPE_LABELS[appointment.type] || appointment.type}</Text>
                  <Text style={styles.apptDate}>{appointment.date} às {appointment.time}</Text>
                </View>
                <View style={styles.apptConfirmed}>
                  <Ionicons name="checkmark-circle" size={22} color={Colors.green} />
                  <Text style={styles.apptConfirmedText}>Confirmado</Text>
                </View>
              </View>
            ) : (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyEmoji}>📅</Text>
                <Text style={styles.emptyTitle}>Sem consulta agendada</Text>
                <Text style={styles.emptySub}>Agende na aba "Consulta"</Text>
              </View>
            )}
          </View>

          {/* ── ALERTAS ── */}
          <Text style={styles.sectionTitle}>Alertas Preventivos</Text>
          {ALERTS.map(alert => (
            <View key={alert.id} style={[styles.alertCard, { backgroundColor: alert.bg, borderLeftColor: alert.color }]}>
              <Text style={styles.alertIcon}>{alert.icon}</Text>
              <Text style={styles.alertText}>{alert.text}</Text>
            </View>
          ))}

          {/* ── KPIs ── */}
          <Text style={styles.sectionTitle}>Indicadores de Performance</Text>
          <View style={styles.kpiGrid}>
            {KPIS.map((kpi, i) => (
              <KpiCard key={i} label={kpi.label} value={kpi.value} icon={kpi.icon} color={kpi.color} trend={kpi.trend} />
            ))}
          </View>

          {/* ── HISTÓRICO ── */}
          <Text style={styles.sectionTitle}>Histórico Clínico</Text>
          <View style={styles.histCard}>
            {HISTORY.map((h, i) => (
              <View key={i} style={[styles.histItem, i < HISTORY.length - 1 && styles.histBorder]}>
                <View style={styles.histIconBox}>
                  <Text style={{ fontSize: 18 }}>{h.icon}</Text>
                </View>
                <View style={styles.histInfo}>
                  <Text style={styles.histAction}>{h.action}</Text>
                  <Text style={styles.histMeta}>{h.vet}</Text>
                </View>
                <Text style={styles.histDate}>{h.date}</Text>
              </View>
            ))}
          </View>

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

  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 36 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: Colors.white },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  clinicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 5,
  },
  activeDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.green },
  clinicBadgeText: { fontSize: 12, color: Colors.white, fontWeight: '700' },
  miniKpiRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 14,
  },
  miniKpi: { flex: 1, alignItems: 'center' },
  miniKpiVal: { fontSize: 18, fontWeight: '900', color: Colors.white },
  miniKpiLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  miniDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.25)', marginHorizontal: 8 },

  sheet: { backgroundColor: Colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -24, padding: 16 },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 12, marginTop: 8, letterSpacing: 0.1 },

  petCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  petRow: { flexDirection: 'row', alignItems: 'center' },
  petAvatarBg: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  petEmoji: { fontSize: 30 },
  petInfo: { flex: 1 },
  petName: { fontSize: 17, fontWeight: '800', color: Colors.text },
  petSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 3 },
  petNote: { fontSize: 11, color: Colors.textLight, marginTop: 3 },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.greenLight,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  activeDotGreen: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.green },
  activePillText: { fontSize: 11, color: Colors.green, fontWeight: '700' },

  emptyBox: { alignItems: 'center', paddingVertical: 20 },
  emptyEmoji: { fontSize: 36, marginBottom: 8 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: Colors.textSecondary },
  emptySub: { fontSize: 12, color: Colors.textLight, marginTop: 4 },

  iaCard: { borderRadius: 20, padding: 16, marginBottom: 20, overflow: 'hidden' },
  iaRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iaAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iaInfo: { flex: 1 },
  iaTitle: { fontSize: 14, fontWeight: '800', color: Colors.white },
  iaSub: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  iaMsg: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 6, lineHeight: 18 },

  apptCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  cardEmpty: {},
  apptRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  apptIconBox: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  apptInfo: { flex: 1 },
  apptPet: { fontSize: 16, fontWeight: '800', color: Colors.text },
  apptSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  apptDate: { fontSize: 13, color: Colors.primary, fontWeight: '700', marginTop: 4 },
  apptConfirmed: { alignItems: 'center', gap: 2 },
  apptConfirmedText: { fontSize: 10, color: Colors.green, fontWeight: '700' },

  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
  },
  alertIcon: { fontSize: 18 },
  alertText: { fontSize: 13, color: Colors.text, flex: 1, fontWeight: '500' },

  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 4 },

  histCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  histItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 8, gap: 12 },
  histBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  histIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  histInfo: { flex: 1 },
  histAction: { fontSize: 13, fontWeight: '700', color: Colors.text },
  histMeta: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  histDate: { fontSize: 11, color: Colors.textLight, fontWeight: '500' },

  bottomPad: { height: 28 },
});
