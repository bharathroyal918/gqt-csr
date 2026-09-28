import { Student, HRInterview } from "@/types";

export interface CandidateProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveDemoUrl?: string;
  rating?: number; // 1-5
}

export interface TechnicalRubrics {
  programmingKnowledge: number;
  domainKnowledge: number; // Java / Python / MERN
  sqlDatabase: number;
  problemSolving: number;
  debugging: number;
  apiKnowledge: number;
  aiConcepts: number;
  testingKnowledge: number;
  dataStructures: number;
  projectExplanation: number;
  codingLogic: number;
  overallScore: number;
  remarks: string;
}

export interface HrRubrics {
  communication: number;
  confidence: number;
  presentation: number;
  englishArticulation: number;
  teamwork: number;
  leadership: number;
  learningAbility: number;
  careerInterest: number;
  availability: number;
  overallScore: number;
  remarks: string;
}

export interface CandidateTimelineEvent {
  id: string;
  timestamp: string;
  stage: string;
  title: string;
  description: string;
  actor: string;
  type: "info" | "success" | "warning" | "danger";
}

export interface CandidateFullProfile {
  id: string;
  studentId: string;
  fullName: string;
  photoUrl: string;
  email: string;
  mobile: string;
  whatsapp: string;
  collegeId: string;
  collegeName: string;
  usn: string;
  university: string;
  graduateType: string;
  branch: string;
  semester: number;
  passingYear: number;
  cgpa: number;
  tenthPercentage: number;
  twelfthPercentage: number;
  city: string;
  district: string;
  state: string;
  preferredTrainingMode: string;
  driveId: string;
  driveName: string;
  selectedCourse: string;
  batch: string;
  registeredAt: string;
  status:
    | "Qualified"
    | "Interview Scheduled"
    | "Under Review"
    | "Selected"
    | "Hold"
    | "Rejected"
    | "Not Attended"
    | "Offer Pending"
    | "Offer Sent"
    | "Offer Accepted";
  // Links
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  skills: string[];
  // Exam
  exam: {
    score: number;
    maxScore: number;
    percentage: number;
    cutoff: number;
    percentile: number;
    statewideRank: number;
    collegeRank: number;
    branchRank: number;
    correct: number;
    wrong: number;
    skipped: number;
    timeTakenMinutes: number;
    violationsCount: number;
    tabSwitchCount: number;
    telemetryStatus: "Clean Verified" | "Minor Warning" | "Flagged";
    sectionAnalysis: {
      section: string;
      score: number;
      total: number;
      accuracy: number;
    }[];
  };
  // Projects
  projects: CandidateProject[];
  // Interview slot
  interviewSlot?: {
    id: string;
    date: string;
    time: string;
    mode: "Online" | "Offline" | "Hybrid";
    meetingLink?: string;
    venue?: string;
    panelMembers: string[];
    hrExecutive: string;
    stage: string;
  };
  // Evaluations
  technicalEvaluation?: TechnicalRubrics;
  hrEvaluation?: HrRubrics;
  interviewNotes?: {
    strengths: string[];
    weaknesses: string[];
    summary: string;
    lastSaved: string;
  };
  decision?: {
    outcome: "Selected" | "Rejected" | "Hold" | "Not Attended";
    reason?: string;
    rejectionStage?: string;
    followUpDate?: string;
    decidedBy: string;
    timestamp: string;
    notes: string;
  };
  offerData?: {
    joiningRole: string;
    course: string;
    batch: string;
    joiningDate: string;
    reportingTime: string;
    reportingLocation: string;
    trainingCenter: string;
    ctc: string;
    stipend: string;
    offerStatus: "Pending Offer" | "Draft Offer" | "Offer Generated" | "Offer Sent" | "Accepted" | "Rejected";
    remarks?: string;
  };
  timeline: CandidateTimelineEvent[];
}

