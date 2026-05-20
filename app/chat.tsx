import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ChatBubble } from '../src/components/ChatBubble';
import { getPet } from '../src/services/storage';
import { ChatMessage } from '../src/types';
import { Colors } from '../src/constants/colors';


let msgId = 1;
const newId = () => String(msgId++);

const getAIResponse = (text: string, petName: string): string => {
  const lower = text.toLowerCase();
  const name = petName || 'seu pet';

  if (lower.includes('vacina') || lower.includes('vacinação')) {
    return `Boa pergunta sobre vacinação! Para ${name}, as vacinas essenciais incluem a V10 (polivalente) e a antirrábica, aplicadas anualmente. Filhotes precisam do esquema inicial com reforços a cada 21-28 dias. Manter o cartão de vacinas em dia é fundamental para a saúde preventiva!`;
  }
  if (lower.includes('vermífugo') || lower.includes('verme') || lower.includes('vermifugação')) {
    return `Vermifugação é super importante para ${name}! Recomendamos a cada 3 meses para adultos. Filhotes devem ser vermifugados com 2, 4, 6 e 8 semanas, depois trimestral. Use sempre produto indicado pelo veterinário.`;
  }
  if (lower.includes('check-up') || lower.includes('checkup') || lower.includes('exame')) {
    return `O check-up anual é essencial para ${name}! Inclui avaliação clínica, exames de sangue, urina e fezes — detecta doenças precocemente. Pets acima de 7 anos devem fazer a cada 6 meses. Saúde preventiva salva vidas!`;
  }
  if (lower.includes('doente') || lower.includes('vomitando') || lower.includes('sem comer') || lower.includes('triste') || lower.includes('mal')) {
    return `Fico preocupado com ${name}! Esses sintomas merecem atenção imediata. Leve ${name} à clínica o quanto antes — não espere piorar. Se for urgente, procure um pronto-socorro veterinário. Quer agendar agora?`;
  }
  if (lower.includes('consulta') || lower.includes('agendar') || lower.includes('marcar')) {
    return `Claro! Vá na aba "Consulta" para agendar com ${name}. Temos horários de segunda a sábado, 8h–18h. Há urgência no atendimento?`;
  }
  if (lower.includes('ração') || lower.includes('alimentação') || lower.includes('comida')) {
    return `A alimentação de ${name} é crucial! Ração premium adequada à espécie, porte e fase de vida. Evite uva, cebola, chocolate e xilitol — são tóxicos para pets.`;
  }
  if (lower.includes('banho') || lower.includes('tosa') || lower.includes('higiene')) {
    return `Higiene é saúde! Cães: banho a cada 15-30 dias. Gatos se higienizam sozinhos. Não esqueça: limpeza dos ouvidos, corte de unhas e escovação dos dentes!`;
  }
  if (lower.includes('olá') || lower.includes('oi') || lower.includes('bom dia') || lower.includes('boa')) {
    return `Olá! Sou o Assistente Pet Family, aqui para cuidar de ${name}! Pergunte sobre vacinas, vermífugo, check-up, alimentação ou sintomas. Como posso ajudar?`;
  }
  return `Entendo sua preocupação com ${name}! Pergunte sobre vacinas, vermífugo, check-up, alimentação ou sintomas. Para urgências, recomendo consultar nosso veterinário.`;
};

