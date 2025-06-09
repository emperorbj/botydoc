export interface Document {
  document_id: string;
  filename: string;
  cloudinary_url: string;
  upload_date: string;
}

export interface QueryResponse {
  document_id: string;
  query: string;
  answer: string;
  context: string[];
}