export const INITIAL_CANDIDATE_PROFILES: CandidateFullProfile[] = [
  {
    id: "stu-001",
    studentId: "GQT-2026-0012",
    fullName: "Aditya V. Kashyap",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    email: "aditya.kashyap@rvce.edu.in",
    mobile: "+91 98450 11992",
    whatsapp: "+91 98450 11992",
    collegeId: "col-001",
    collegeName: "R.V. College of Engineering (RVCE)",
    usn: "1RV22CS014",
    university: "Visvesvaraya Technological University",
    graduateType: "BE",
    branch: "Computer Science and Engineering",
    semester: 8,
    passingYear: 2026,
    cgpa: 8.82,
    tenthPercentage: 92.4,
    twelfthPercentage: 89.6,
    city: "Bengaluru",
    district: "Bengaluru Urban",
    state: "Karnataka",
    preferredTrainingMode: "Hybrid",
    driveId: "drv-2026-001",
    driveName: "Karnataka State-wide CSR Engineering Drive 2026",
    selectedCourse: "Java Full Stack + Agentic AI",
    batch: "2026 Batch Alpha",
    registeredAt: "2026-08-12T14:20:00Z",
    status: "Selected",
    githubUrl: "https://github.com/adityakashyap",
    linkedinUrl: "https://linkedin.com/in/adityakashyap-dev",
    portfolioUrl: "https://adityakashyap.tech",
    resumeUrl: "/documents/resumes/Resume_Aditya_RVCE.pdf",
    skills: ["Java 21", "Spring Boot", "PostgreSQL", "Docker", "LangChain", "Microservices", "Kafka"],
    exam: {
      score: 87,
      maxScore: 100,
      percentage: 87,
      cutoff: 50,
      percentile: 98.4,
      statewideRank: 12,
      collegeRank: 3,
      branchRank: 2,
      correct: 36,
      wrong: 3,
      skipped: 1,
      timeTakenMinutes: 44,
      violationsCount: 0,
      tabSwitchCount: 0,
      telemetryStatus: "Clean Verified",
      sectionAnalysis: [
        { section: "Java & OOP Concepts", score: 25, total: 25, accuracy: 100 },
        { section: "SQL & RDBMS", score: 22.5, total: 25, accuracy: 90 },
        { section: "Aptitude & Logic", score: 22.5, total: 25, accuracy: 90 },
        { section: "Agentic AI Concepts", score: 20, total: 25, accuracy: 80 },
      ],
    },
    projects: [
      {
        id: "prj-1",
        title: "Autonomous Multi-Agent Code Review Bot",
        description: "Built an event-driven bot using LangChain & Python that analyzes GitHub pull requests for OWASP Top 10 vulnerabilities.",
        techStack: ["Python", "FastAPI", "LangChain", "Docker", "GitHub API"],
        githubUrl: "https://github.com/adityakashyap/agentic-pr-reviewer",
        liveDemoUrl: "https://pr-reviewer.adityakashyap.tech",
        rating: 5,
      },
      {
        id: "prj-2",
        title: "Distributed Microservices E-Commerce Core",
        description: "Implemented high-throughput order matching engine using Spring Boot, Kafka, and Redis caching.",
        techStack: ["Java", "Spring Boot", "Kafka", "Redis", "PostgreSQL"],
        githubUrl: "https://github.com/adityakashyap/order-engine",
        rating: 4.5,
      },
    ],
    interviewSlot: {
      id: "slot-101",
      date: "2026-09-24",
      time: "10:30 AM - 11:15 AM",
      mode: "Online",
      meetingLink: "https://meet.google.com/rvc-java-panel",
      panelMembers: ["Priya Nair", "Lead Technical Architect"],
      hrExecutive: "Priya Nair",
      stage: "Technical & HR Combined Calibration",
    },
    technicalEvaluation: {
      programmingKnowledge: 9,
      domainKnowledge: 9,
      sqlDatabase: 8,
      problemSolving: 9,
      debugging: 8,
      apiKnowledge: 9,
      aiConcepts: 8,
      testingKnowledge: 8,
      dataStructures: 9,
      projectExplanation: 9,
      codingLogic: 9,
      overallScore: 8.8,
      remarks: "Demonstrated clear grasp of multithreading, concurrent hashmap internals, and clean transactional boundaries.",
    },
    hrEvaluation: {
      communication: 9,
      confidence: 9,
      presentation: 8,
      englishArticulation: 9,
      teamwork: 9,
      leadership: 8,
      learningAbility: 9,
      careerInterest: 9,
      availability: 9,
      overallScore: 8.8,
      remarks: "Extremely articulate, polite, and enthusiastic about joining GQT enterprise projects.",
    },
    interviewNotes: {
      strengths: ["Strong computer science fundamentals", "Deep Java 21 & Spring Boot experience", "Polished communication"],
      weaknesses: ["Needs minor coaching on Kubernetes deployment manifests"],
      summary: "Top-tier candidate from RVCE. Immediate strong hire for premium track.",
      lastSaved: "2026-09-24T11:20:00Z",
    },
    decision: {
      outcome: "Selected",
      decidedBy: "Priya Nair",
      timestamp: "2026-09-24T11:25:00Z",
      notes: "Selected for Cloud & AI full stack training track. Recommended package ₹ 6.5 LPA.",
    },
    offerData: {
      joiningRole: "Associate Software Engineer - Java & Agentic AI",
      course: "Full Stack Java Cloud Development & Agentic AI",
      batch: "2026 Batch Alpha",
      joiningDate: "2026-07-01",
      reportingTime: "09:00 AM",
      reportingLocation: "GQT Tech Park, Whitefield, Bengaluru",
      trainingCenter: "GQT Advanced Learning Center, Bengaluru",
      ctc: "₹ 6.50 LPA",
      stipend: "₹ 18,000 / month",
      offerStatus: "Draft Offer",
      remarks: "Eligible for fast-track performance bonus after 6 months.",
    },
    timeline: [
      { id: "tl-1", timestamp: "2026-08-12 14:20", stage: "Registration", title: "Registered for Drive", description: "Registered through RVCE Placement Cell with complete KYC and academic transcripts.", actor: "Candidate", type: "info" },
      { id: "tl-2", timestamp: "2026-09-20 10:00", stage: "Assessment", title: "Online Exam Completed", description: "Scored 87/100 (98.4th percentile, Rank #12 statewide). Zero anti-malpractice infractions detected.", actor: "Evaluation Engine", type: "success" },
      { id: "tl-3", timestamp: "2026-09-22 16:30", stage: "Scheduling", title: "Technical Interview Scheduled", description: "Interview allocated with Priya Nair & Lead Technical Architect.", actor: "HR Auto-Scheduler", type: "info" },
      { id: "tl-4", timestamp: "2026-09-24 11:25", stage: "Decision", title: "Candidate Marked as SELECTED", description: "HR & Technical Panel approved candidate with 8.8/10 composite rubric score.", actor: "Priya Nair (HR)", type: "success" },
    ],
  },
  {
    id: "stu-002",
    studentId: "GQT-2026-0034",
    fullName: "Sneha Ramachandra Rao",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    email: "sneha.rao@bmsce.ac.in",
    mobile: "+91 98451 22334",
    whatsapp: "+91 98451 22334",
    collegeId: "col-002",
    collegeName: "B.M.S. College of Engineering (BMSCE)",
    usn: "1BM22IS089",
    university: "Visvesvaraya Technological University",
    graduateType: "BE",
    branch: "Information Science and Engineering",
    semester: 8,
    passingYear: 2026,
    cgpa: 9.15,
    tenthPercentage: 94.0,
    twelfthPercentage: 91.2,
    city: "Bengaluru",
    district: "Bengaluru Urban",
    state: "Karnataka",
    preferredTrainingMode: "Hybrid",
    driveId: "drv-2026-001",
    driveName: "Karnataka State-wide CSR Engineering Drive 2026",
    selectedCourse: "Python Full Stack + AI/ML",
    batch: "2026 Batch Alpha",
    registeredAt: "2026-08-14T11:15:00Z",
    status: "Qualified",
    githubUrl: "https://github.com/sneharao-dev",
    linkedinUrl: "https://linkedin.com/in/sneharao-bms",
    portfolioUrl: "https://sneharao.me",
    resumeUrl: "/documents/resumes/Resume_Sneha_BMSCE.pdf",
    skills: ["Python 3.12", "Django", "FastAPI", "React", "PostgreSQL", "PyTorch", "Pandas"],
    exam: {
      score: 91,
      maxScore: 100,
      percentage: 91,
      cutoff: 50,
      percentile: 99.2,
      statewideRank: 5,
      collegeRank: 1,
      branchRank: 1,
      correct: 38,
      wrong: 2,
      skipped: 0,
      timeTakenMinutes: 41,
      violationsCount: 0,
      tabSwitchCount: 0,
      telemetryStatus: "Clean Verified",
      sectionAnalysis: [
        { section: "Python Core & Data Structures", score: 25, total: 25, accuracy: 100 },
        { section: "SQL & Relational Schema", score: 24, total: 25, accuracy: 96 },
        { section: "Aptitude & Logic", score: 23, total: 25, accuracy: 92 },
        { section: "AI/ML Fundamentals", score: 24, total: 25, accuracy: 96 },
      ],
    },
    projects: [
      {
        id: "prj-201",
        title: "Clinical Chest X-Ray AI Diagnostics",
        description: "Developed deep learning model utilizing transfer learning (DenseNet121) to detect pneumonia patterns with 94.2% accuracy.",
        techStack: ["PyTorch", "Python", "FastAPI", "Next.js", "Docker"],
        githubUrl: "https://github.com/sneharao-dev/medical-xray-ai",
        liveDemoUrl: "https://xray-ai.sneharao.me",
        rating: 5,
      },
    ],
    timeline: [
      { id: "tl-201", timestamp: "2026-08-14 11:15", stage: "Registration", title: "Registration Approved", description: "Verified transcripts and college endorsement.", actor: "BMSCE PTO", type: "info" },
      { id: "tl-202", timestamp: "2026-09-20 10:00", stage: "Assessment", title: "Exam Rank #5 Statewide", description: "Scored 91/100. Highest in Information Science track.", actor: "Evaluation Engine", type: "success" },
    ],
  },
  {
    id: "stu-003",
    studentId: "GQT-2026-0089",
    fullName: "Karthik Srinivas",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    email: "karthik.s@msrit.edu",
    mobile: "+91 98452 33445",
    whatsapp: "+91 98452 33445",
    collegeId: "col-003",
    collegeName: "Ramaiah Institute of Technology (MSRIT)",
    usn: "1MS22CS102",
    university: "Visvesvaraya Technological University",
    graduateType: "BE",
    branch: "Computer Science & Engineering",
    semester: 8,
    passingYear: 2026,
    cgpa: 8.45,
    tenthPercentage: 88.5,
    twelfthPercentage: 86.0,
    city: "Bengaluru",
    district: "Bengaluru Urban",
    state: "Karnataka",
    preferredTrainingMode: "Offline Campus",
    driveId: "drv-2026-001",
    driveName: "Karnataka State-wide CSR Engineering Drive 2026",
    selectedCourse: "MERN Stack + Cloud",
    batch: "2026 Batch Alpha",
    registeredAt: "2026-08-15T09:30:00Z",
    status: "Interview Scheduled",
    githubUrl: "https://github.com/karthiksrinivas",
    linkedinUrl: "https://linkedin.com/in/karthik-srinivas-msrit",
    resumeUrl: "/documents/resumes/Resume_Karthik_MSRIT.pdf",
    skills: ["React", "Node.js", "Express", "MongoDB", "TypeScript", "TailwindCSS"],
    exam: {
      score: 79,
      maxScore: 100,
      percentage: 79,
      cutoff: 50,
      percentile: 91.0,
      statewideRank: 42,
      collegeRank: 6,
      branchRank: 5,
      correct: 32,
      wrong: 7,
      skipped: 1,
      timeTakenMinutes: 48,
      violationsCount: 1,
      tabSwitchCount: 1,
      telemetryStatus: "Minor Warning",
      sectionAnalysis: [
        { section: "Full Stack Web & JS", score: 23, total: 25, accuracy: 92 },
        { section: "Database & Mongo", score: 20, total: 25, accuracy: 80 },
        { section: "Aptitude & Logic", score: 18, total: 25, accuracy: 72 },
        { section: "System Architecture", score: 18, total: 25, accuracy: 72 },
      ],
    },
    projects: [
      {
        id: "prj-301",
        title: "Realtime Collaborative Kanban Board",
        description: "Built with Socket.io, Node.js and React. Supports optimistic UI updates and enterprise workspace isolation.",
        techStack: ["Node.js", "Socket.io", "React", "MongoDB"],
        githubUrl: "https://github.com/karthiksrinivas/collab-kanban",
        rating: 4,
      },
    ],
    interviewSlot: {
      id: "slot-102",
      date: "2026-09-25",
      time: "02:00 PM - 02:45 PM",
      mode: "Online",
      meetingLink: "https://meet.google.com/msr-mern-panel",
      panelMembers: ["Arun Menon (Lead Trainer)", "Divya H (HR)"],
      hrExecutive: "Divya H",
      stage: "Technical Interview Round 1",
    },
    timeline: [
      { id: "tl-301", timestamp: "2026-08-15 09:30", stage: "Registration", title: "Registered for MSRIT Campus Drive", description: "Application verified by placement officer.", actor: "MSRIT PTO", type: "info" },
      { id: "tl-302", timestamp: "2026-09-20 10:00", stage: "Assessment", title: "Exam Completed (79/100)", description: "1 minor tab-switch detected and logged.", actor: "Proctor Engine", type: "warning" },
      { id: "tl-303", timestamp: "2026-09-23 14:00", stage: "Scheduling", title: "Interview Scheduled for Sep 25", description: "Slot confirmed at 02:00 PM.", actor: "Divya H (HR)", type: "info" },
    ],
  },
  {
    id: "stu-004",
    studentId: "GQT-2026-0115",
    fullName: "Pooja Hegde",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    email: "pooja.hegde@nie.ac.in",
    mobile: "+91 98453 44556",
    whatsapp: "+91 98453 44556",
    collegeId: "col-004",
    collegeName: "The National Institute of Engineering (NIE), Mysuru",
    usn: "4NI22CS078",
    university: "Visvesvaraya Technological University",
    graduateType: "BE",
    branch: "Computer Science & Engineering",
    semester: 8,
    passingYear: 2026,
    cgpa: 8.62,
    tenthPercentage: 90.0,
    twelfthPercentage: 87.5,
    city: "Mysuru",
    district: "Mysuru",
    state: "Karnataka",
    preferredTrainingMode: "Hybrid",
    driveId: "drv-2026-001",
    driveName: "Karnataka State-wide CSR Engineering Drive 2026",
    selectedCourse: "Java Full Stack + Agentic AI",
    batch: "2026 Batch Alpha",
    registeredAt: "2026-08-16T12:00:00Z",
    status: "Hold",
    githubUrl: "https://github.com/poojahegde",
    linkedinUrl: "https://linkedin.com/in/pooja-hegde-nie",
    resumeUrl: "/documents/resumes/Resume_Pooja_NIE.pdf",
    skills: ["Java", "Spring Boot", "MySQL", "Angular", "REST APIs"],
    exam: {
      score: 76,
      maxScore: 100,
      percentage: 76,
      cutoff: 50,
      percentile: 88.5,
      statewideRank: 58,
      collegeRank: 4,
      branchRank: 4,
      correct: 31,
      wrong: 8,
      skipped: 1,
      timeTakenMinutes: 47,
      violationsCount: 0,
      tabSwitchCount: 0,
      telemetryStatus: "Clean Verified",
      sectionAnalysis: [
        { section: "Java & OOP", score: 22, total: 25, accuracy: 88 },
        { section: "SQL & DB", score: 20, total: 25, accuracy: 80 },
        { section: "Aptitude & Logic", score: 18, total: 25, accuracy: 72 },
        { section: "AI Concepts", score: 16, total: 25, accuracy: 64 },
      ],
    },
    projects: [
      {
        id: "prj-401",
        title: "Campus Alumni Engagement Portal",
        description: "Full stack Java & Angular portal allowing alumni mentoring, event booking, and donations.",
        techStack: ["Java", "Spring Boot", "MySQL", "Angular"],
        githubUrl: "https://github.com/poojahegde/alumni-portal",
        rating: 3.5,
      },
    ],
    interviewSlot: {
      id: "slot-103",
      date: "2026-09-23",
      time: "03:00 PM - 03:45 PM",
      mode: "Online",
      meetingLink: "https://meet.google.com/nie-java-panel",
      panelMembers: ["Priya Nair"],
      hrExecutive: "Priya Nair",
      stage: "Technical Round 1 Completed",
    },
    technicalEvaluation: {
      programmingKnowledge: 7,
      domainKnowledge: 7,
      sqlDatabase: 7,
      problemSolving: 6,
      debugging: 6,
      apiKnowledge: 7,
      aiConcepts: 6,
      testingKnowledge: 6,
      dataStructures: 6,
      projectExplanation: 7,
      codingLogic: 6,
      overallScore: 6.5,
      remarks: "Good core Java theory, but hesitated on complex SQL joins and multi-threaded race conditions.",
    },
    hrEvaluation: {
      communication: 8,
      confidence: 7,
      presentation: 7,
      englishArticulation: 8,
      teamwork: 8,
      leadership: 7,
      learningAbility: 8,
      careerInterest: 8,
      availability: 9,
      overallScore: 7.6,
      remarks: "Very polite, eager to learn. Recommended second technical evaluation after 1 week.",
    },
    decision: {
      outcome: "Hold",
      followUpDate: "2026-09-30",
      reason: "Needs secondary technical interview on advanced database querying and backend concurrency.",
      decidedBy: "Priya Nair",
      timestamp: "2026-09-23T16:00:00Z",
      notes: "Assigned self-study task on SQL window functions and Java ExecutorService.",
    },
    timeline: [
      { id: "tl-401", timestamp: "2026-08-16 12:00", stage: "Registration", title: "Registered for CSR Drive", description: "Verified transcripts from NIE Mysuru.", actor: "NIE PTO", type: "info" },
      { id: "tl-402", timestamp: "2026-09-20 10:00", stage: "Assessment", title: "Passed Assessment (76/100)", description: "Ranked #58 Statewide.", actor: "Evaluation Engine", type: "success" },
      { id: "tl-403", timestamp: "2026-09-23 16:00", stage: "Decision", title: "Placed on HOLD", description: "Follow-up interview scheduled for Sep 30 on advanced concurrency.", actor: "Priya Nair (HR)", type: "warning" },
    ],
  },
  {
    id: "stu-005",
    studentId: "GQT-2026-0198",
    fullName: "Rohan Gowda",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    email: "rohan.gowda@sit.ac.in",
    mobile: "+91 98454 55667",
    whatsapp: "+91 98454 55667",
    collegeId: "col-005",
    collegeName: "Siddaganga Institute of Technology (SIT), Tumakuru",
    usn: "1SI22CS132",
    university: "Visvesvaraya Technological University",
    graduateType: "BE",
    branch: "Computer Science & Engineering",
    semester: 8,
    passingYear: 2026,
    cgpa: 7.9,
    tenthPercentage: 82.0,
    twelfthPercentage: 80.0,
    city: "Tumakuru",
    district: "Tumakuru",
    state: "Karnataka",
    preferredTrainingMode: "Offline Campus",
    driveId: "drv-2026-001",
    driveName: "Karnataka State-wide CSR Engineering Drive 2026",
    selectedCourse: "Software Testing & Automation",
    batch: "2026 Batch Alpha",
    registeredAt: "2026-08-18T10:00:00Z",
    status: "Rejected",
    githubUrl: "https://github.com/rohangowda-qa",
    resumeUrl: "/documents/resumes/Resume_Rohan_SIT.pdf",
    skills: ["Manual Testing", "Selenium", "Core Java"],
    exam: {
      score: 54,
      maxScore: 100,
      percentage: 54,
      cutoff: 50,
      percentile: 52.0,
      statewideRank: 210,
      collegeRank: 24,
      branchRank: 20,
      correct: 22,
      wrong: 18,
      skipped: 0,
      timeTakenMinutes: 49,
      violationsCount: 2,
      tabSwitchCount: 2,
      telemetryStatus: "Flagged",
      sectionAnalysis: [
        { section: "QA Concepts", score: 15, total: 25, accuracy: 60 },
        { section: "Automation Basics", score: 14, total: 25, accuracy: 56 },
        { section: "Aptitude", score: 13, total: 25, accuracy: 52 },
        { section: "Logic", score: 12, total: 25, accuracy: 48 },
      ],
    },
    projects: [
      {
        id: "prj-501",
        title: "E-Commerce Test Automation Suite",
        description: "Basic Selenium WebDriver tests for login and cart checkout.",
        techStack: ["Java", "Selenium", "TestNG"],
        githubUrl: "https://github.com/rohangowda-qa/selenium-cart",
        rating: 2.5,
      },
    ],
    technicalEvaluation: {
      programmingKnowledge: 4,
      domainKnowledge: 4,
      sqlDatabase: 3,
      problemSolving: 3,
      debugging: 4,
      apiKnowledge: 3,
      aiConcepts: 2,
      testingKnowledge: 5,
      dataStructures: 3,
      projectExplanation: 4,
      codingLogic: 3,
      overallScore: 3.5,
      remarks: "Candidate struggled with basic OOP concepts, cannot write simple XPath or handle dynamic waits.",
    },
    hrEvaluation: {
      communication: 5,
      confidence: 5,
      presentation: 4,
      englishArticulation: 5,
      teamwork: 6,
      leadership: 4,
      learningAbility: 5,
      careerInterest: 6,
      availability: 8,
      overallScore: 5.1,
      remarks: "Not prepared for technical questioning. Below required benchmark.",
    },
    decision: {
      outcome: "Rejected",
      rejectionStage: "Technical Round 1",
      reason: "Below technical cutoff standards in coding, OOP fundamentals, and SQL queries.",
      decidedBy: "Arun Menon",
      timestamp: "2026-09-24T12:00:00Z",
      notes: "Offered advice to practice data structures and retake standard skill bridge.",
    },
    timeline: [
      { id: "tl-501", timestamp: "2026-08-18 10:00", stage: "Registration", title: "Registered for Drive", description: "Registered through SIT Placement.", actor: "SIT PTO", type: "info" },
      { id: "tl-502", timestamp: "2026-09-20 10:00", stage: "Assessment", title: "Marginal Cutoff Pass (54%)", description: "2 tab switches flagged.", actor: "Proctor Engine", type: "warning" },
      { id: "tl-503", timestamp: "2026-09-24 12:00", stage: "Decision", title: "Marked as REJECTED", description: "Did not meet technical threshold.", actor: "Arun Menon (HR)", type: "danger" },
    ],
  },
  {
    id: "stu-006",
    studentId: "GQT-2026-0245",
    fullName: "Nikhil B. Patil",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face",
    email: "nikhil.patil@bldeacet.ac.in",
    mobile: "+91 98455 66778",
    whatsapp: "+91 98455 66778",
    collegeId: "col-006",
    collegeName: "BLDEA's V.P. Dr. P.G. Halakatti College of Engg, Vijayapura",
    usn: "2BL22CS045",
    university: "Visvesvaraya Technological University",
    graduateType: "BE",
    branch: "Computer Science & Engineering",
    semester: 8,
    passingYear: 2026,
    cgpa: 8.35,
    tenthPercentage: 86.4,
    twelfthPercentage: 84.2,
    city: "Vijayapura",
    district: "Vijayapura",
    state: "Karnataka",
    preferredTrainingMode: "Virtual Live",
    driveId: "drv-2026-001",
    driveName: "Karnataka State-wide CSR Engineering Drive 2026",
    selectedCourse: "Java Full Stack + Agentic AI",
    batch: "2026 Batch Alpha",
    registeredAt: "2026-08-19T14:00:00Z",
    status: "Not Attended",
    githubUrl: "https://github.com/nikhilpatil-dev",
    skills: ["Java", "Spring Boot", "SQL"],
    exam: {
      score: 82,
      maxScore: 100,
      percentage: 82,
      cutoff: 50,
      percentile: 94.5,
      statewideRank: 26,
      collegeRank: 1,
      branchRank: 1,
      correct: 33,
      wrong: 5,
      skipped: 2,
      timeTakenMinutes: 45,
      violationsCount: 0,
      tabSwitchCount: 0,
      telemetryStatus: "Clean Verified",
      sectionAnalysis: [
        { section: "Java & OOP", score: 23, total: 25, accuracy: 92 },
        { section: "SQL & DB", score: 21, total: 25, accuracy: 84 },
        { section: "Aptitude", score: 20, total: 25, accuracy: 80 },
        { section: "AI Concepts", score: 18, total: 25, accuracy: 72 },
      ],
    },
    projects: [],
    interviewSlot: {
      id: "slot-104",
      date: "2026-09-24",
      time: "09:00 AM - 09:45 AM",
      mode: "Online",
      meetingLink: "https://meet.google.com/bld-java-panel",
      panelMembers: ["Priya Nair"],
      hrExecutive: "Priya Nair",
      stage: "Technical Interview Round 1",
    },
    decision: {
      outcome: "Not Attended",
      reason: "Candidate did not join meeting link; phone was switched off during slot window.",
      decidedBy: "Priya Nair",
      timestamp: "2026-09-24T09:55:00Z",
      notes: "PTO informed about network outage in Vijayapura. Candidate requested reschedule.",
    },
    timeline: [
      { id: "tl-601", timestamp: "2026-08-19 14:00", stage: "Registration", title: "Registered for Drive", description: "Top student from Vijayapura region.", actor: "BLDEA PTO", type: "info" },
      { id: "tl-602", timestamp: "2026-09-20 10:00", stage: "Assessment", title: "Exam Rank #26 (82%)", description: "Excellent high-tier score.", actor: "Evaluation Engine", type: "success" },
      { id: "tl-603", timestamp: "2026-09-24 09:55", stage: "Attendance", title: "Flagged as NOT ATTENDED", description: "Candidate failed to join morning slot. Reschedule requested.", actor: "Priya Nair (HR)", type: "warning" },
    ],
  },
];

