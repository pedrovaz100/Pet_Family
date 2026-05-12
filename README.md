# 🐾 Pet Family

> Sistema de Cuidado Contínuo para Pets — Challenge CLYVO VET 2026

---

## 📋 Objetivo

O **Pet Family** é um MVP mobile desenvolvido para resolver a falta de continuidade no cuidado de saúde dos pets. A plataforma conecta tutores, pets e clínicas veterinárias, promovendo o acompanhamento preventivo e a recorrência de consultas.

---

## 😟 Problema Resolvido

Hoje, muitos tutores só procuram a clínica em emergências ou em gatilhos óbvios como vacinação. Isso gera:

- Baixa recorrência e perda de acompanhamento preventivo
- Menor LTV (Lifetime Value) para clínicas veterinárias
- Vínculo fraco entre tutor, pet e clínica
- Saúde preventiva negligenciada

---

## ✅ Solução Proposta

O Pet Family cria um ecossistema de cuidado contínuo com:

- **Acompanhamento preventivo** com lembretes personalizados
- **Assistente IA** estilo WhatsApp para orientação veterinária
- **Cadastro do pet** com histórico de saúde
- **Agendamento de consultas** com resumo em tempo real
- **Dashboard clínico** com KPIs de retenção e adesão

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| React Native | 0.74.5 | Framework mobile |
| Expo | ~51.0 | Plataforma e toolchain |
| TypeScript | ^5.3 | Tipagem estática |
| Expo Router | ~3.5 | Navegação file-based |
| AsyncStorage | 1.23.1 | Persistência local |
| @expo/vector-icons | ^14.0 | Ícones |

---

## 🖥️ Funcionalidades

- ✅ Cadastro completo de pets (nome, espécie, raça, idade, peso, saúde)
- ✅ Preview em tempo real enquanto o usuário digita
- ✅ Assistente IA simulado com respostas contextuais
- ✅ Chat estilo WhatsApp com bolhas e timestamps
- ✅ Agenda de cuidados com status (pendente, concluído, recomendado)
- ✅ Agendamento de consultas com resumo dinâmico
- ✅ Dashboard clínico com KPIs mockados
- ✅ Persistência com AsyncStorage
- ✅ Navegação em tabs com 7 rotas
- ✅ Design moderno e responsivo

---

## 📱 Telas

| Tela | Descrição |
|---|---|
| **Home** | Visão geral da jornada do pet, ações rápidas |
| **Meu Pet** | Cadastro e edição do pet com preview live |
| **Assistente** | Chat IA estilo WhatsApp com respostas simuladas |
| **Agenda** | Lembretes de vacinação, vermifugação, check-up etc |
| **Consulta** | Agendamento com formulário e confirmação |
| **Dashboard** | Visão clínica com KPIs, alertas e histórico |
| **Sobre** | Informações do projeto e equipe |

---

## 🚀 Como Rodar

### Pré-requisitos

- Node.js 18+
- Expo CLI
- Expo Go no celular (iOS ou Android)

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar o servidor Expo
npx expo start
```

Escaneie o QR Code com o app **Expo Go** (disponível na App Store e Google Play).

---

## 🤖 IA Simulada — Como Funciona

O assistente IA não usa nenhuma API externa. As respostas são geradas localmente com base em palavras-chave detectadas na mensagem do usuário:

| Palavra-chave | Resposta sobre |
|---|---|
| `vacina`, `vacinação` | Esquema vacinal, V10, antirrábica |
| `vermífugo`, `verme` | Frequência de vermifugação |
| `check-up`, `exame` | Consulta preventiva anual |
| `doente`, `vomitando`, `sem comer`, `triste` | Orientação para ir à clínica |
| `consulta`, `agendar` | Sugestão de agendamento |
| `ração`, `alimentação` | Nutrição e alimentos proibidos |
| `banho`, `tosa`, `higiene` | Cuidados de higiene |
| Não reconhecida | Resposta empática genérica |

A IA usa o **nome do pet salvo no AsyncStorage** para personalizar as mensagens.

---

## 💾 AsyncStorage — Como Funciona

O serviço `src/services/storage.ts` centraliza toda a persistência:

```typescript
// Salvar pet
savePet(pet: Pet): Promise<void>

// Buscar pet salvo
getPet(): Promise<Pet | null>

// Remover pet
removePet(): Promise<void>

// Salvar consulta
saveAppointment(appointment: Appointment): Promise<void>

// Buscar consulta
getAppointment(): Promise<Appointment | null>
```

**Chaves usadas:**
- `@petfamily:pet` — dados do pet cadastrado
- `@petfamily:appointment` — consulta agendada

Os dados são carregados automaticamente ao abrir cada tela usando `useEffect` e `useFocusEffect`.

---

## 👥 Integrantes

| Nome | RM | Papel |
|---|---|---|
| **Pedro Vaz** | RM 566551 | Desenvolvedor Full Stack |
| **João Victor Luiz Oliveira Resende** | RM 565139 | Desenvolvedor & UX Designer |

---

## 🏫 Contexto Acadêmico

> Protótipo acadêmico desenvolvido para o **Challenge FIAP 2026**

Este é um MVP funcional com dados simulados. Nenhuma IA real, backend ou integração externa foi utilizada. Todos os dados são armazenados localmente no dispositivo usando AsyncStorage.

---

*Pet Family v1.0.0 · FIAP 2026 · Challenge CLYVO VET*
