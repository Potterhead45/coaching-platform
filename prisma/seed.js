const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Coaching Centre Platform...');

  // 1. Clean existing records
  await prisma.studentAnswer.deleteMany();
  await prisma.testAttempt.deleteMany();
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.courseEnrollment.deleteMany();
  await prisma.mockTest.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.course.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('admin123', 10);
  const studentPasswordHash = await bcrypt.hash('student123', 10);

  // 2. Create Users
  const adminUser = await prisma.user.create({
    data: {
      name: 'Dr. Rajesh Sharma (Director & Admin)',
      email: 'admin@apexcoaching.com',
      password: passwordHash,
      role: 'ADMIN',
      phone: '+91 98765 43210',
      status: 'ACTIVE',
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      name: 'Aarav Patel',
      email: 'student@apexcoaching.com',
      password: studentPasswordHash,
      role: 'STUDENT',
      phone: '+91 91234 56789',
      status: 'ACTIVE',
    },
  });

  const studentUser2 = await prisma.user.create({
    data: {
      name: 'Priya Verma',
      email: 'priya.verma@apexcoaching.com',
      password: studentPasswordHash,
      role: 'STUDENT',
      phone: '+91 98111 22334',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Users created: Admin & Students');

  // 3. Create Courses
  const course1 = await prisma.course.create({
    data: {
      title: 'JEE Advanced & Main Physics-Math Masterclass',
      slug: 'jee-physics-math-masterclass',
      description: 'Comprehensive test series and concept booster program designed by ex-IITians for JEE aspirants.',
      targetExam: 'JEE Advanced / Main',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
      isFeatured: true,
      price: 1999,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'NEET-UG Medical Excellence Biology & Chemistry',
      slug: 'neet-medical-excellence',
      description: 'NCERT line-by-line concept maps, high-yield chapter tests, and national rank benchmark mocks.',
      targetExam: 'NEET-UG',
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
      isFeatured: true,
      price: 1499,
    },
  });

  const course3 = await prisma.course.create({
    data: {
      title: 'Class 12 Boards & CUET Foundation Sprint',
      slug: 'class-12-boards-cuet-sprint',
      description: 'Structured chapter tests with step marking guidance and rapid revision notes for 95%+ target.',
      targetExam: 'CBSE / State Boards & CUET',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
      isFeatured: false,
      price: 999,
    },
  });

  console.log('✅ Courses created');

  // 4. Create Chapters
  const ch1_1 = await prisma.chapter.create({
    data: {
      courseId: course1.id,
      title: 'Kinematics & Newton’s Laws of Motion',
      chapterNumber: 1,
      description: '1D & 2D Motion, Projectile, Relative Velocity, Friction, and Constrained Motion.',
      notes: 'Key formulas: v = u + at, s = ut + 0.5at², v² = u² + 2as. Friction f ≤ μN.',
    },
  });

  const ch1_2 = await prisma.chapter.create({
    data: {
      courseId: course1.id,
      title: 'Work, Power, Energy & Circular Motion',
      chapterNumber: 2,
      description: 'Work-Energy Theorem, Potential Energy Curves, Vertical Circle & Centripetal Acceleration.',
      notes: 'Work done W = ∫ F · dr. Kinetic energy = 0.5mv².',
    },
  });

  const ch1_3 = await prisma.chapter.create({
    data: {
      courseId: course1.id,
      title: 'Definite Integrals & Differential Calculus',
      chapterNumber: 3,
      description: 'Leibniz Rule, Area under curves, Limits & Derivatives.',
      notes: 'Fundamental theorem of calculus: d/dx ∫[a to x] f(t)dt = f(x).',
    },
  });

  const ch2_1 = await prisma.chapter.create({
    data: {
      courseId: course2.id,
      title: 'Human Physiology & Endocrine Coordination',
      chapterNumber: 1,
      description: 'Neural Control, Chemical Coordination, and Circulation.',
      notes: 'Hormones, Hypothalamus-Pituitary axis, Cardiac cycle.',
    },
  });

  console.log('✅ Chapters created');

  // 5. Create Mock Tests
  // Test 1: Full Mock (Paid - ₹499)
  const mockTest1 = await prisma.mockTest.create({
    data: {
      title: 'All India Grand Mock Test 01 - Physics & Mathematics',
      slug: 'grand-mock-test-01-physics-math',
      description: 'Standard exam pattern test with strict timer, negative marking, and real-time rank benchmark analysis.',
      courseId: course1.id,
      category: 'Full Mock',
      durationMinutes: 30,
      totalMarks: 40,
      positiveMarks: 4,
      negativeMarks: 1,
      passingMarks: 16,
      isPublished: true,
      isFree: false,
      price: 499,
    },
  });

  // Test 2: Free Diagnostic Test (Free)
  const mockTest2 = await prisma.mockTest.create({
    data: {
      title: 'NEET Diagnostic Assessment - Biology & Chemistry Basics',
      slug: 'neet-diagnostic-assessment-biology-chemistry',
      description: 'Evaluate your fundamental concepts in Cell Biology and Chemical Bonding with detailed answer explanations.',
      courseId: course2.id,
      category: 'Diagnostic',
      durationMinutes: 20,
      totalMarks: 24,
      positiveMarks: 4,
      negativeMarks: 1,
      passingMarks: 10,
      isPublished: true,
      isFree: true,
      price: 0,
    },
  });

  // Test 3: Chapter Test (Free)
  const mockTest3 = await prisma.mockTest.create({
    data: {
      title: 'Chapter Test: Kinematics & Motion in a Straight Line',
      slug: 'chapter-test-kinematics-1d',
      description: 'Quick 15-minute concept review test on 1D motion, acceleration graphs, and free fall.',
      courseId: course1.id,
      chapterId: ch1_1.id,
      category: 'Chapter Test',
      durationMinutes: 15,
      totalMarks: 20,
      positiveMarks: 4,
      negativeMarks: 1,
      passingMarks: 8,
      isPublished: true,
      isFree: true,
      price: 0,
    },
  });

  console.log('✅ Mock Tests created');

  // 6. Create Questions for Mock Test 1 (Full Mock)
  const q1 = await prisma.question.create({
    data: {
      mockTestId: mockTest1.id,
      questionText: 'A particle starts from rest with uniform acceleration a = 4 m/s². What is the distance covered by the particle in the 5th second of its motion?',
      questionType: 'SINGLE_CHOICE',
      positiveMarks: 4,
      negativeMarks: 1,
      subject: 'Physics',
      orderIndex: 1,
      explanation: 'Formula for distance in the nth second: S_n = u + (a/2)(2n - 1). Here initial velocity u = 0, acceleration a = 4 m/s², and n = 5. Therefore, S_5 = 0 + (4/2)(2 × 5 - 1) = 2 × (10 - 1) = 2 × 9 = 18 meters.',
    },
  });

  await prisma.option.createMany({
    data: [
      { questionId: q1.id, optionLabel: 'A', optionText: '16 m', isCorrect: false, orderIndex: 1 },
      { questionId: q1.id, optionLabel: 'B', optionText: '18 m', isCorrect: true, orderIndex: 2 },
      { questionId: q1.id, optionLabel: 'C', optionText: '20 m', isCorrect: false, orderIndex: 3 },
      { questionId: q1.id, optionLabel: 'D', optionText: '22 m', isCorrect: false, orderIndex: 4 },
    ],
  });

  const q2 = await prisma.question.create({
    data: {
      mockTestId: mockTest1.id,
      questionText: 'Evaluate the limit: lim (x → 0) [(sin(3x) · tan(2x)) / x²].',
      questionType: 'SINGLE_CHOICE',
      positiveMarks: 4,
      negativeMarks: 1,
      subject: 'Mathematics',
      orderIndex: 2,
      explanation: 'We know that lim (x → 0) [sin(kx) / (kx)] = 1 and lim (x → 0) [tan(mx) / (mx)] = 1. We can rewrite the expression as: [sin(3x)/(3x)] × [tan(2x)/(2x)] × (3 × 2) = 1 × 1 × 6 = 6.',
    },
  });

  await prisma.option.createMany({
    data: [
      { questionId: q2.id, optionLabel: 'A', optionText: '5', isCorrect: false, orderIndex: 1 },
      { questionId: q2.id, optionLabel: 'B', optionText: '6', isCorrect: true, orderIndex: 2 },
      { questionId: q2.id, optionLabel: 'C', optionText: '3/2', isCorrect: false, orderIndex: 3 },
      { questionId: q2.id, optionLabel: 'D', optionText: '1', isCorrect: false, orderIndex: 4 },
    ],
  });

  const q3 = await prisma.question.create({
    data: {
      mockTestId: mockTest1.id,
      questionText: 'A block of mass 2 kg rests on a rough horizontal plane with coefficient of static friction μ = 0.4. A horizontal force of 6 N is applied on the block (take g = 10 m/s²). What is the frictional force acting on the block?',
      questionType: 'SINGLE_CHOICE',
      positiveMarks: 4,
      negativeMarks: 1,
      subject: 'Physics',
      orderIndex: 3,
      explanation: 'Maximum limiting static friction f_max = μN = μmg = 0.4 × 2 × 10 = 8 N. Since the applied force F = 6 N is less than f_max (8 N), the block remains at rest. Static friction is self-adjusting, so the acting frictional force equals the applied force = 6 N.',
    },
  });

  await prisma.option.createMany({
    data: [
      { questionId: q3.id, optionLabel: 'A', optionText: '8 N', isCorrect: false, orderIndex: 1 },
      { questionId: q3.id, optionLabel: 'B', optionText: '6 N', isCorrect: true, orderIndex: 2 },
      { questionId: q3.id, optionLabel: 'C', optionText: '0 N', isCorrect: false, orderIndex: 3 },
      { questionId: q3.id, optionLabel: 'D', optionText: '4.8 N', isCorrect: false, orderIndex: 4 },
    ],
  });

  const q4 = await prisma.question.create({
    data: {
      mockTestId: mockTest1.id,
      questionText: 'If the roots of the quadratic equation x² - px + q = 0 differ by unity, then which of the following relations holds true?',
      questionType: 'SINGLE_CHOICE',
      positiveMarks: 4,
      negativeMarks: 1,
      subject: 'Mathematics',
      orderIndex: 4,
      explanation: 'Let roots be α and β. Sum of roots (α + β) = p, product of roots (αβ) = q. Given |α - β| = 1. Squaring both sides: (α - β)² = 1 ⟹ (α + β)² - 4αβ = 1 ⟹ p² - 4q = 1 ⟹ p² = 4q + 1 (or p² - 4q - 1 = 0).',
    },
  });

  await prisma.option.createMany({
    data: [
      { questionId: q4.id, optionLabel: 'A', optionText: 'p² = 4q + 1', isCorrect: true, orderIndex: 1 },
      { questionId: q4.id, optionLabel: 'B', optionText: 'p² = 4q - 1', isCorrect: false, orderIndex: 2 },
      { questionId: q4.id, optionLabel: 'C', optionText: 'q² = 4p + 1', isCorrect: false, orderIndex: 3 },
      { questionId: q4.id, optionLabel: 'D', optionText: 'p² + 4q = 1', isCorrect: false, orderIndex: 4 },
    ],
  });

  const q5 = await prisma.question.create({
    data: {
      mockTestId: mockTest1.id,
      questionText: 'The escape velocity from the surface of Earth is v_e. What would be the escape velocity from a planet having twice the mass and twice the radius of Earth?',
      questionType: 'SINGLE_CHOICE',
      positiveMarks: 4,
      negativeMarks: 1,
      subject: 'Physics',
      orderIndex: 5,
      explanation: 'Escape velocity formula: v_e = √(2GM / R). For the new planet with mass 2M and radius 2R: v_e\' = √(2G(2M) / (2R)) = √(2GM / R) = v_e. The escape velocity remains unchanged.',
    },
  });

  await prisma.option.createMany({
    data: [
      { questionId: q5.id, optionLabel: 'A', optionText: '2 v_e', isCorrect: false, orderIndex: 1 },
      { questionId: q5.id, optionLabel: 'B', optionText: 'v_e', isCorrect: true, orderIndex: 2 },
      { questionId: q5.id, optionLabel: 'C', optionText: 'v_e / 2', isCorrect: false, orderIndex: 3 },
      { questionId: q5.id, optionLabel: 'D', optionText: '√2 v_e', isCorrect: false, orderIndex: 4 },
    ],
  });

  // Questions for Test 2 (NEET Diagnostic)
  const q2_1 = await prisma.question.create({
    data: {
      mockTestId: mockTest2.id,
      questionText: 'Which organelle is known as the "Powerhouse of the Cell" due to ATP generation through cellular respiration?',
      questionType: 'SINGLE_CHOICE',
      positiveMarks: 4,
      negativeMarks: 1,
      subject: 'Biology',
      orderIndex: 1,
      explanation: 'Mitochondria are double membrane-bound organelles that produce adenosine triphosphate (ATP), the primary energy currency of the cell, via oxidative phosphorylation and the Krebs cycle.',
    },
  });

  await prisma.option.createMany({
    data: [
      { questionId: q2_1.id, optionLabel: 'A', optionText: 'Endoplasmic Reticulum', isCorrect: false, orderIndex: 1 },
      { questionId: q2_1.id, optionLabel: 'B', optionText: 'Golgi Apparatus', isCorrect: false, orderIndex: 2 },
      { questionId: q2_1.id, optionLabel: 'C', optionText: 'Mitochondria', isCorrect: true, orderIndex: 3 },
      { questionId: q2_1.id, optionLabel: 'D', optionText: 'Lysosome', isCorrect: false, orderIndex: 4 },
    ],
  });

  const q2_2 = await prisma.question.create({
    data: {
      mockTestId: mockTest2.id,
      questionText: 'What is the hybridization and geometric shape of the methane (CH₄) molecule?',
      questionType: 'SINGLE_CHOICE',
      positiveMarks: 4,
      negativeMarks: 1,
      subject: 'Chemistry',
      orderIndex: 2,
      explanation: 'In CH₄, the central carbon atom forms 4 single covalent bonds with 0 lone pairs. Steric number = 4 + 0 = 4, resulting in sp³ hybridization and a regular tetrahedral geometry with bond angle 109.5°.',
    },
  });

  await prisma.option.createMany({
    data: [
      { questionId: q2_2.id, optionLabel: 'A', optionText: 'sp² - Trigonal Planar', isCorrect: false, orderIndex: 1 },
      { questionId: q2_2.id, optionLabel: 'B', optionText: 'sp³ - Tetrahedral', isCorrect: true, orderIndex: 2 },
      { questionId: q2_2.id, optionLabel: 'C', optionText: 'sp - Linear', isCorrect: false, orderIndex: 3 },
      { questionId: q2_2.id, optionLabel: 'D', optionText: 'dsp² - Square Planar', isCorrect: false, orderIndex: 4 },
    ],
  });

  const q2_3 = await prisma.question.create({
    data: {
      mockTestId: mockTest2.id,
      questionText: 'Which hormone is responsible for lowering blood glucose levels by promoting glucose uptake in cells?',
      questionType: 'SINGLE_CHOICE',
      positiveMarks: 4,
      negativeMarks: 1,
      subject: 'Biology',
      orderIndex: 3,
      explanation: 'Insulin is a peptide hormone secreted by the beta cells of the Islets of Langerhans in the pancreas. It stimulates glycogenesis and cellular glucose uptake, lowering blood sugar levels.',
    },
  });

  await prisma.option.createMany({
    data: [
      { questionId: q2_3.id, optionLabel: 'A', optionText: 'Glucagon', isCorrect: false, orderIndex: 1 },
      { questionId: q2_3.id, optionLabel: 'B', optionText: 'Insulin', isCorrect: true, orderIndex: 2 },
      { questionId: q2_3.id, optionLabel: 'C', optionText: 'Thyroxine', isCorrect: false, orderIndex: 3 },
      { questionId: q2_3.id, optionLabel: 'D', optionText: 'Adrenaline', isCorrect: false, orderIndex: 4 },
    ],
  });

  // Questions for Test 3 (Kinematics 1D)
  const q3_1 = await prisma.question.create({
    data: {
      mockTestId: mockTest3.id,
      questionText: 'The velocity-time graph of a moving object is a straight line passing through origin making an angle θ with the time axis. What physical quantity is represented by the slope of this graph?',
      questionType: 'SINGLE_CHOICE',
      positiveMarks: 4,
      negativeMarks: 1,
      subject: 'Physics',
      orderIndex: 1,
      explanation: 'The slope of a velocity-time graph is defined as dv/dt, which represents instantaneous acceleration. The area under the v-t graph represents displacement.',
    },
  });

  await prisma.option.createMany({
    data: [
      { questionId: q3_1.id, optionLabel: 'A', optionText: 'Displacement', isCorrect: false, orderIndex: 1 },
      { questionId: q3_1.id, optionLabel: 'B', optionText: 'Acceleration', isCorrect: true, orderIndex: 2 },
      { questionId: q3_1.id, optionLabel: 'C', optionText: 'Momentum', isCorrect: false, orderIndex: 3 },
      { questionId: q3_1.id, optionLabel: 'D', optionText: 'Speed', isCorrect: false, orderIndex: 4 },
    ],
  });

  console.log('✅ Questions and Options created');

  // 7. Seed a Past Attempt for the Student (so they have immediate visual stats in dashboard)
  const sampleAttempt = await prisma.testAttempt.create({
    data: {
      userId: studentUser.id,
      mockTestId: mockTest2.id,
      score: 8,
      totalMarks: 12,
      accuracy: 66.7,
      correctCount: 2,
      incorrectCount: 1,
      unattemptedCount: 0,
      timeSpentSeconds: 420,
      status: 'SUBMITTED',
      submittedAt: new Date(),
    },
  });

  // Fetch options for test 2 questions
  const q2_1_opts = await prisma.option.findMany({ where: { questionId: q2_1.id } });
  const q2_2_opts = await prisma.option.findMany({ where: { questionId: q2_2.id } });
  const q2_3_opts = await prisma.option.findMany({ where: { questionId: q2_3.id } });

  const correctOpt1 = q2_1_opts.find(o => o.isCorrect);
  const correctOpt2 = q2_2_opts.find(o => o.isCorrect);
  const incorrectOpt3 = q2_3_opts.find(o => !o.isCorrect);

  await prisma.studentAnswer.createMany({
    data: [
      {
        testAttemptId: sampleAttempt.id,
        questionId: q2_1.id,
        selectedOptionId: correctOpt1?.id,
        isCorrect: true,
        marksAwarded: 4,
        timeSpentSeconds: 95,
      },
      {
        testAttemptId: sampleAttempt.id,
        questionId: q2_2.id,
        selectedOptionId: correctOpt2?.id,
        isCorrect: true,
        marksAwarded: 4,
        timeSpentSeconds: 140,
      },
      {
        testAttemptId: sampleAttempt.id,
        questionId: q2_3.id,
        selectedOptionId: incorrectOpt3?.id,
        isCorrect: false,
        marksAwarded: -1,
        timeSpentSeconds: 185,
      },
    ],
  });

  // 8. Seed sample payment
  await prisma.payment.create({
    data: {
      orderId: 'ORDER_SEED_2026_01',
      userId: studentUser.id,
      mockTestId: mockTest1.id,
      amount: 499,
      currency: 'INR',
      gateway: 'SANDBOX',
      paymentId: 'SIM_TXN_SEED_9941',
      status: 'COMPLETED',
      invoiceNumber: 'INV-2026-APX01',
    },
  });

  await prisma.payment.create({
    data: {
      orderId: 'ORDER_SEED_2026_02',
      userId: studentUser2.id,
      courseId: course1.id,
      amount: 1999,
      currency: 'INR',
      gateway: 'RAZORPAY',
      paymentId: 'pay_rzp_demo_88219',
      status: 'COMPLETED',
      invoiceNumber: 'INV-2026-APX02',
    },
  });

  // 9. Site Settings
  await prisma.siteSetting.createMany({
    data: [
      { key: 'INSTITUTE_NAME', value: 'Apex Academy & Test Prep Institute' },
      { key: 'PHONE', value: '+91 98765 43210' },
      { key: 'EMAIL', value: 'contact@apexcoaching.com' },
      { key: 'ADDRESS', value: '42 Knowledge Park, Sector 62, Noida, NCR, India' },
      { key: 'HERO_TITLE', value: 'Crack Top Competitive Exams with India’s Most Precise Mock Tests & Analytics' },
    ],
  });

  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
