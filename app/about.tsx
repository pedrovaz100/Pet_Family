import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const PURPLE = '#7C3AED';
const PURPLE_DARK = '#5B21B6';
const PURPLE_LIGHT = '#F3E8FF';
const BG = '#F8F5FF';
const WHITE = '#FFFFFF';
const TEXT = '#1F2937';
const MUTED = '#6B7280';
const BORDER = '#E9D5FF';

const MEMBERS = [
  { name: 'Pedro Vaz', rm: 'RM 566551', role: 'Desenvolvedor Full Stack', initials: 'PV' },
  { name: 'João Victor Luiz Oliveira Resende', rm: 'RM 565139', role: 'Desenvolvedor & UX Designer', initials: 'JV' },
];

const TECHS = [
  { name: 'React Native', desc: 'Framework mobile', icon: 'phone-portrait' },
  { name: 'Expo', desc: 'Ambiente de desenvolvimento', icon: 'rocket' },
  { name: 'TypeScript', desc: 'Código tipado', icon: 'code-slash' },
  { name: 'Expo Router', desc: 'Navegação entre telas', icon: 'map' },
  { name: 'AsyncStorage', desc: 'Persistência local', icon: 'save' },
];

const FEATURES = [
  'Acompanhamento preventivo personalizado',
  'Lembretes de vacinas, check-ups e consultas',
  'Assistente IA simulada para orientação veterinária',
  'Dashboard clínico com indicadores mockados',
  'Cadastro do pet com histórico e preferências',
  'Agendamento digital com confirmação',
];

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={PURPLE_DARK} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[PURPLE_DARK, PURPLE]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.logoCircle}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.heroTitle}>Pet Family</Text>
          <Text style={styles.heroSub}>
            Cuidado contínuo, preventivo e personalizado para pets.
          </Text>

          <View style={styles.heroBadge}>
            <Ionicons name="school" size={15} color={WHITE} />
            <Text style={styles.heroBadgeText}>Challenge CLYVO VET 2026</Text>
          </View>
        </LinearGradient>

        <View style={styles.sheet}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <Ionicons name="paw" size={20} color={PURPLE} />
              </View>
              <Text style={styles.cardTitle}>Sobre o projeto</Text>
            </View>

            <Text style={styles.cardText}>
              O <Text style={styles.bold}>Pet Family</Text> é um MVP criado para
              melhorar a continuidade do cuidado veterinário. A proposta conecta
              tutor, pet e clínica por meio de lembretes, acompanhamento preventivo,
              agendamento e uma IA simulada de apoio.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <Ionicons name="sparkles" size={20} color={PURPLE} />
              </View>
              <Text style={styles.cardTitle}>Nossa solução</Text>
            </View>

            {FEATURES.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={13} color={WHITE} />
                </View>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Tecnologias utilizadas</Text>

          <View style={styles.techGrid}>
            {TECHS.map((tech, index) => (
              <View key={index} style={styles.techCard}>
                <View style={styles.techIconBox}>
                  <Ionicons name={tech.icon as any} size={22} color={PURPLE} />
                </View>
                <Text style={styles.techName}>{tech.name}</Text>
                <Text style={styles.techDesc}>{tech.desc}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Equipe</Text>

          {MEMBERS.map((member, index) => (
            <View key={index} style={styles.memberCard}>
              <LinearGradient
                colors={[PURPLE_DARK, PURPLE]}
                style={styles.memberAvatar}
              >
                <Text style={styles.memberInitials}>{member.initials}</Text>
              </LinearGradient>

              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
              </View>

              <View style={styles.rmBadge}>
                <Text style={styles.rmText}>{member.rm}</Text>
              </View>
            </View>
          ))}

          <View style={styles.footer}>
            <View style={styles.footerIcon}>
              <Ionicons name="school" size={22} color={PURPLE} />
            </View>
            <Text style={styles.footerTitle}>Protótipo acadêmico</Text>
            <Text style={styles.footerText}>
              Desenvolvido para o Challenge FIAP 2026. MVP funcional com dados
              simulados, sem backend, sem WhatsApp real e sem IA real.
            </Text>
            <View style={styles.footerDivider} />
            <Text style={styles.footerVersion}>Pet Family v1.0.0 • FIAP 2026</Text>
          </View>

          <View style={styles.bottomPad} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: PURPLE_DARK,
  },
  scroll: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    paddingBottom: 0,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 52,
  },
  logoCircle: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
  },
  logo: {
    width: 116,
    height: 116,
  },
  heroTitle: {
    fontSize: 31,
    fontWeight: '900',
    color: WHITE,
    letterSpacing: 0.3,
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.84)',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 310,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
  },
  heroBadgeText: {
    fontSize: 12,
    color: WHITE,
    fontWeight: '800',
  },
  sheet: {
    backgroundColor: BG,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -26,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: PURPLE_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: TEXT,
  },
  cardText: {
    fontSize: 14,
    color: MUTED,
    lineHeight: 22,
  },
  bold: {
    fontWeight: '900',
    color: PURPLE,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: MUTED,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: TEXT,
    marginBottom: 12,
    marginTop: 4,
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  techCard: {
    width: '48%',
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: BORDER,
  },
  techIconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: PURPLE_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  techName: {
    fontSize: 14,
    fontWeight: '900',
    color: TEXT,
    marginBottom: 4,
  },
  techDesc: {
    fontSize: 12,
    color: MUTED,
    lineHeight: 16,
  },
  memberCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  memberAvatar: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberInitials: {
    fontSize: 16,
    fontWeight: '900',
    color: WHITE,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '900',
    color: TEXT,
  },
  memberRole: {
    fontSize: 12,
    color: MUTED,
    marginTop: 3,
  },
  rmBadge: {
    backgroundColor: PURPLE_LIGHT,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  rmText: {
    fontSize: 10,
    color: PURPLE,
    fontWeight: '900',
  },
  footer: {
    backgroundColor: WHITE,
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    marginTop: 4,
    borderWidth: 1,
    borderColor: BORDER,
  },
  footerIcon: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: PURPLE_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: TEXT,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 13,
    color: MUTED,
    textAlign: 'center',
    lineHeight: 20,
  },
  footerDivider: {
    width: 44,
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 14,
  },
  footerVersion: {
    fontSize: 11,
    color: MUTED,
    fontWeight: '600',
  },
  bottomPad: {
    height: 30,
  },
});