export function convertStudentToCandidateProfile(s: Student): CandidateFullProfile {
  const latestInterview = s.interviews && s.interviews.length > 0 ? s.interviews[s.interviews.length - 1] : undefined;
  
  let mappedStatus: CandidateFullProfile["status"] = "Qualified";
  const stLower = (s.status || "").toLowerCase();
  if (stLower.includes("selected")) mappedStatus = "Selected";
  else if (stLower.includes("interview")) mappedStatus = "Interview Scheduled";
  else if (stLower.includes("hold")) mappedStatus = "Hold";
  else if (stLower.includes("reject")) mappedStatus = "Rejected";
  else if (stLower.includes("not attended")) mappedStatus = "Not Attended";
  else if (stLower.includes("accepted")) mappedStatus = "Offer Accepted";
  else if (stLower.includes("sent") || stLower.includes("offered")) mappedStatus = "Offer Sent";
  else if (stLower.includes("pending")) mappedStatus = "Under Review";

  const examScore = s.examScore ?? s.examResult?.marksObtained ?? 0;

  return {
    id: s.id,
    studentId: s.studentId || (s.id.startsWith("std-") ? `GQT-${s.id.replace("std-", "")}` : s.id),
    fullName: s.fullName || "",
    photoUrl: s.photoUrl || "",
    email: s.email || "",
    mobile: s.mobile || "",
    whatsapp: s.mobile || "",
    collegeId: s.collegeId || "",
    collegeName: s.collegeName || "",
    usn: s.usn || "",
    university: "",
    graduateType: "",
    branch: s.branch || "",
    semester: 8,
    passingYear: s.passingYear || new Date().getFullYear(),
    cgpa: s.cgpa || 0,
    tenthPercentage: 0,
    twelfthPercentage: 0,
    city: "",
    district: "",
    state: "",
    preferredTrainingMode: "",
    driveId: s.driveId || "",
    driveName: s.driveName || "",
    selectedCourse: s.selectedCourse || "",
    batch: s.batch || "",
    registeredAt: s.registeredAt || new Date().toISOString(),
    status: mappedStatus,
    skills: s.skills || [],
    exam: {
      score: examScore,
      maxScore: 100,
      percentage: Math.round(examScore),
      cutoff: 50,
      percentile: examScore ? Math.round(examScore * 0.95 * 10) / 10 : 0,
      statewideRank: 0,
      collegeRank: 0,
      branchRank: 0,
      correct: Math.round(examScore / 2),
      wrong: 0,
      skipped: 0,
      timeTakenMinutes: 0,
      violationsCount: 0,
      tabSwitchCount: 0,
      telemetryStatus: "Clean Verified",
      sectionAnalysis: [],
    },
    projects: [],
    interviewSlot: latestInterview ? {
      id: latestInterview.id || `slot-${s.id}`,
      date: latestInterview.scheduledSlot ? latestInterview.scheduledSlot.split("T")[0] : "",
      time: latestInterview.scheduledSlot ? (latestInterview.scheduledSlot.split("T")[1]?.slice(0, 5) || "") : "",
      mode: latestInterview.meetingLink ? "Online" : "Offline",
      meetingLink: latestInterview.meetingLink || "",
      panelMembers: latestInterview.interviewerName ? [latestInterview.interviewerName] : [],
      hrExecutive: latestInterview.interviewerName || "",
      stage: latestInterview.interviewerRole || "Technical Interview",
    } : undefined,
    offerData: (s.offer || s.offerDetails) ? {
      joiningRole: (s.offer || s.offerDetails)?.roleTitle || "",
      course: (s.offer || s.offerDetails)?.roleTitle || s.selectedCourse || "",
      batch: s.batch || "",
      joiningDate: (s.offer || s.offerDetails)?.joiningDate || "",
      reportingTime: "",
      reportingLocation: "",
      trainingCenter: "",
      ctc: (s.offer || s.offerDetails)?.ctc ? `${(s.offer || s.offerDetails)?.ctc}` : "",
      stipend: "",
      offerStatus: s.offerAccepted ? "Accepted" : "Offer Generated",
    } : undefined,
    timeline: [
      {
        id: `tl-${s.id}-1`,
        timestamp: s.registeredAt || new Date().toISOString(),
        stage: "Registration",
        title: "Candidate Profile Synchronized",
        description: s.driveName ? `Enrolled for ${s.driveName}` : "Candidate Registered",
        actor: "System",
        type: "info",
      },
    ],
  };
}

export function getLiveCandidateProfiles(students: Student[]): CandidateFullProfile[] {
  if (!students || students.length === 0) return [];
  return students.map(convertStudentToCandidateProfile);
}
