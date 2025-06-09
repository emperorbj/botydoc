import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useRouter } from 'expo-router';
// import DocumentPicker from 'react-native-document-picker';
import * as DocumentPicker from 'expo-document-picker';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import { uploadDocument, fetchDocuments } from '../../api/api';
import { Document } from '../../types/type';

export default function Docs() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const router = useRouter();

  // Fetch documents on mount
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await fetchDocuments();
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  
  const handleUpload = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
    });

    if (result.canceled) {
      console.log('User cancelled the picker');
      return;
    }

    setUploading(true);

    const file = {
      uri: result.assets && result.assets[0]?.uri,
      name: result.assets && result.assets[0]?.name || 'document.pdf',
      type: 'application/pdf',
    };

    const response = await uploadDocument(file);
    setSuccessMessage(`Document "${response.data.filename}" uploaded successfully!`);
    bottomSheetRef.current?.expand();

    await loadDocuments();
  } catch (error) {
    console.error('Upload error:', error);
    setSuccessMessage('Failed to upload document. Please try again.');
    bottomSheetRef.current?.expand();
  } finally {
    setUploading(false);
  }
};

  const renderDocumentCard = ({ item }: { item: Document }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/chat', params: { documentId: item.document_id, filename: item.filename } })}
    >
      <MaterialIcons name="picture-as-pdf" size={40} color="#FF0000" />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.filename}</Text>
        <Text style={styles.cardDate}>
          {new Date(item.upload_date).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload a PDF Document</Text>
      <TouchableOpacity
        style={[styles.uploadButton, uploading && styles.disabledButton]}
        onPress={handleUpload}
        disabled={uploading}
      >
        <Text style={styles.uploadButtonText}>
          {uploading ? 'Uploading...' : 'Select PDF'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={documents}
        renderItem={renderDocumentCard}
        keyExtractor={item => item.document_id}
        contentContainerStyle={styles.documentList}
        ListEmptyComponent={<Text style={styles.emptyText}>No documents uploaded yet.</Text>}
      />

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['25%']}
        enablePanDownToClose
        onClose={() => setSuccessMessage('')}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetText}>{successMessage}</Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    paddingTop:80
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  documentList: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardContent: {
    marginLeft: 10,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardDate: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  },
  bottomSheetContent: {
    padding: 20,
    alignItems: 'center',
  },
  bottomSheetText: {
    fontSize: 16,
    textAlign: 'center',
  },
});