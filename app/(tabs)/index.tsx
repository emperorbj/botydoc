
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
  StyleSheet,
  Platform,
  StatusBar,
  Modal,
  ActivityIndicator
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import api from '../../api/api';
import { useRouter } from 'expo-router';
import DocumentUploader from '@/components/DocumentUploader';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/constants';
type Document = {
  document_id: string | number;
  filename: string;
  upload_date: string;
};

export default function UploadScreen() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const router = useRouter();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/documents');
      setDocuments(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // const handleUpload = async () => {
  //   try {
  //     const file = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
  //     if (file.canceled || !file.assets) {
  //       Alert.alert('Cancelled', 'No file selected');
  //       return;
  //     }

  //     const fileData = file.assets[0];
  //     const formData = new FormData();

  //     // Fetch file data as a Blob
  //     const response = await fetch(fileData.uri);
  //     const fileBlob = await response.blob();

  //     // Append the Blob to FormData with the filename
  //     formData.append('file', fileBlob, fileData.name || 'document.pdf');

  //     const res = await api.post('/upload-document/', formData, {
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     });

  //     Alert.alert('Success', 'Document uploaded successfully');
  //     fetchDocuments();
  //   } catch (error) {
  //     console.error('Upload error:', error);
  //     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  //     Alert.alert('Error', `Failed to upload document: ${errorMessage}`);
  //   }
  // };

  const handleDelete = async () => {
    if(!selectedDocumentId) return;
    try {
      await api.delete(`/documents/${selectedDocumentId}`);
      Alert.alert('Success', 'Document deleted successfully');
      fetchDocuments();
      setIsVisible(false); 
      setSelectedDocumentId(null);
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', `Failed to delete document: ${errorMessage}`);
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
        width: '100%', 
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center',paddingRight:10}}>
        <Image
          source={require('../../assets/images/folders.png')}
          style={{ width: 40, height: 40, marginRight: 10 }}
        />
        <View style={{ flexDirection: 'column',flex: 1 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 10 }}>{item.filename}</Text>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>
            {new Date(item.upload_date).toLocaleString()}
          </Text>
        </View>
        <TouchableOpacity style={{paddingHorizontal:8}}
        onPress={() =>
        {setIsVisible(true)
        setSelectedDocumentId(item.document_id)
        }}>
          <Ionicons
            name="trash-outline"
            size={20}
            color="#ef4444" 
            style={{ marginLeft: 'auto' }}
            
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
      
  )
  

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f3f4f6',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center', 
          padding: 16,
        }}
      >
        <View
          style={{
            width: '100%',
            maxWidth: 600, 
            alignItems: 'center', 
          }}
        >
          {/* Upload Button */}
          <View
            style={{
              marginBottom: 16,
              width: '100%', 
            }}
          >
            
            <DocumentUploader onUploadSuccess={fetchDocuments} />
          </View>

          {/* Document List */}
          {loading ? 
          (
            <ActivityIndicator size="large" color={COLORS.primary} />
          )
          : documents.length > 0 ? (
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
       <Modal
  visible={isVisible}
      
  animationType="slide"
  onRequestClose={() => setIsVisible(false)}
>
  <View
    style={styles.modalOverlay}
  >
    <View
      style={styles.modalContent}
    >
      <Text style={{ fontSize: 20, textAlign: 'center' }}>
        Do you really want to Logout😒?
      </Text>
      
      
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%', // Adjust width for buttons
          marginTop: 20,
        }}
      >
        <TouchableOpacity onPress={handleDelete}>
          <Text style={{ fontSize: 16, color: '#FFFFFF' ,borderWidth:1,
             borderColor:'#C70039',paddingHorizontal:40,paddingVertical:10,backgroundColor:'#C70039'
            ,shadowOffset:{width:0,height:2},shadowOpacity:0.3,shadowRadius:4,elevation:5,borderRadius:10}}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsVisible(false)}>
          <Text style={{ fontSize: 16, color: '#FFFFFF',borderWidth:1,
             borderColor:"blue",paddingHorizontal:40,paddingVertical:10,backgroundColor:"blue",
             shadowOffset:{width:0,height:2},shadowOpacity:0.3,shadowRadius:4,elevation:5,borderRadius:10}}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
    </View>
  );
}




const styles = StyleSheet.create({
    modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },

})