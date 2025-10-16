import { db } from "./db";
import { sql } from 'drizzle-orm';
import { users, courses, quizzes, quizQuestions } from "../drizzle/schema";
import { doctorProfiles, hospitals, jobs, masterclasses } from "../drizzle/schema";
import { RoleType, PaymentStatus, QuizType } from './enums';
import { insertAndFetch } from './core/dbHelpers';
import logger from './lib/logger';

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
  logger.info('Starting database seed...');

  // Check existing data
  const existingUsers = await db.select().from(users).limit(25);
  const existingDoctors = await db.select().from(doctorProfiles).limit(1);
  
  let userIds: number[] = existingUsers.map(u => u.id);

  // Create users only if needed
  if (existingUsers.length < 25) {
  logger.info('Creating users...');
      for (let i = existingUsers.length + 1; i <= 25; i++) {
      const userInsertRes: any = await db.insert(users).values({
        phone: `98${String(10000000 + i).slice(0, 8)}`,
        role: i <= 20 ? RoleType.DOCTOR : RoleType.STUDENT,
        isVerified: 1,
      }).execute();
      userIds.push(userInsertRes.insertId as number);
    }
  } else {
    logger.info('Users already exist, skipping...');
  }

  // Check and create hospitals
  const existingHospitals = await db.select().from(hospitals).limit(10);
  let hospitalIds: number[] = existingHospitals.map(h => h.id);
  
  if (existingHospitals.length < 10) {
  logger.info('Creating hospitals...');
      for (let i = existingHospitals.length; i < 10; i++) {
      const hospitalRes: any = await db.insert(hospitals).values({
            name: hospitalNames[i],
            // map earlier `location` usage to `city` (schema uses city)
            city: cities[i % cities.length],
            // store the type information in description for now (schema has no `type` column)
            description: i % 2 === 0 ? "Government" : "Private",
            specialties: JSON.stringify([
              specialties[i % specialties.length],
              specialties[(i + 1) % specialties.length],
              specialties[(i + 2) % specialties.length]
            ]),
          }).execute();
          hospitalIds.push(hospitalRes.insertId as number);
        }
  } else {
    logger.info('Hospitals already exist, skipping...');
  }

  // Create doctor profiles only if they don't exist
  if (existingDoctors.length > 0) {
    logger.info('Doctor profiles already exist, skipping...');
  } else {
    logger.info('Creating doctor profiles...');
  const firstNames = ["Rajesh", "Priya", "Amit", "Neha", "Vikram", "Anjali", "Rahul", "Sneha", "Arun", "Kavita", 
                      "Suresh", "Meena", "Deepak", "Lakshmi", "Ravi", "Divya", "Karthik", "Pooja", "Sandeep", "Nisha"];
  const lastNames = ["Sharma", "Patel", "Singh", "Kumar", "Gupta", "Reddy", "Nair", "Mehta", "Joshi", "Iyer"];

    for (let i = 0; i < 20; i++) {
  await db.insert(doctorProfiles).values({
        userId: userIds[i],
        firstName: firstNames[i],
        lastName: lastNames[i % lastNames.length],
        email: `dr.${firstNames[i].toLowerCase()}.${lastNames[i % lastNames.length].toLowerCase()}@example.com`,
        dob: new Date(1975 + Math.floor(Math.random() * 25), Math.floor(Math.random() * 12), 1).toISOString(),
        gender: i % 2 === 0 ? 'male' : 'female',
        marriatialstatus: i % 3 === 0 ? 'married' : 'single',
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
      }).execute();
    }
  }

  // Shared data for courses and masterclasses
  const instructorNames = ["Dr. Rajesh Sharma", "Dr. Priya Patel", "Dr. Amit Singh", "Dr. Neha Kumar", "Dr. Vikram Gupta", "Dr. Anjali Reddy", "Dr. Rahul Nair", "Dr. Sneha Mehta"];

  // Create courses (check if they exist first)
  const existingCourses = await db.select().from(courses).limit(1);
  if (existingCourses.length > 0) {
    logger.info('Courses already exist, skipping...');
  } else {
    logger.info('Creating courses...');
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
      const priceValue = 5000 + Math.floor(Math.random() * 15000);
  const courseRes: any = await db.insert(courses).values({
        title: courseTopics[i].title,
        description: courseTopics[i].desc,
        instructor: instructorNames[0],
        duration: 20 + Math.floor(Math.random() * 40), // hours
        price: priceValue,
        enrollmentCount: Math.floor(Math.random() * 500),
      }).execute();
      courseIds.push(courseRes.insertId as number);
    }
  }

  // Create masterclasses (check if they exist first)
  const existingMasterclasses = await db.select().from(masterclasses).limit(1);
  if (existingMasterclasses.length > 0) {
    logger.info('Masterclasses already exist, skipping...');
  } else {
    logger.info('Creating masterclasses...');
  const masterclassTopics = [
    "Live Surgery Demonstration - Cardiac Bypass",
    "Case Discussion: Complex Neurology Cases",
    "Workshop: Laparoscopic Techniques",
    "Seminar: Cancer Immunotherapy",
    "Conference: Pediatric Care Excellence"
  ];

    for (let i = 0; i < 5; i++) {
    // use CURRENT_TIMESTAMP for seeded eventDate to keep seed deterministic and typed
    // (schema accepts datetime; using SQL fragment avoids mismatched types)
    const eventDateSql = sql`CURRENT_TIMESTAMP`;

  await db.insert(masterclasses).values({
        title: masterclassTopics[i],
        description: `Expert-led ${masterclassTopics[i].toLowerCase()} with renowned specialists`,
        instructor: instructorNames[i],
        eventDate: eventDateSql,
        duration: 120 + Math.floor(Math.random() * 60), // 120-180 minutes
        price: 2000 + Math.floor(Math.random() * 3000),
        maxParticipants: 50 + Math.floor(Math.random() * 50),
        currentParticipants: Math.floor(Math.random() * 30),
      }).execute();
  }
  }

  // Create quizzes with questions (check if they exist first)
  const existingQuizzes = await db.select().from(quizzes).limit(4);
  if (existingQuizzes.length >= 4) {
    logger.info('Quizzes already exist, skipping...');
  } else {
    logger.info('Creating quizzes...');
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
    const quizRow = await insertAndFetch(db, quizzes, {
      title: topic.title,
      description: `Test your knowledge in ${topic.specialty}`,
      category: topic.specialty,
      totalQuestions: topic.questionsCount,
      questionTime: topic.questionsCount * 2, // 2 minutes per question
  passingScore: 60,
  entryFee: 500 + Math.floor(Math.random() * 1000),
    });
    if (!quizRow) throw new Error('Failed to create quiz');
    const quizId = (quizRow as any).id as number;

    const questions = allQuestions[topic.specialty].slice(0, topic.questionsCount);
    
      for (let j = 0; j < questions.length; j++) {
          const q = questions[j];
        await db.insert(quizQuestions).values({
          quizId: quizId as number,
          questionText: q.text,
          // schema expects a JSON/text `options` column; store as JSON string
          options: JSON.stringify([q.optionA, q.optionB, q.optionC, q.optionD]),
          correctOption: q.correctOption,
          orderIndex: j + 1,
        }).execute();
    }
  }
  }

  // Create jobs (check if they exist first)
  const existingJobs = await db.select().from(jobs).limit(1);
  if (existingJobs.length > 0) {
    logger.info('Jobs already exist, skipping...');
  } else {
    logger.info('Creating jobs...');
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
      salaryRange: `₹${10 + Math.floor(Math.random() * 30)} LPA`,
      jobType: i % 3 === 0 ? "Full-time" : i % 3 === 1 ? "Part-time" : "Contract",
      description: `We are looking for an experienced ${jobTitles[i]} to join our team at ${hospitalNames[i % hospitalNames.length]}.`,
      requirements: `MBBS, ${i % 2 === 0 ? 'MD' : 'MS'} in ${specialties[i % specialties.length]}, valid medical license`,
  postedAt: sql`CURRENT_TIMESTAMP`,
  isActive: 1,
    }).execute();
  }
  }

  logger.info('Database seeded successfully!');
  logger.info({ createdUsers: userIds.length }, `Checked/created ${userIds.length} users`);
  logger.info({ createdHospitals: hospitalIds.length }, `Checked/created ${hospitalIds.length} hospitals`);
  
  const [doctorCountRows]: any = await db.execute(`SELECT COUNT(*) as count FROM doctor_profiles`);
  const [courseCountRows]: any = await db.execute(`SELECT COUNT(*) as count FROM courses`);
  const [masterclassCountRows]: any = await db.execute(`SELECT COUNT(*) as count FROM masterclasses`);
  const [quizCountRows]: any = await db.execute(`SELECT COUNT(*) as count FROM quizzes`);
  const [jobCountRows]: any = await db.execute(`SELECT COUNT(*) as count FROM jobs`);

  const doctorCount = (doctorCountRows as unknown as any[])[0];
  const courseCount = (courseCountRows as unknown as any[])[0];
  const masterclassCount = (masterclassCountRows as unknown as any[])[0];
  const quizCount = (quizCountRows as unknown as any[])[0];
  const jobCount = (jobCountRows as unknown as any[])[0];

  logger.info({ totalDoctorProfiles: doctorCount.count }, `Total doctor profiles: ${doctorCount.count}`);
  logger.info({ totalCourses: courseCount.count }, `Total courses: ${courseCount.count}`);
  logger.info({ totalMasterclasses: masterclassCount.count }, `Total masterclasses: ${masterclassCount.count}`);
  logger.info({ totalQuizzes: quizCount.count }, `Total quizzes: ${quizCount.count}`);
  logger.info({ totalJobs: jobCount.count }, `Total jobs: ${jobCount.count}`);
}

seed()
  .catch((error) => {
    logger.error({ err: error }, 'Seed error:');
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
