import { db } from "./db";
import { users, doctorProfiles, hospitals, courses, quizzes, quizQuestions, jobs, masterclasses } from "@shared/schema";

const specialties = [
  "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Dermatology",
  "Radiology", "General Surgery", "Oncology", "Psychiatry", "Anesthesiology"
];

const degrees = [
  "MBBS, MD", "MBBS, MS", "MBBS, DM", "MBBS, DNB", "MBBS, MCh"
];

const cities = [
  "Jaipur", "Delhi", "Mumbai", "Bangalore", "Chennai", 
  "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Kota"
];

const states = [
  "Rajasthan", "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu",
  "West Bengal", "Telangana", "Gujarat"
];

const hospitalNames = [
  "Fortis Hospital", "Apollo Hospital", "AIIMS", "Max Hospital", "Manipal Hospital",
  "Medanta", "Narayana Health", "Cloudnine Hospital", "Columbia Asia", "Kokilaben Hospital"
];

const collegeNames = [
  "AIIMS Delhi", "Maulana Azad Medical College", "SMS Medical College", 
  "King George's Medical University", "Christian Medical College Vellore",
  "Kasturba Medical College", "JIPMER Puducherry", "Bangalore Medical College",
  "Madras Medical College", "Grant Medical College Mumbai"
];

