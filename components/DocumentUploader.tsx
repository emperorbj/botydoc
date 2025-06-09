

import React,{useState} from 'react';
import { View, Alert, Text, TouchableOpacity, Image,ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import api from '../api/api';

type Props = {
  onUploadSuccess: () => void;
};

export default function DocumentUploader({ onUploadSuccess }: Props) {
const [loading, setLoading] = useState(false);

const handleUpload = async () => {
  try {
    setLoading(true); 
    const file = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (file.canceled || !file.assets) {
      Alert.alert('Cancelled', 'No file selected');
      return;
    }

    const fileData = file.assets[0];
    console.log('Selected file:', {
      uri: fileData.uri,
      name: fileData.name,
      mimeType: fileData.mimeType,
      size: fileData.size,
    });

    const formData = new FormData();
    formData.append('file', {
      uri: fileData.uri,
      name: fileData.name || 'document.pdf',
      type: fileData.mimeType || 'application/pdf',
    } as any);
    console.log('FormData prepared with file:', fileData.name || 'document.pdf');

    const res = await api.post('/upload-document/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log('Upload response:', res.data);
    Alert.alert('Success', 'Document uploaded successfully');
    onUploadSuccess();
  } catch (error: any) {
    console.error('Upload error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';
    Alert.alert('Error', `Failed to upload document: ${errorMessage}`);
  } finally {
      setLoading(false); // Stop loading
    }
};



  return (
    <TouchableOpacity
      onPress={handleUpload}
        disabled={loading}
      style={{
        backgroundColor: '#e0f2fe',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#0284c7',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
      }}
    >{loading ?
        <ActivityIndicator size="large" color="#0284c7" />
      :<Image
        source={require('../assets/images/upload.png')}
        style={{ width: 64, height: 64, marginBottom: 12, tintColor: '#0284c7' }}
      />
      }
      {loading ? 
        <Text style={{ fontSize: 16, color: '#0284c7', fontWeight: '500' }}>
        uploading...
      </Text>
        :<Text style={{ fontSize: 16, color: '#0284c7', fontWeight: '600' }}>
        Tap to Upload PDF
      </Text>
      }
    </TouchableOpacity>
  );
}