const QUICK_REPLIES = [
  { label: 'Vacina', key: 'vacina' },
  { label: 'Vermífugo', key: 'vermifugo' },
  { label: 'Check-up', key: 'check-up' },
  { label: 'Sintomas', key: 'doente' },
  { label: 'Agendar', key: 'consulta' },
];

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [petName, setPetName] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    (async () => {
      const pet = await getPet();
      const name = pet?.name || '';
      setPetName(name);
      setMessages([{
        id: '0',
        text: name
          ? `Olá! Vejo que você cuida de **${name}**! Sou o Assistente Pet Family. Pergunte sobre vacinação, vermifugação, check-ups e muito mais. Como posso ajudar hoje?`
          : `Olá! Sou o Assistente Pet Family com IA veterinária preventiva. Pergunte sobre vacinas, vermífugo, check-up ou sintomas!`,
        sender: 'ai',
        timestamp: new Date(),
      }]);
    })();
  }, []);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg) return;

    const userMsg: ChatMessage = { id: newId(), text: msg, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: newId(),
        text: getAIResponse(msg, petName),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900 + Math.random() * 600);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.gradientEnd} />

      {/* ── HEADER ── */}
      <LinearGradient
        colors={[Colors.gradientEnd, Colors.gradientStart]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.white} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.aiAvatar}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.aiAvatarImg}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={styles.headerTitle}>Assistente Pet Family</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>
                {petName ? `Cuidando de ${petName} • Online` : 'Online agora'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.headerRight} />
      </LinearGradient>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ── MENSAGENS ── */}
        <ImageBackground
          source={require('../assets/Papel_de_parede.png')}
          style={styles.list}
          resizeMode="cover"
        >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          style={{ flex: 1 }}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={
            isTyping ? (
              <View style={styles.typingRow}>
                <View style={styles.typingAvatar}>
                  <Image source={require('../assets/logo.png')} style={{ width: 20, height: 20 }} resizeMode="contain" />
                </View>
                <View style={styles.typingBubble}>
                  <View style={styles.dotsRow}>
                    <View style={[styles.dot, styles.dot1]} />
                    <View style={[styles.dot, styles.dot2]} />
                    <View style={[styles.dot, styles.dot3]} />
                  </View>
                </View>
              </View>
            ) : null
          }
        />
        </ImageBackground>

        {/* ── QUICK REPLIES ── */}
        <View style={styles.quickWrap}>
          <FlatList
            horizontal
            data={QUICK_REPLIES}
            keyExtractor={item => item.key}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.quickBtn} onPress={() => send(item.key)} activeOpacity={0.75}>
                <Text style={styles.quickText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickList}
          />
        </View>

        {/* ── INPUT ── */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Digite sua dúvida..."
            placeholderTextColor={Colors.textLight}
            multiline
            returnKeyType="send"
            onSubmitEditing={() => send()}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnOff]}
            onPress={() => send()}
            disabled={!input.trim()}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={input.trim() ? [Colors.primaryDark, Colors.primary] : [Colors.border, Colors.border]}
              style={styles.sendBtnGrad}
            >
              <Ionicons name="send" size={18} color={input.trim() ? Colors.white : Colors.textLight} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.gradientEnd },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 10, gap: 10 },
  aiAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
  },
  aiAvatarImg: { width: 38, height: 38 },
  headerTitle: { fontSize: 15, fontWeight: '800', color: Colors.white },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.green },
  onlineText: { fontSize: 11, color: 'rgba(255,255,255,0.8)' },
  headerRight: { width: 36 },

  list: { flex: 1, backgroundColor: '#EDE8F5' },
  listContent: { paddingVertical: 16 },

  typingRow: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, marginBottom: 8 },
  typingAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    overflow: 'hidden',
  },
  typingBubble: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  dotsRow: { flexDirection: 'row', gap: 4, alignItems: 'center', height: 16 },
  dot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.primary },
  dot1: { opacity: 0.4 },
  dot2: { opacity: 0.7 },
  dot3: { opacity: 1 },

  quickWrap: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: 8,
  },
  quickList: { paddingHorizontal: 12, gap: 8 },
  quickBtn: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: Colors.primary + '33',
  },
  quickText: { fontSize: 12, color: Colors.primary, fontWeight: '700' },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.text,
    maxHeight: 100,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  sendBtn: { borderRadius: 24, overflow: 'hidden' },
  sendBtnOff: { opacity: 0.5 },
  sendBtnGrad: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
