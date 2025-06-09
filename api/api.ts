import axios from 'axios';

const BASE_URL = 'https://docdb-ih1j.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to upload a document
export const uploadDocument = async (file: { uri: string; name: string; type: string }) => {
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.type || 'application/pdf',
  } as any);

  return api.post('/upload-document/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Function to fetch all documents
export const fetchDocuments = async () => {
  return api.get('/documents/');
};

// Function to query a document
export const queryDocument = async (documentId: string, query: string) => {
  return api.post('/query-document/', {
    document_id: documentId,
    query,
  });
};

export default api;