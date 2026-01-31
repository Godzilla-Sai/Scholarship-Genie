
export interface UserProfile {
  fullName: string;
  gpa: string;
  major: string;
  educationLevel: string;
  location: string;
  financialNeed: 'low' | 'medium' | 'high';
  extracurriculars: string;
  background: string;
}

export interface Scholarship {
  title: string;
  description: string;
  url: string;
  amount: string;
  deadline: string;
}

export interface AnalysisResult {
  summary: string;
  eligibilityScore: number;
  recommendations: string[];
  scholarships: Scholarship[];
}
