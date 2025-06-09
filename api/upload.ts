import api from './api'; // base axios instance

export const uploadDocument = async (fileUri: string, name: string) => {
  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    type: 'application/pdf',
    name,
  } as any);
  const res = await api.post('/upload-document/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getDocuments = async () => {
  const res = await api.get('/documents/');
  return res.data;
};

export const queryDocument = async (document_id: string, query: string) => {
  const res = await api.post('/query-document/', { document_id, query });
  return res.data;
};
