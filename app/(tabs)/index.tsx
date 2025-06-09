
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import api from '../../api/api';
import { useRouter } from 'expo-router';
import DocumentUploader from '@/components/DocumentUploader';

type Document = {
  document_id: string | number;
  filename: string;
  upload_date: string;
};

export default function UploadScreen() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const router = useRouter();

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/documents');
      setDocuments(res.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
      if (file.canceled || !file.assets) {
        Alert.alert('Cancelled', 'No file selected');
        return;
      }

      const fileData = file.assets[0];
      const formData = new FormData();

      // Fetch file data as a Blob
      const response = await fetch(fileData.uri);
      const fileBlob = await response.blob();

      // Append the Blob to FormData with the filename
      formData.append('file', fileBlob, fileData.name || 'document.pdf');

      const res = await api.post('/upload-document/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', 'Document uploaded successfully');
      fetchDocuments();
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', `Failed to upload document: ${errorMessage}`);
    }
  };

  const renderDocCard = ({ item }: { item: Document }) => (
    <TouchableOpacity
      onPress={() => router.push({ pathname: '/(tabs)/chat', params: { id: String(item.document_id) } })}
      style={{
        backgroundColor: '#ffffff',
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 8,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: '100%', // Full width within container
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={require('../../assets/images/folders.png')}
          style={{ width: 40, height: 40, marginRight: 10 }}
        />
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.filename}</Text>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>
            {new Date(item.upload_date).toLocaleString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f3f4f6', // Light gray background
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center', // Center vertically
          alignItems: 'center', // Center horizontally
          padding: 16,
        }}
      >
        <View
          style={{
            width: '100%',
            maxWidth: 600, // Constrain width for larger screens
            alignItems: 'center', // Center children horizontally
          }}
        >
          {/* Upload Button */}
          <View
            style={{
              marginBottom: 16,
              width: '100%', // Full width of container
            }}
          >
            {/* <Button title="Upload PDF Document" onPress={handleUpload} /> */}
            <DocumentUploader onUploadSuccess={fetchDocuments} />
          </View>

          {/* Document List */}
          {documents.length > 0 ? (
            <FlatList
              data={documents}
              keyExtractor={(item) => item.document_id?.toString()}
              renderItem={renderDocCard}
              scrollEnabled={false} // Let ScrollView handle scrolling
              style={{ width: '100%' }} // Full width of container
            />
          ) : (
            <Text style={{ color: '#6b7280', fontSize: 16 }}>No documents available</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}