export interface iInterview {
  id?: string;
  // Primary attrs:
  first_name?: string; // (required)
  last_name?: string; // (required)
  email?: string; // (required)
  phone?: string; // (no required)
  is_first_interview?: boolean; // (true by default)
  date_time?: string; // (auto created)
  // Secondary attrs:
  physique_description?: string; // (no required)
  aptitude_description?: string; // (no required)
  technical_questions_note?: number; // (required)
  technical_test_note?: number; // (no required)
}