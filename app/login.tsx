import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { getUser, setLoggedIn } from '../src/services/storage';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'E-mail obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'E-mail inválido';
    if (!password) e.password = 'Senha obrigatória';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await getUser();
      if (!user) {
        setErrors({ general: 'Nenhuma conta encontrada. Cadastre-se primeiro.' });
        return;
      }
      if (user.email !== email.trim().toLowerCase()) {
        setErrors({ email: 'E-mail não encontrado' });
        return;
      }
      if (user.password !== password) {
        setErrors({ password: 'Senha incorreta' });
        return;
      }
      await setLoggedIn(true);
      router.replace('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoWrap}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Bem-vindo de volta!</Text>
          <Text style={styles.subtitle}>Entre na sua conta para continuar</Text>

          {errors.general && (
            <View style={styles.generalError}>
              <Ionicons name="alert-circle" size={16} color={Colors.errorRed} />
              <Text style={styles.generalErrorText}>{errors.general}</Text>
            </View>
          )}

          {/* E-mail */}
          <Text style={styles.label}>E-mail</Text>
          <View style={[styles.inputWrap, errors.email ? styles.inputError : null]}>
            <Ionicons name="mail-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor={Colors.textLight}
              value={email}
              onChangeText={v => { setEmail(v); setErrors(p => ({ ...p, email: undefined, general: undefined })); }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* Senha */}
          <Text style={styles.label}>Senha</Text>
          <View style={[styles.inputWrap, errors.password ? styles.inputError : null]}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Sua senha"
              placeholderTextColor={Colors.textLight}
              value={password}
              onChangeText={v => { setPassword(v); setErrors(p => ({ ...p, password: undefined, general: undefined })); }}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(p => !p)} style={styles.eyeBtn}>
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={Colors.textLight}
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          {/* Botão entrar */}
          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
          </TouchableOpacity>

          {/* Link cadastro */}
          <View style={styles.linkRow}>
            <Text style={styles.linkText}>Não tem conta? </Text>
            <TouchableOpacity onPress={() => router.replace('/register')}>
              <Text style={styles.link}>Criar conta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 16, paddingBottom: 40 },

  logoWrap: { alignItems: 'center', marginBottom: 8 },
  logo: { width: 100, height: 100 },

  title: { fontSize: 26, fontWeight: '900', color: Colors.text, textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', marginBottom: 32 },

  generalError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginBottom: 16,
  },
  generalErrorText: { fontSize: 13, color: Colors.errorRed, flex: 1 },

  label: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 8, marginTop: 4 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    height: 54,
    marginBottom: 4,
  },
  inputError: { borderColor: Colors.errorRed },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: Colors.text },
  eyeBtn: { padding: 4 },
  errorText: { fontSize: 12, color: Colors.errorRed, marginBottom: 12, marginLeft: 4 },

  btn: {
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontSize: 17, fontWeight: '800', color: Colors.white },

  linkRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  linkText: { fontSize: 14, color: Colors.textSecondary },
  link: { fontSize: 14, fontWeight: '800', color: Colors.primary },
});
