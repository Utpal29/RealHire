export interface AnalysisRequest {
  resumeText: string;
  jobDescription: string;
}

export interface AnalysisResult {
  score: number;
  missingSkills: string[];
  suggestions: string[];
  fixedResume: string;
  idealResume: string;
  id?: string;
  date?: string;
}
