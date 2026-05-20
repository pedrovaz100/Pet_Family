import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ChatMessage } from '../types';
import { Colors } from '../constants/colors';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  const formatTime = (date: Date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAI]}>
      {!isUser && (
        <View style={styles.avatar}>
          <Image source={require('../../assets/logo.png')} style={styles.avatarImg} resizeMode="contain" />
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
        <Text style={[styles.text, isUser ? styles.textUser : styles.textAI]}>
          {message.text}
        </Text>
        <Text style={[styles.time, isUser ? styles.timeUser : styles.timeAI]}>
          {formatTime(new Date(message.timestamp))}
          {isUser && ' ✓✓'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 12,
    alignItems: 'flex-end',
  },
  rowUser: { justifyContent: 'flex-end' },
  rowAI: { justifyContent: 'flex-start' },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    marginBottom: 4,
    overflow: 'hidden',
  },
  avatarImg: { width: 24, height: 24 },
  bubble: {
    maxWidth: '75%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
  },
  textUser: { color: Colors.white },
  textAI: { color: Colors.text },
  time: { fontSize: 10, marginTop: 4 },
  timeUser: { color: 'rgba(255,255,255,0.7)', textAlign: 'right' },
  timeAI: { color: Colors.textLight },
});