async function seed() {
  console.log("Starting database seed...");

  // Check existing data
  const existingUsers = await db.select().from(users).limit(25);
  const existingDoctors = await db.select().from(doctorProfiles).limit(1);
  
  let userIds: number[] = existingUsers.map(u => u.id);

  // Create users only if needed
  if (existingUsers.length < 25) {
    console.log("Creating users...");
    for (let i = existingUsers.length + 1; i <= 25; i++) {
      const [user] = await db.insert(users).values({
        phone: `98${String(10000000 + i).slice(0, 8)}`,
        role: i <= 20 ? "doctor" : "student",
        isVerified: true,
      }).returning();
      userIds.push(user.id);
    }
  } else {
    console.log("Users already exist, skipping...");
  }

  // Check and create hospitals
  const existingHospitals = await db.select().from(hospitals).limit(10);
  let hospitalIds: number[] = existingHospitals.map(h => h.id);
  
  if (existingHospitals.length < 10) {
    console.log("Creating hospitals...");
    for (let i = existingHospitals.length; i < 10; i++) {
      const [hospital] = await db.insert(hospitals).values({
        name: hospitalNames[i],
        location: cities[i % cities.length],
        type: i % 2 === 0 ? "Government" : "Private",
        beds: 100 + Math.floor(Math.random() * 400),
        specialties: [
          specialties[i % specialties.length],
          specialties[(i + 1) % specialties.length],
          specialties[(i + 2) % specialties.length]
        ],
      }).returning();
      hospitalIds.push(hospital.id);
    }
  } else {
    console.log("Hospitals already exist, skipping...");
  }

  // Create doctor profiles only if they don't exist
  if (existingDoctors.length > 0) {
    console.log("Doctor profiles already exist, skipping...");
  } else {
    console.log("Creating doctor profiles...");
  const firstNames = ["Rajesh", "Priya", "Amit", "Neha", "Vikram", "Anjali", "Rahul", "Sneha", "Arun", "Kavita", 
                      "Suresh", "Meena", "Deepak", "Lakshmi", "Ravi", "Divya", "Karthik", "Pooja", "Sandeep", "Nisha"];
  const lastNames = ["Sharma", "Patel", "Singh", "Kumar", "Gupta", "Reddy", "Nair", "Mehta", "Joshi", "Iyer"];

  for (let i = 0; i < 20; i++) {
    await db.insert(doctorProfiles).values({
      userId: userIds[i],
      firstName: firstNames[i],
      lastName: lastNames[i % lastNames.length],
      email: `dr.${firstNames[i].toLowerCase()}.${lastNames[i % lastNames.length].toLowerCase()}@example.com`,
      dob: new Date(1975 + Math.floor(Math.random() * 25), Math.floor(Math.random() * 12), 1),
      gender: i % 2 === 0 ? "male" : "female",
      marriatialstatus: i % 3 === 0 ? "married" : "single",
      professionaldegree: degrees[i % degrees.length],
      userMobile: `98${String(10000000 + i).slice(0, 8)}`,
      
      // Academic info
      ugCollege: collegeNames[i % collegeNames.length],
      ugLocation: cities[i % cities.length],
      ugAdmissionYear: String(1995 + i),
      pgBranch: specialties[i % specialties.length],
      pgCollege: collegeNames[(i + 2) % collegeNames.length],
      pgLocation: cities[(i + 1) % cities.length],
      pgAdmissionYear: String(2000 + i),
      
      // Job info
      jobSector: i % 3 === 0 ? "Government" : "Private",
      jobCountry: "India",
      jobState: states[i % states.length],
      jobCity: cities[i % cities.length],
      jobPrivateHospital: hospitalNames[i % hospitalNames.length],
      
      // Profile flags
      profileGeneralFlag: true,
      profileContactFlag: true,
      profileAcademicFlag: true,
      profileJobFlag: true,
    });
  }
  }

  // Shared data for courses and masterclasses
  const instructorNames = ["Dr. Rajesh Sharma", "Dr. Priya Patel", "Dr. Amit Singh", "Dr. Neha Kumar", "Dr. Vikram Gupta", "Dr. Anjali Reddy", "Dr. Rahul Nair", "Dr. Sneha Mehta"];

  // Create courses (check if they exist first)
  const existingCourses = await db.select().from(courses).limit(1);
  if (existingCourses.length > 0) {
    console.log("Courses already exist, skipping...");
  } else {
    console.log("Creating courses...");
  const courseTopics = [
    { title: "Advanced Cardiology", desc: "Comprehensive course on cardiovascular diseases and treatments" },
    { title: "Pediatric Emergency Care", desc: "Essential skills for handling pediatric emergencies" },
    { title: "Surgical Techniques", desc: "Modern surgical methods and best practices" },
    { title: "Radiology Imaging", desc: "Advanced imaging techniques and interpretation" },
    { title: "Clinical Research Methods", desc: "Introduction to clinical trials and research" },
    { title: "Oncology Updates", desc: "Latest developments in cancer treatment" },
    { title: "Neurosurgical Approaches", desc: "Advanced neurosurgical techniques" },
    { title: "Medical Ethics", desc: "Ethical considerations in modern medicine" },
  ];
  const courseIds: number[] = [];
  for (let i = 0; i < courseTopics.length; i++) {
    const [course] = await db.insert(courses).values({
      title: courseTopics[i].title,
      description: courseTopics[i].desc,
      instructor: instructorNames[i],
      duration: 20 + Math.floor(Math.random() * 40), // hours
      price: 5000 + Math.floor(Math.random() * 15000),
      enrollmentCount: Math.floor(Math.random() * 500),
    }).returning();
    courseIds.push(course.id);
  }
  }

  // Create masterclasses (check if they exist first)
  const existingMasterclasses = await db.select().from(masterclasses).limit(1);
  if (existingMasterclasses.length > 0) {
    console.log("Masterclasses already exist, skipping...");
  } else {
    console.log("Creating masterclasses...");
  const masterclassTopics = [
    "Live Surgery Demonstration - Cardiac Bypass",
    "Case Discussion: Complex Neurology Cases",
    "Workshop: Laparoscopic Techniques",
    "Seminar: Cancer Immunotherapy",
    "Conference: Pediatric Care Excellence"
  ];

  for (let i = 0; i < 5; i++) {
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 7 + i * 7);
    eventDate.setHours(10 + i, 0, 0); // Set time to 10 AM, 11 AM, etc.
    
    await db.insert(masterclasses).values({
      title: masterclassTopics[i],
      description: `Expert-led ${masterclassTopics[i].toLowerCase()} with renowned specialists`,
      instructor: instructorNames[i],
      eventDate: eventDate,
      duration: 120 + Math.floor(Math.random() * 60), // 120-180 minutes
      price: 2000 + Math.floor(Math.random() * 3000),
      maxParticipants: 50 + Math.floor(Math.random() * 50),
      currentParticipants: Math.floor(Math.random() * 30),
    });
  }
  }

  // Create quizzes with questions (check if they exist first)
  const existingQuizzes = await db.select().from(quizzes).limit(4);
  if (existingQuizzes.length >= 4) {
    console.log("Quizzes already exist, skipping...");
  } else {
    console.log("Creating quizzes...");
  const quizTopics = [
    { title: "Cardiology Basics", specialty: "Cardiology", questionsCount: 5 },
    { title: "Pediatric Assessment", specialty: "Pediatrics", questionsCount: 4 },
    { title: "Surgical Protocols", specialty: "General Surgery", questionsCount: 4 },
    { title: "Neurology Diagnosis", specialty: "Neurology", questionsCount: 3 },
  ];

  // All quiz questions with their topics
  const allQuestions: any = {
    "Cardiology": [
      { text: "What is the normal resting heart rate for adults?", optionA: "40-60 bpm", optionB: "60-100 bpm", optionC: "100-120 bpm", optionD: "120-140 bpm", correctOption: "B" },
      { text: "Which chamber of the heart pumps blood to the lungs?", optionA: "Left atrium", optionB: "Right atrium", optionC: "Left ventricle", optionD: "Right ventricle", correctOption: "D" },
      { text: "What does ECG stand for?", optionA: "Electrocardiogram", optionB: "Electrocardio Graph", optionC: "Echo Cardio Gram", optionD: "Electronic Cardio Graph", correctOption: "A" },
      { text: "Which blood vessel carries oxygenated blood from lungs to heart?", optionA: "Pulmonary artery", optionB: "Pulmonary vein", optionC: "Aorta", optionD: "Vena cava", correctOption: "B" },
      { text: "What is the medical term for high blood pressure?", optionA: "Hypotension", optionB: "Hypertension", optionC: "Tachycardia", optionD: "Bradycardia", correctOption: "B" }
    ],
    "Pediatrics": [
      { text: "At what age does a child typically start walking?", optionA: "6-8 months", optionB: "9-12 months", optionC: "12-15 months", optionD: "15-18 months", correctOption: "C" },
      { text: "What is the recommended vaccine at birth?", optionA: "MMR", optionB: "BCG & Hepatitis B", optionC: "Polio", optionD: "DTP", correctOption: "B" },
      { text: "Normal respiratory rate for a newborn?", optionA: "12-20/min", optionB: "20-30/min", optionC: "30-60/min", optionD: "60-80/min", correctOption: "C" },
      { text: "Most common cause of fever in children?", optionA: "Viral infection", optionB: "Bacterial infection", optionC: "Allergies", optionD: "Teething", correctOption: "A" }
    ],
    "General Surgery": [
      { text: "What is the golden hour in trauma surgery?", optionA: "First 30 minutes", optionB: "First 60 minutes", optionC: "First 2 hours", optionD: "First 6 hours", correctOption: "B" },
      { text: "Most common type of hernia?", optionA: "Femoral", optionB: "Umbilical", optionC: "Inguinal", optionD: "Hiatal", correctOption: "C" },
      { text: "What does NPO mean before surgery?", optionA: "No pain observed", optionB: "Nothing by mouth", optionC: "No procedure ordered", optionD: "Normal post-op", correctOption: "B" },
      { text: "Appendix location in abdomen?", optionA: "Right upper quadrant", optionB: "Left lower quadrant", optionC: "Right lower quadrant", optionD: "Left upper quadrant", correctOption: "C" }
    ],
    "Neurology": [
      { text: "What is the most common type of stroke?", optionA: "Hemorrhagic", optionB: "Ischemic", optionC: "Embolic", optionD: "Lacunar", correctOption: "B" },
      { text: "Which cranial nerve controls vision?", optionA: "CN I", optionB: "CN II", optionC: "CN III", optionD: "CN IV", correctOption: "B" },
      { text: "Normal intracranial pressure range?", optionA: "0-5 mmHg", optionB: "5-15 mmHg", optionC: "15-25 mmHg", optionD: "25-35 mmHg", correctOption: "B" }
    ]
  };

  for (let i = 0; i < quizTopics.length; i++) {
    const topic = quizTopics[i];
    const [quiz] = await db.insert(quizzes).values({
      title: topic.title,
      description: `Test your knowledge in ${topic.specialty}`,
      category: topic.specialty,
      totalQuestions: topic.questionsCount,
      timeLimit: topic.questionsCount * 2, // 2 minutes per question
      passingScore: 60,
      price: 500 + Math.floor(Math.random() * 1000),
      attemptsCount: Math.floor(Math.random() * 200),
    }).returning();

    const questions = allQuestions[topic.specialty].slice(0, topic.questionsCount);
    
    for (let j = 0; j < questions.length; j++) {
      const q = questions[j];
      await db.insert(quizQuestions).values({
        quizId: quiz.id,
        questionText: q.text,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctOption: q.correctOption,
        orderIndex: j + 1,
      });
    }
  }
  }

  // Create jobs (check if they exist first)
  const existingJobs = await db.select().from(jobs).limit(1);
  if (existingJobs.length > 0) {
    console.log("Jobs already exist, skipping...");
  } else {
    console.log("Creating jobs...");
  const jobTitles = [
    "Senior Cardiologist", "Pediatric Specialist", "Consultant Surgeon", "Radiologist",
    "Emergency Medicine Physician", "Oncologist", "Neurologist", "Anesthesiologist",
    "Dermatologist", "Orthopedic Surgeon", "Psychiatrist", "General Physician",
    "Critical Care Specialist", "Pathologist", "ENT Specialist", "Gynecologist",
    "Urologist", "Nephrologist", "Gastroenterologist", "Endocrinologist"
  ];

  for (let i = 0; i < 20; i++) {
    await db.insert(jobs).values({
      title: jobTitles[i],
      hospitalName: hospitalNames[i % hospitalNames.length],
      location: cities[i % cities.length],
      specialty: specialties[i % specialties.length],
      experienceRequired: `${3 + Math.floor(Math.random() * 10)} years`,
      salary: `₹${10 + Math.floor(Math.random() * 30)} LPA`,
      jobType: i % 3 === 0 ? "Full-time" : i % 3 === 1 ? "Part-time" : "Contract",
      description: `We are looking for an experienced ${jobTitles[i]} to join our team at ${hospitalNames[i % hospitalNames.length]}.`,
      requirements: `MBBS, ${i % 2 === 0 ? 'MD' : 'MS'} in ${specialties[i % specialties.length]}, valid medical license`,
      postedDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      isActive: true,
      applicationCount: Math.floor(Math.random() * 50),
    });
  }
  }

  console.log("Database seeded successfully!");
  console.log(`Checked/created ${userIds.length} users`);
  console.log(`Checked/created ${hospitalIds.length} hospitals`);
  
  const [doctorCount] = await db.execute(`SELECT COUNT(*) as count FROM doctor_profiles`);
  const [courseCount] = await db.execute(`SELECT COUNT(*) as count FROM courses`);
  const [masterclassCount] = await db.execute(`SELECT COUNT(*) as count FROM masterclasses`);
  const [quizCount] = await db.execute(`SELECT COUNT(*) as count FROM quizzes`);
  const [jobCount] = await db.execute(`SELECT COUNT(*) as count FROM jobs`);
  
  console.log(`Total doctor profiles: ${doctorCount.count}`);
  console.log(`Total courses: ${courseCount.count}`);
  console.log(`Total masterclasses: ${masterclassCount.count}`);
  console.log(`Total quizzes: ${quizCount.count}`);
  console.log(`Total jobs: ${jobCount.count}`);
}

seed()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
