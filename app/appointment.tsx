import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { saveAppointment, getAppointment, getPet } from '../src/services/storage';
import { Appointment } from '../src/types';
import { Colors } from '../src/constants/colors';

const TYPES: { value: Appointment['type']; label: string; emoji: string; color: string }[] = [
  { value: 'preventive', label: 'Preventiva', emoji: '🛡️', color: Colors.primary },
  { value: 'vaccination', label: 'Vacinação', emoji: '💉', color: Colors.blue },
  { value: 'return', label: 'Retorno', emoji: '🔄', color: Colors.teal },
  { value: 'emergency', label: 'Emergência', emoji: '🚨', color: Colors.errorRed },
  { value: 'checkup', label: 'Check-up', emoji: '🔬', color: Colors.green },
];

const empty: Appointment = { tutorName: '', petName: '', type: 'preventive', date: '', time: '', notes: '' };

export default function AppointmentScreen() {
  const [form, setForm] = useState<Appointment>(empty);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [appt, pet] = await Promise.all([getAppointment(), getPet()]);
      if (appt) { setForm(appt); setConfirmed(true); }
      else if (pet) setForm(prev => ({ ...prev, petName: pet.name }));
    })();
  }, []);

  const update = (field: keyof Appointment, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setConfirmed(false);
  };

  const handleSave = async () => {
    if (!form.tutorName.trim() || !form.petName.trim() || !form.date.trim() || !form.time.trim()) {
      Alert.alert('Atenção', 'Preencha nome do tutor, pet, data e horário.');
      return;
    }
    setLoading(true);
    await saveAppointment(form);
    setLoading(false);
    setConfirmed(true);
    Alert.alert('✅ Agendado!', `Consulta de ${form.petName} marcada para ${form.date} às ${form.time}.`);
  };

  const selectedType = TYPES.find(t => t.value === form.type)!;
  const isFilled = form.tutorName && form.petName && form.date && form.time;

  const inputWrap = (field: string) => [
    styles.inputWrap,
    focused === field && styles.inputWrapFocused,
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.gradientEnd} />

      <LinearGradient
        colors={[Colors.gradientEnd, Colors.gradientStart]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGrad}
      >
        <Text style={styles.headerTitle}>Agendar Consulta</Text>
        <Text style={styles.headerSub}>Marque com seu veterinário preferido</Text>

        {/* Resumo em tempo real */}
        {isFilled && (
          <View style={styles.summaryPill}>
            <Text style={styles.summaryEmoji}>{selectedType.emoji}</Text>
            <View style={styles.summaryTexts}>
              <Text style={styles.summaryPet}>{form.petName}</Text>
              <Text style={styles.summaryDate}>{form.date} às {form.time} · {selectedType.label}</Text>
            </View>
            {confirmed && <Ionicons name="checkmark-circle" size={20} color={Colors.green} />}
          </View>
        )}
      </LinearGradient>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* ── TIPO DE CONSULTA ── */}
          <Text style={styles.sectionLabel}>Tipo de consulta</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
            {TYPES.map(t => (
              <TouchableOpacity
                key={t.value}
                style={[styles.typeChip, form.type === t.value && { backgroundColor: t.color, borderColor: t.color }]}
                onPress={() => update('type', t.value)}
                activeOpacity={0.8}
              >
                <Text style={styles.typeChipEmoji}>{t.emoji}</Text>
                <Text style={[styles.typeChipLabel, form.type === t.value && styles.typeChipLabelActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ── DADOS ── */}
          <Text style={styles.sectionLabel}>Dados do agendamento</Text>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Nome do tutor *</Text>
            <View style={inputWrap('tutor')}>
              <Ionicons name="person-outline" size={18} color={focused === 'tutor' ? Colors.primary : Colors.textLight} style={styles.icon} />
              <TextInput
                style={styles.inputInner}
                value={form.tutorName}
                onChangeText={v => update('tutorName', v)}
                placeholder="Seu nome completo"
                placeholderTextColor={Colors.textLight}
                onFocus={() => setFocused('tutor')}
                onBlur={() => setFocused(null)}
              />
            </View>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Nome do pet *</Text>
            <View style={inputWrap('pet')}>
              <Ionicons name="paw-outline" size={18} color={focused === 'pet' ? Colors.primary : Colors.textLight} style={styles.icon} />
              <TextInput
                style={styles.inputInner}
                value={form.petName}
                onChangeText={v => update('petName', v)}
                placeholder="Nome do seu pet"
                placeholderTextColor={Colors.textLight}
                onFocus={() => setFocused('pet')}
                onBlur={() => setFocused(null)}
              />
            </View>
          </View>

          <View style={styles.rowFields}>
            <View style={[styles.fieldWrap, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Data *</Text>
              <View style={inputWrap('date')}>
                <Ionicons name="calendar-outline" size={18} color={focused === 'date' ? Colors.primary : Colors.textLight} style={styles.icon} />
                <TextInput
                  style={styles.inputInner}
                  value={form.date}
                  onChangeText={v => update('date', v)}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor={Colors.textLight}
                  keyboardType="numeric"
                  onFocus={() => setFocused('date')}
                  onBlur={() => setFocused(null)}
                />
              </View>
            </View>
            <View style={[styles.fieldWrap, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Horário *</Text>
              <View style={inputWrap('time')}>
                <Ionicons name="time-outline" size={18} color={focused === 'time' ? Colors.primary : Colors.textLight} style={styles.icon} />
                <TextInput
                  style={styles.inputInner}
                  value={form.time}
                  onChangeText={v => update('time', v)}
                  placeholder="HH:MM"
                  placeholderTextColor={Colors.textLight}
                  keyboardType="numeric"
                  onFocus={() => setFocused('time')}
                  onBlur={() => setFocused(null)}
                />
              </View>
            </View>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Observações</Text>
            <View style={[inputWrap('notes'), styles.textareaWrap]}>
              <TextInput
                style={[styles.inputInner, styles.textareaInner]}
                value={form.notes}
                onChangeText={v => update('notes', v)}
                placeholder="Sintomas, medicamentos, dúvidas..."
                placeholderTextColor={Colors.textLight}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                onFocus={() => setFocused('notes')}
                onBlur={() => setFocused(null)}
              />
            </View>
          </View>

          {/* ── BOTÃO ── */}
          <TouchableOpacity
            style={[styles.saveBtn, loading && styles.saveBtnOff]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[Colors.primaryDark, Colors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveBtnGrad}
            >
              <Ionicons name={confirmed ? 'calendar' : 'calendar-outline'} size={20} color={Colors.white} />
              <Text style={styles.saveBtnText}>
                {loading ? 'Agendando...' : confirmed ? 'Reagendar Consulta' : 'Confirmar Agendamento'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* ── CONFIRMAÇÃO ── */}
          {confirmed && (
            <View style={styles.confirmCard}>
              <View style={styles.confirmIconBox}>
                <Ionicons name="checkmark-circle" size={28} color={Colors.green} />
              </View>
              <View style={styles.confirmInfo}>
                <Text style={styles.confirmTitle}>Consulta confirmada!</Text>
                <Text style={styles.confirmSub}>Você receberá confirmação em breve. Leve a carteira de vacinação do seu pet.</Text>
              </View>
            </View>
          )}

          <View style={styles.bottomPad} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.gradientEnd },
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16 },

  headerGrad: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: Colors.white },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 },

  summaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 14,
    gap: 10,
  },
  summaryEmoji: { fontSize: 22 },
  summaryTexts: { flex: 1 },
  summaryPet: { fontSize: 14, fontWeight: '800', color: Colors.white },
  summaryDate: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 1 },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
    marginTop: 20,
  },

  typeScroll: { marginBottom: 4, marginHorizontal: -4 },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  typeChipEmoji: { fontSize: 18 },
  typeChipLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  typeChipLabelActive: { color: Colors.white },

  fieldWrap: { marginBottom: 12 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 7 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    minHeight: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  inputWrapFocused: { borderColor: Colors.primary, shadowColor: Colors.primary, shadowOpacity: 0.15, elevation: 4 },
  icon: { marginRight: 10 },
  inputInner: { flex: 1, fontSize: 15, color: Colors.text, paddingVertical: 12 },
  textareaWrap: { alignItems: 'flex-start', paddingTop: 12, paddingBottom: 12 },
  textareaInner: { minHeight: 72, paddingVertical: 0 },
  rowFields: { flexDirection: 'row', gap: 12 },

  saveBtn: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  saveBtnOff: { opacity: 0.7 },
  saveBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  saveBtnText: { fontSize: 16, fontWeight: '800', color: Colors.white, letterSpacing: 0.3 },

  confirmCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.greenLight,
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.green + '44',
  },
  confirmIconBox: { marginTop: 2 },
  confirmInfo: { flex: 1 },
  confirmTitle: { fontSize: 14, fontWeight: '700', color: Colors.greenDark },
  confirmSub: { fontSize: 13, color: Colors.greenDark, marginTop: 3, lineHeight: 18, opacity: 0.85 },

  bottomPad: { height: 28 },
});
