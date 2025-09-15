export interface Recommendation {
  id: string;
  recommenderName: string;
  recommenderTitle: string;
  recommenderCompany: string;
  relationship: string; // e.g., "Direct supervisor", "Colleague", "Client"
  recommendationText: string;
  highlightText: string; // Key phrase or summary to highlight
  date: string; // Format: "YYYY-MM-DD" or "Month YYYY"
  linkedInUrl?: string;
  avatar?: string; // Optional avatar URL
}
