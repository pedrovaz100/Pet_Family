import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPet, getAppointment } from '../src/services/storage';
import { Pet, Appointment } from '../src/types';

const { width } = Dimensions.get('window');
const CARD_W = (width - 44) / 2;

const PURPLE = '#7C3AED';
const PURPLE_DARK = '#5B21B6';
const PURPLE_LIGHT = '#F3E8FF';
const BG = '#F8F5FF';
const TEXT = '#1F2937';
const MUTED = '#6B7280';
const BORDER = '#E9D5FF';

const CATEGORIES = [
  { label: 'Meu Pet', icon: 'paw', route: '/pet-register' },
  { label: 'Lembretes', icon: 'notifications', route: '/agenda' },
  { label: 'Chat IA', icon: 'chatbubbles', route: '/chat' },
  { label: 'Consulta', icon: 'medical', route: '/appointment' },
  { label: 'Clínica', icon: 'stats-chart', route: '/dashboard' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [pet, setPet] = useState<Pet | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [p, a] = await Promise.all([getPet(), getAppointment()]);
        setPet(p);
        setAppointment(a);
      })();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={PURPLE} />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[PURPLE_DARK, PURPLE]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>
                Olá, {pet?.name ? `tutor de ${pet.name}` : 'Tutor'}
              </Text>
              <Text style={styles.headerSub}>Cuidado contínuo para seu pet</Text>
            </View>

            <TouchableOpacity onPress={() => router.push('/about')} style={styles.logoBox}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.mainCard}
            activeOpacity={0.9}
            onPress={() => router.push('/pet-register')}
          >
            <View style={styles.petAvatar}>
              <Image
                source={require('../assets/avatarPet-.png')}
                style={styles.petAvatarImg}
                resizeMode="contain"
              />
            </View>

            <View style={styles.mainCardText}>
              <Text style={styles.mainCardTitle}>
                {pet ? pet.name : 'Cadastre seu pet'}
              </Text>
              <Text style={styles.mainCardSub}>
                {pet
                  ? `${pet.breed || 'SRD'} • ${pet.age || '0'} anos`
                  : 'Personalize lembretes e cuidados'}
              </Text>
            </View>

            <View style={styles.arrowCircle}>
              <Ionicons name="arrow-forward" size={18} color={PURPLE} />
            </View>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Acesso rápido</Text>

          <View style={styles.quickGrid}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.label}
                style={styles.quickItem}
                onPress={() => router.push(cat.route as any)}
                activeOpacity={0.8}
              >
                <View style={styles.quickIcon}>
                  <Ionicons name={cat.icon as any} size={23} color={PURPLE} />
                </View>
                <Text style={styles.quickLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Para o seu pet</Text>

          <View style={styles.cardRow}>
            <TouchableOpacity
              style={styles.infoCard}
              activeOpacity={0.88}
              onPress={() => router.push('/agenda')}
            >
              <LinearGradient
                colors={['#6D28D9', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.infoGradient}
              >
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Preventivo</Text>
                </View>
                <Text style={styles.infoTitle}>Cuidados{'\n'}em dia</Text>
                <Text style={styles.infoSub}>Vacinas e lembretes</Text>
                <View style={styles.infoIconCircle}>
                  <Ionicons name="shield-checkmark" size={28} color="#FFFFFF" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.infoCard}
              activeOpacity={0.88}
              onPress={() => router.push('/appointment')}
            >
              <LinearGradient
                colors={['#7C3AED', '#A855F7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.infoGradient}
              >
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Consulta</Text>
                </View>
                <Text style={styles.infoTitle}>Agende{'\n'}check-up</Text>
                <Text style={styles.infoSub}>Acompanhamento</Text>
                <View style={styles.infoIconCircle}>
                  <Ionicons name="calendar" size={28} color="#FFFFFF" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.aiCard}
            onPress={() => router.push('/chat')}
            activeOpacity={0.9}
          >
            <View style={styles.aiIcon}>
              <Text style={styles.aiText}>IA</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiTitle}>Assistente Veterinário</Text>
              <Text style={styles.aiSub}>Tire dúvidas sobre saúde e prevenção</Text>
            </View>
            <Ionicons name="chatbubble-ellipses" size={24} color={PURPLE} />
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Próximos cuidados</Text>

          <View style={styles.alertCard}>
            <View style={styles.alertIcon}>
              <Text style={styles.alertEmoji}>💉</Text>
            </View>
            <View style={styles.alertInfo}>
              <Text style={styles.alertTitle}>
                {pet ? `Vacina de ${pet.name}` : 'Vacina pendente'}
              </Text>
              <Text style={styles.alertDate}>Vence em 15/05/2026</Text>
            </View>
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeText}>Pendente</Text>
            </View>
          </View>

          <View style={styles.alertCard}>
            <View style={styles.alertIcon}>
              <Text style={styles.alertEmoji}>🔬</Text>
            </View>
            <View style={styles.alertInfo}>
              <Text style={styles.alertTitle}>Check-up anual</Text>
              <Text style={styles.alertDate}>Recomendado para junho</Text>
            </View>
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeText}>Em breve</Text>
            </View>
          </View>

          {appointment && (
            <View style={styles.alertCard}>
              <View style={styles.alertIcon}>
                <Text style={styles.alertEmoji}>📅</Text>
              </View>
              <View style={styles.alertInfo}>
                <Text style={styles.alertTitle}>{appointment.petName}</Text>
                <Text style={styles.alertDate}>
                  {appointment.date} às {appointment.time}
                </Text>
              </View>
              <View style={styles.alertBadge}>
                <Text style={styles.alertBadgeText}>Agendado</Text>
              </View>
            </View>
          )}

          <View style={styles.bottomPad} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: PURPLE,
  },
  scroll: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  headerSub: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 14,
    marginTop: 4,
  },
  logoBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 48,
    height: 48,
  },
  mainCard: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,
  },
  petAvatar: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  petAvatarImg: {
    width: 72,
    height: 72,
  },
  mainCardText: {
    flex: 1,
  },
  mainCardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: TEXT,
  },
  mainCardSub: {
    fontSize: 13,
    color: MUTED,
    marginTop: 3,
  },
  arrowCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: PURPLE_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 22,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: TEXT,
    marginBottom: 14,
  },
  quickGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  quickItem: {
    alignItems: 'center',
    width: (width - 32) / 5,
  },
  quickIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  quickLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: MUTED,
    textAlign: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  infoCard: {
    width: CARD_W,
    borderRadius: 22,
    overflow: 'hidden',
  },
  infoGradient: {
    minHeight: 182,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 72,
    justifyContent: 'flex-start',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.24)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 22,
    marginTop: 12,
  },
  infoSub: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 12,
    marginTop: 5,
  },
  infoIconCircle: {
    position: 'absolute',
    bottom: 14,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 26,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  aiIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: PURPLE_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  aiText: {
    color: PURPLE,
    fontSize: 15,
    fontWeight: '900',
  },
  aiTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: TEXT,
  },
  aiSub: {
    fontSize: 12,
    color: MUTED,
    marginTop: 3,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: BORDER,
  },
  alertIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: PURPLE_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertEmoji: {
    fontSize: 22,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: TEXT,
  },
  alertDate: {
    fontSize: 12,
    color: MUTED,
    marginTop: 3,
  },
  alertBadge: {
    backgroundColor: PURPLE_LIGHT,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  alertBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: PURPLE,
  },
  bottomPad: {
    height: 30,
  },
});