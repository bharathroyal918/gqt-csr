const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const url = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
const key = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

const supabase = createClient(url, key);

async function seed() {
  console.log('--- SEEDING & SYNCING SUPABASE DATA ---');

  // 1. Seed CSR Drives
  const drivesData = [
    {
      id: "10000000-0000-0000-0000-000000000001",
      drive_code: "GQT-CSR-2026-KA",
      academic_year: "2025-2026",
      name: "Karnataka State-wide CSR Engineering Drive 2026",
      category: "CSR Flagship",
      mode: "Hybrid",
      status: "Registration Open",
      description: "Statewide CSR technical enablement initiative across VTU and autonomous engineering institutions.",
      location: "Bengaluru, Karnataka",
      district: "Bengaluru Urban",
      state: "Karnataka",
      batch: "2026",
      courses: ["Java Full Stack + Agentic AI", "Python & AI Engineering", "Data Analytics & SQL"],
      eligible_departments: ["Computer Science & Engineering", "Information Science & Engineering", "Electronics & Communication"],
      graduation_types: ["BE", "B.Tech", "MCA"],
      min_percentage: 60,
      min_cgpa: 6.5,
      assignments: {
        hrLeadName: "Hitha, Kusuma",
        trainer: "Dr. K. Srinivas",
        placementManager: "Kiran"
      },
      metrics: {
        collegesCount: 3,
        registeredStudents: 1,
        qualifiedStudents: 1,
        interviewSelected: 1,
        offerLettersSent: 1,
        acceptedOffers: 1
      }
    },
    {
      id: "10000000-0000-0000-0000-000000000002",
      drive_code: "GQT-CSR-2026-NK",
      academic_year: "2025-2026",
      name: "North Karnataka Rural Engineering Uplift CSR Drive",
      category: "CSR Flagship",
      mode: "Hybrid",
      status: "Exam In Progress",
      description: "Empowering rural engineering colleges with high-tier tech hiring and CSR certification.",
      location: "Hubballi-Dharwad, Karnataka",
      district: "Dharwad",
      state: "Karnataka",
      batch: "2026",
      courses: ["Java Full Stack + Agentic AI", "Cloud DevOps & Kubernetes"],
      eligible_departments: ["Computer Science & Engineering", "Information Science & Engineering"],
      graduation_types: ["BE", "B.Tech"],
      min_percentage: 60,
      min_cgpa: 6.0,
      assignments: {
        hrLeadName: "Divya.H",
        trainer: "Arun Menon",
        placementManager: "Kiran"
      },
      metrics: {
        collegesCount: 2,
        registeredStudents: 0,
        qualifiedStudents: 0,
        interviewSelected: 0,
        offerLettersSent: 0,
        acceptedOffers: 0
      }
    }
  ];

  for (const d of drivesData) {
    const { error } = await supabase.from('drives').upsert([d]);
    console.log(`Upsert drive [${d.name}]:`, error ? error.message : 'OK');
  }

  // 2. Update Student Profile in Supabase
  const studentUpdate = {
    college_id: "00000000-0000-0000-0000-000000000001",
    drive_id: "10000000-0000-0000-0000-000000000001",
    status: "Qualified",
    selected_course: "Java Full Stack + Agentic AI",
    batch: "2026",
    branch: "Computer Science & Engineering",
    semester: 8,
    passing_year: 2026,
    cgpa: 9.15,
    percentage: 91.5,
    usn: "1RV22CS001",
    full_name: "Bharath Royal",
    email: "bharathroyal3234@gmail.com",
    mobile: "+91 91825 83234",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    pincode: "560059",
    preferred_training_mode: "Hybrid",
    terms_accepted: true
  };

  const { error: stuErr } = await supabase
    .from('students')
    .update(studentUpdate)
    .eq('email', 'bharathroyal3234@gmail.com');
  console.log('Update student record:', stuErr ? stuErr.message : 'OK');

  // 3. Upsert Live Interview for Student
  const interviewData = {
    id: "int-001",
    student_id: "std-1790247326265",
    drive_id: "10000000-0000-0000-0000-000000000001",
    interviewer_name: "Priya Nair",
    interviewer_role: "HR Executive Lead",
    scheduled_slot: new Date(Date.now() + 86400000).toISOString(),
    meeting_link: "https://meet.google.com/gqt-csr-bharath",
    status: "Scheduled",
    remarks: "Top rank candidate in technical assessment. Scheduled for final HR interview round."
  };

  const { error: intErr } = await supabase.from('interviews').upsert([interviewData]);
  console.log('Upsert interview record:', intErr ? intErr.message : 'OK');

  // 4. Upsert Live Offer Letter for Student
  const offerData = {
    id: "off-001",
    offer_number: "GQT/OFFER/2026/001",
    student_id: "std-1790247326265",
    drive_id: "10000000-0000-0000-0000-000000000001",
    role_title: "Associate Software Engineer",
    course: "Java Full Stack + Agentic AI",
    batch: "2026",
    ctc: "₹ 6.50 LPA",
    stipend_during_internship: "₹ 18,000 / month",
    location: "Bengaluru, Karnataka",
    joining_date: "2026-07-01",
    status: "Sent",
    qr_verification_code: "GQT-VERIFY-OFFER-001-2026"
  };

  const { error: offErr } = await supabase.from('offers').upsert([offerData]);
  console.log('Upsert offer record:', offErr ? offErr.message : 'OK');

  // 5. Add notification
  const notifData = {
    id: "notif-001",
    title: "Hall Ticket Verified & Examination Seat Allocated",
    message: "Your application for Karnataka State-wide CSR Engineering Drive 2026 has been approved.",
    type: "info",
    channel: "In-App",
    target_roles: ["student", "hr", "super_admin"],
    read: false,
    action_url: "/student/exam"
  };

  const { error: notifErr } = await supabase.from('notifications').upsert([notifData]);
  console.log('Upsert notification record:', notifErr ? notifErr.message : 'OK');

  console.log('--- SYNC COMPLETE ---');
}

seed();
