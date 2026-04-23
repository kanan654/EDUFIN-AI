
export interface UserProfile {
  name: string;
  currentEducation: string;
  targetDegree: 'Masters' | 'Bachelors' | 'PhD';
  targetCountry: string;
  budgetRange: string;
  interestFields: string[];
}

export interface UniversityRecommendation {
  name: string;
  country: string;
  courses: string[];
  ranking: string;
  estimatedCost: string;
  roiScore: number;
  description: string;
  tier: 1 | 2 | 3;
  image: string;
  contact: {
    email: string;
    phone: string;
    reception: string;
  };
  placements: {
    avgPackage: string;
    topRecruiters: string[];
  };
  notableAlumni: string[];
  history: string;
}

export interface LoanOffer {
  bankName: string;
  interestRate: string;
  maxAmount: string;
  tenure: string;
  processingFee: string;
}

export interface KnowledgeBite {
  id: string;
  title: string;
  content: string;
  category: 'Visa' | 'Loan' | 'University' | 'Career';
  date: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'alert' | 'ai';
  read: boolean;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  uploadDate: string;
  category: 'Identity' | 'Academic' | 'Finance';
}
