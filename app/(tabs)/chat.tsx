import { useLocalSearchParams,useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import api from '../../api/api';

import { Ionicons } from '@expo/vector-icons'; // For send button icon
import COLORS from '@/constants/constants';

type ResponseData = {
  answer: string;
  context: string[];
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ResponseData | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
   const router = useRouter();


  console.log('Document ID:', id, 'Type:', typeof id);

  // Validate id
  const isValidId = id && typeof id === 'string' && id.trim() !== '';

 

  
console.log('Document ID:', id);
  const handleQuery = async () => {
    if (!query.trim()) return; // Prevent empty queries
     if (!isValidId) {
      console.log('Invalid ID during query attempt', { id });
      alert('Invalid document ID. Please upload a document.');
      return;
    }
    try {
      setLoading(true);
      const res = await api.post('/query-document/', {
        document_id: id,
        query,
      });
      setResponse(res.data);
      setQuery(''); // Clear input after submission
    } catch (err) {
      console.error('Query error:', err);
      alert('Failed to fetch response. Please try again.');
    } finally {
      setLoading(false); 
    }
  };

  // Auto-scroll to bottom when response changes
  useEffect(() => {
    if (response) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [response]);



   if (!isValidId) {
    console.log('Rendering invalid ID screen', { id, type: typeof id });
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#f3f4f6',
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}
      >
        <Image
          source={require('../../assets/images/smile.png')}
          style={{ width: 100, height: 100, marginBottom: 20 }}
        />
        <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            fontWeight: '600',
          }}
        >
          You must upload or click on uploaded docs.
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/docs')}
          style={{
            marginTop: 20,
            backgroundColor: COLORS.primary,
            padding: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Go to Documents</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }





  return (
    
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#f3f4f6', // Light gray background
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1, padding: 16 }}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {response ? (
            <View>
              {/* Answer Bubble */}
              <View
                style={{
                  backgroundColor: '#ffffff',
                  padding: 12,
                  borderRadius: 12,
                  marginBottom: 12,
                  maxWidth: '80%',
                  alignSelf: 'flex-start',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              >
                <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>
                  Answer:
                </Text>
                <Text style={{ fontSize: 14, color: '#1f2937' }}>{response.answer}</Text>
              </View>
              {/* Context Bubbles */}
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  marginBottom: 8,
                  color: '#1f2937',
                }}
              >
                Context:
              </Text>
              {response.context.map((c, i) => (
                <View
                  key={i}
                  style={{
                    backgroundColor: '#e5e7eb',
                    padding: 12,
                    borderRadius: 12,
                    marginBottom: 8,
                    maxWidth: '100%',
                    alignSelf: 'flex-start',
                  }}
                >
                  <Text style={{ fontSize: 12, color: '#4b5563' }}>- {c}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 16,
              }}
            >
              <Text style={{ fontSize: 16, color: '#6b7280' }}>
                Ask a question about the document to get started.
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Input Bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            padding: 12,
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
          }}
        >
          <TextInput
            style={{
              flex: 1,
              backgroundColor: '#f3f4f6',
              borderRadius: 20,
              paddingVertical: 8,
              paddingHorizontal: 16,
              fontSize: 14,
              marginRight: 8,
            }}
            placeholder="Ask something about the document..."
            value={query}
            onChangeText={setQuery}
          />
          <TouchableOpacity
            onPress={handleQuery}
            disabled={loading || !query.trim()}
            style={{
              backgroundColor: '#2563eb',
              borderRadius: 20,
              padding: 10,
            }}
          >{ loading ? 
            <ActivityIndicator size="small" color="#ffffff" />
          :
            <Ionicons name="send" size={20} color="#ffffff" />
          }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      
    </SafeAreaView>
    
  );
}