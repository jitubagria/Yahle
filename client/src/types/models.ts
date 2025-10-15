export interface DoctorProfile {
  id: number;
  userId: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  profilePic?: string;
  userMobile?: string;
  phone?: string;
  alternateno?: string;
  userWebsite?: string;
  contactOthers?: string;
  jobRajDistrict?: string;
  jaipurarea?: string;
  // add optional index signature for other fields
  [key: string]: any;
}

export interface Job {
  id: number;
  title: string;
  hospitalName?: string;
  location?: string;
  specialty?: string;
  postedDate?: string;
  [key: string]: any;
}

export interface Course {
  id: number;
  title: string;
  description?: string;
  price?: number | string;
  [key: string]: any;
}

export interface StatsResponse {
  totalUsers: number;
  totalDoctors: number;
  totalStudents: number;
  activeJobs: number;
}

export interface ResearchRequest {
  id: number;
  title: string;
  status: string;
  [key: string]: any;
}
