import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { chatbotService } from '../services/chatbotService';
import { useChatStore } from '../stores/useChatStore';
import { MarkdownText } from './MarkdownText';

export default function ChatBot() {
  const { messages, animatingId, addMessage, setAnimatingId } = useChatStore();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInputText('');
    setLoading(true);

    try {
      const result = await chatbotService.sendMessage(inputText);

      const botId = (Date.now() + 1).toString();
      const botMessage = {
        id: botId,
        text: result.success ? result.response || '' : result.error || 'An error occurred',
        isBot: true,
        timestamp: new Date(),
      };
      console.log('Bot Message:', botMessage);

      setAnimatingId(botId);
      addMessage(botMessage);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, an error occurred. Please try again.',
        isBot: true,
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const onClose = () => {
    router.back();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh - you can add actual refresh logic here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderMessage = ({ item }: { item: { id: string; text: string; isBot: boolean; timestamp: Date | string } }) => {
    const timestamp = typeof item.timestamp === 'string' ? new Date(item.timestamp) : item.timestamp;
    
    return (
      <View
        className={`max-w-[80%] p-3 rounded-2xl mb-3 ${
          item.isBot
            ? 'self-start bg-white rounded-bl-sm'
            : 'self-end bg-blue-500 rounded-br-sm'
        }`}
      >
        {item.isBot ? (
          <MarkdownText
            animate={item.id === animatingId}
            onDone={() => setAnimatingId(null)}
          >
            {item.text}
          </MarkdownText>
        ) : (
          <Text className="text-base leading-6 text-white">{item.text}</Text>
        )}
        <Text className={`text-xs mt-1 ${item.isBot ? 'text-gray-500' : 'text-gray-200'}`}>
          {timestamp.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-100"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <View className="flex-row items-center gap-2">
          <Ionicons name="chatbubbles" size={24} color="#007AFF" />
          <Text className="text-lg font-semibold text-black">Shopping Assistant</Text>
        </View>

        <TouchableOpacity onPress={onClose} className="p-1">
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
            removeClippedSubviews={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#007AFF"
              />
            }
          />

      {loading && (
        <View className="flex-row items-center p-3 bg-white">
          <ActivityIndicator size="small" color="#007AFF" />
          <Text className="ml-2 text-gray-600">Thinking...</Text>
        </View>
      )}

      <View 
        className="flex-row p-3 bg-white border-t border-gray-200"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <TextInput
          className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 mr-2 max-h-24 text-base"
          value={inputText}
          onChangeText={setInputText}
          placeholder="Enter your question..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          className={`w-11 h-11 rounded-full justify-center items-center ${
            inputText.trim() ? 'bg-blue-500' : 'bg-gray-300'
          }`}
          onPress={handleSend}
          disabled={!inputText.trim() || loading}
        >
          <Ionicons name="send" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}