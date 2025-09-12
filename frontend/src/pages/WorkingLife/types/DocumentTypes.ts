export interface Document {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  downloadUrl: string;
  downloadAs: string;
  fileType: string;
}