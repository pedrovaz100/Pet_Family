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
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../src/components/Button';
import { savePet, getPet, removePet } from '../src/services/storage';
import { Pet } from '../src/types';
import { Colors } from '../src/constants/colors';

const { width } = Dimensions.get('window');

const SPECIES: { value: Pet['species']; label: string; emoji: string }[] = [
  { value: 'dog', label: 'Cão', emoji: '🐶' },
  { value: 'cat', label: 'Gato', emoji: '🐱' },
  { value: 'other', label: 'Outro', emoji: '🐾' },
];

const empty: Pet = {
  name: '',
  species: 'dog',
  breed: '',
  age: '',
  weight: '',
  healthNotes: '',
  specialConditions: '',
};

export default function PetRegisterScreen() {
  const [pet, setPet] = useState<Pet>(empty);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const stored = await getPet();
      if (stored) { setPet(stored); setSaved(true); }
    })();
  }, []);

  const update = (field: keyof Pet, value: string) => {
    setPet(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!pet.name.trim()) { Alert.alert('Atenção', 'Informe o nome do pet.'); return; }
    setLoading(true);
    await savePet(pet);
    setLoading(false);
    setSaved(true);
    Alert.alert('✅ Salvo!', `${pet.name} foi cadastrado com sucesso!`);
  };

  const handleClear = () => {
    Alert.alert('Limpar dados', 'Deseja remover o pet cadastrado?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: async () => { await removePet(); setPet(empty); setSaved(false); } },
    ]);
  };

  const speciesObj = SPECIES.find(s => s.value === pet.species)!;

  const inputStyle = (field: string) => [
    styles.input,
    focusedField === field && styles.inputFocused,
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
        <Text style={styles.headerTitle}>Cadastro do Pet</Text>
        <Text style={styles.headerSub}>Personaliza todo o acompanhamento</Text>

        {/* Preview flutuante */}
        {pet.name.length > 0 && (
          <View style={styles.previewPill}>
            <Text style={styles.previewEmoji}>{speciesObj.emoji}</Text>
            <Text style={styles.previewName}>{pet.name}</Text>
            {pet.breed ? <Text style={styles.previewBreed}> · {pet.breed}</Text> : null}
            {saved && (
              <View style={styles.savedDot}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.green} />
              </View>
            )}
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

          {/* ── ESPÉCIE ── */}
          <Text style={styles.sectionLabel}>Tipo de animal</Text>
          <View style={styles.speciesRow}>
            {SPECIES.map(s => (
              <TouchableOpacity
                key={s.value}
                style={[styles.speciesBtn, pet.species === s.value && styles.speciesBtnActive]}
                onPress={() => update('species', s.value)}
                activeOpacity={0.8}
              >
                <Text style={styles.speciesEmoji}>{s.emoji}</Text>
                <Text style={[styles.speciesLabel, pet.species === s.value && styles.speciesLabelActive]}>
                  {s.label}
                </Text>
                {pet.species === s.value && (
                  <View style={styles.speciesCheck}>
                    <Ionicons name="checkmark" size={12} color={Colors.white} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* ── CAMPOS ── */}
          <Text style={styles.sectionLabel}>Informações básicas</Text>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Nome do pet *</Text>
            <View style={[styles.inputWrap, focusedField === 'name' && styles.inputWrapFocused]}>
              <Ionicons name="paw-outline" size={18} color={focusedField === 'name' ? Colors.primary : Colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.inputInner}
                value={pet.name}
                onChangeText={v => update('name', v)}
                placeholder="Ex: Rex, Luna, Mimi..."
                placeholderTextColor={Colors.textLight}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Raça</Text>
            <View style={[styles.inputWrap, focusedField === 'breed' && styles.inputWrapFocused]}>
              <Ionicons name="ribbon-outline" size={18} color={focusedField === 'breed' ? Colors.primary : Colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.inputInner}
                value={pet.breed}
                onChangeText={v => update('breed', v)}
                placeholder="Ex: Golden Retriever, SRD..."
                placeholderTextColor={Colors.textLight}
                onFocus={() => setFocusedField('breed')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          <View style={styles.rowFields}>
            <View style={[styles.fieldWrap, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Idade (anos)</Text>
              <View style={[styles.inputWrap, focusedField === 'age' && styles.inputWrapFocused]}>
                <Ionicons name="calendar-outline" size={18} color={focusedField === 'age' ? Colors.primary : Colors.textLight} style={styles.inputIcon} />
                <TextInput
                  style={styles.inputInner}
                  value={pet.age}
                  onChangeText={v => update('age', v)}
                  placeholder="Ex: 3"
                  placeholderTextColor={Colors.textLight}
                  keyboardType="numeric"
                  onFocus={() => setFocusedField('age')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>
            <View style={[styles.fieldWrap, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Peso (kg)</Text>
              <View style={[styles.inputWrap, focusedField === 'weight' && styles.inputWrapFocused]}>
                <Ionicons name="barbell-outline" size={18} color={focusedField === 'weight' ? Colors.primary : Colors.textLight} style={styles.inputIcon} />
                <TextInput
                  style={styles.inputInner}
                  value={pet.weight}
                  onChangeText={v => update('weight', v)}
                  placeholder="Ex: 12.5"
                  placeholderTextColor={Colors.textLight}
                  keyboardType="decimal-pad"
                  onFocus={() => setFocusedField('weight')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>
          </View>

          <Text style={styles.sectionLabel}>Saúde e condições</Text>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Observações de saúde</Text>
            <View style={[styles.inputWrap, styles.textareaWrap, focusedField === 'healthNotes' && styles.inputWrapFocused]}>
              <TextInput
                style={[styles.inputInner, styles.textareaInner]}
                value={pet.healthNotes}
                onChangeText={v => update('healthNotes', v)}
                placeholder="Alergias, medicamentos, cirurgias..."
                placeholderTextColor={Colors.textLight}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                onFocus={() => setFocusedField('healthNotes')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Condições especiais</Text>
            <View style={[styles.inputWrap, styles.textareaWrap, focusedField === 'special' && styles.inputWrapFocused]}>
              <TextInput
                style={[styles.inputInner, styles.textareaInner]}
                value={pet.specialConditions}
                onChangeText={v => update('specialConditions', v)}
                placeholder="Preferências alimentares, comportamentos..."
                placeholderTextColor={Colors.textLight}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                onFocus={() => setFocusedField('special')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          {/* ── BOTÕES ── */}
          <TouchableOpacity
            style={[styles.saveBtn, loading && styles.saveBtnLoading]}
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
              {loading ? (
                <Text style={styles.saveBtnText}>Salvando...</Text>
              ) : (
                <>
                  <Ionicons name="save-outline" size={20} color={Colors.white} />
                  <Text style={styles.saveBtnText}>Salvar Pet</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearBtn} onPress={handleClear} activeOpacity={0.8}>
            <Ionicons name="trash-outline" size={18} color={Colors.errorRed} />
            <Text style={styles.clearBtnText}>Limpar dados salvos</Text>
          </TouchableOpacity>

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

  headerGrad: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  headerTitle: { fontSize: 24, fontWeight: '900', color: Colors.white },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  previewPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 14,
    alignSelf: 'flex-start',
  },
  previewEmoji: { fontSize: 18, marginRight: 6 },
  previewName: { fontSize: 14, fontWeight: '700', color: Colors.white },
  previewBreed: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  savedDot: { marginLeft: 6 },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
    marginTop: 20,
  },

  speciesRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  speciesBtn: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  speciesBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  speciesEmoji: { fontSize: 28, marginBottom: 6 },
  speciesLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  speciesLabelActive: { color: Colors.primary },
  speciesCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

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
  inputIcon: { marginRight: 10 },
  inputInner: { flex: 1, fontSize: 15, color: Colors.text, paddingVertical: 12 },
  textareaWrap: { alignItems: 'flex-start', paddingTop: 12, paddingBottom: 12 },
  textareaInner: { minHeight: 72, paddingVertical: 0 },
  rowFields: { flexDirection: 'row', gap: 12 },

  // Input aliases (unused - removed)
  input: {},
  inputFocused: {},

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
  saveBtnLoading: { opacity: 0.7 },
  saveBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  saveBtnText: { fontSize: 16, fontWeight: '800', color: Colors.white, letterSpacing: 0.3 },

  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
    paddingVertical: 12,
  },
  clearBtnText: { fontSize: 14, color: Colors.errorRed, fontWeight: '600' },

  bottomPad: { height: 28 },
});
