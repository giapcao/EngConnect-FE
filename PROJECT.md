# [cite_start]3. Register content of Capstone Project [cite: 1]

**3.1. [cite_start]Capstone Project name:** [cite: 2]

- [cite_start]**English:** EngConnect – Your AI-Powered English Learning Platform [cite: 3]
- [cite_start]**Vietnamese:** EngConnect – Nền tảng học tiếng Anh thông minh với AI [cite: 4]
- [cite_start]**Abbreviation:** EC [cite: 5]

---

## [cite_start]Context [cite: 6]

[cite_start]The demand for high-quality, flexible 1-on-1 English learning is increasing rapidly, especially among learners who require personalized guidance and predictable scheduling. [cite: 7] However, current online learning platforms still exhibit several limitations. [cite_start]Scheduling systems are often rigid, making it difficult for students and tutors to find mutually convenient times. [cite: 8] [cite_start]Post-lesson support is fragmented, offering little help for students to reinforce and improve what they have learned. [cite: 9] [cite_start]Additionally, students face challenges in selecting suitable tutors due to insufficient information transparency and inconsistent quality assurance. [cite: 10]

[cite_start]These issues create a gap in the market: learners need a unified, intelligent platform that simplifies tutor discovery, enables convenient and flexible booking, and provides continuous, AI-powered academic support beyond the live session. [cite: 11] [cite_start]At the same time, tutors need clearer income management, streamlined scheduling tools, and reliable systems that ensure effective session delivery and professional quality monitoring. [cite: 12]

---

## [cite_start]Proposed Solutions [cite: 13]

- [cite_start]**Dynamic Scheduling & Availability Management:** Tutors can configure weekly availability, while students can view real-time open slots and book lessons instantly. [cite: 14] [cite_start]The system automatically detects conflicts, limits weekly bookings, and supports smooth rescheduling to ensure high scheduling flexibility. [cite: 15]
- [cite_start]**Transparent Course Marketplace:** Students can browse courses with complete information: tutor profiles, teaching experience, certifications, intro videos, and learner ratings. [cite: 16] [cite_start]This helps learners make informed decisions and reduces uncertainty in tutor selection. [cite: 17]
- [cite_start]**AI-Enhanced Homework & Learning Support:** After each session, students can submit homework and receive automated AI corrections on grammar, vocabulary, structure, and clarity. [cite: 18] [cite_start]This post-class assistance creates continuous learning support that many traditional 1-on-1 platforms currently lack. [cite: 19]
- [cite_start]**Integrated Online Classroom:** EngConnect includes built-in video conferencing, screen sharing. [cite: 20] [cite_start]These tools eliminate dependency on third-party meeting applications and ensure consistent lesson quality. [cite: 21]
- [cite_start]**AI-Driven Lesson Quality Pipeline:** Every teaching session is captured, securely stored, transcribed, and analyzed by AI to evaluate lesson delivery, learner engagement, and tutor performance. [cite: 22] [cite_start]This enhances transparency, supports quality monitoring, and provides valuable insights for both tutors and administrators. [cite: 23]
- [cite_start]**Financial & Income Management System:** The platform ensures clear financial processes: students can pay through multiple channels (Momo, VNPay, PayOS), while tutors can track earnings and request withdrawals. [cite: 24] [cite_start]Administrators have access to comprehensive revenue and transaction reports. [cite: 25]

---

## [cite_start]Functional requirement [cite: 26]

### [cite_start]Student Web/Mobile App [cite: 27]

[cite_start]**Sign up & Login (Email / Google / OAuth)** [cite: 28]

- [cite_start]**Sign-up flow** [cite: 29]
  - [cite_start]Enter: Full name, Email, Phone number, Password. [cite: 30]
  - [cite_start]System sends OTP to email or phone. [cite: 31]
  - [cite_start]Student enters OTP to activate the account. [cite: 32]
- [cite_start]**Login** [cite: 33]
  - [cite_start]Login with Email + Password. [cite: 34]
  - [cite_start]Or use Google / OAuth [cite: 35]
- [cite_start]**Forgot password** [cite: 36]
  - [cite_start]Enter email/phone → receive reset link or OTP. [cite: 37]
  - [cite_start]Set a new password. [cite: 38]

[cite_start]**View course details, tutor availability.** [cite: 39]

- [cite_start]**Course list** [cite: 40]
  - [cite_start]Show all course with title, description, price, number of sessions, rating [cite: 41]
  - [cite_start]Filter by level, price, certificate, schedule [cite: 42]
- [cite_start]**Course detail** [cite: 43]
  - [cite_start]Full description, learning objective, roadmap [cite: 44]
  - [cite_start]Demo video and sample material (attach and support to study with demo video) [cite: 45]
  - [cite_start]Tutor profile: bio, experience, certificate, rating [cite: 46]
- [cite_start]**View tutor schedule** [cite: 47]
  - [cite_start]Show timeslots: [cite: 48]
    - [cite_start]Available - can be booked [cite: 49]
    - [cite_start]Booked - slot that is booked by students [cite: 50]
    - [cite_start]Unavailable - tutor not teaching [cite: 51]
- [cite_start]Students select courses (provided by tutor), then can book available slots. [cite: 52]

[cite_start]**Join the online classroom.** [cite: 53]

- [cite_start]The system will notification before 15 minutes [cite: 54]
- [cite_start]**After the class:** [cite: 55]
  - [cite_start]Students, parents, and tutors can: [cite: 56]
    - [cite_start]Rewatch the recorded lesson video. [cite: 57]
    - [cite_start]Turn bilingual subtitles on/off. [cite: 58]
    - [cite_start]View or download the full transcript of the session [cite: 59]
  - [cite_start]The system will use the transcript of the session to: [cite: 60]
    - [cite_start]Create a short summary to provide key points to help student review quickly [cite: 61]
    - [cite_start]Compare the lesson content with the syllabus (Predefined by tutor) [cite: 62]

[cite_start]**Make payments (Momo, VNPay, PayOS).** [cite: 63]

- [cite_start]Student can deposit to pay for the course [cite: 64]
- [cite_start]Student can view transaction history in the student account [cite: 65]

[cite_start]**Take quizzes.** [cite: 66]

- [cite_start]In courses, students can join some review quizzes made by tutor to review and improve skill. [cite: 67]
- Each quiz has a ranking table. [cite_start]After completing the quiz, students can check the score and their ranking in this quiz. [cite: 68]

[cite_start]**Rate, review tutors** [cite: 69]

- [cite_start]Rate tutor after sessions [cite: 70]
- [cite_start]Give 1–5 stars and write review comments. [cite: 71]
- [cite_start]Ratings are aggregated and shown on tutor/course profiles [cite: 72]

[cite_start]**Complete homework & Receive correction/support** [cite: 73]

- [cite_start]After complete the lesson, tutor can send the homework for student [cite: 74]
- Students need to complete and submit to the system. [cite_start]After that, tutor will provide the answer and the score, the review for student [cite: 75]

[cite_start]**Join the community** [cite: 76]

- [cite_start]Students can join the community to discuss, post the English question to find the answer from other students and tutors. [cite: 77]

---

### [cite_start]Admin Web System [cite: 78]

[cite_start]**User Management** [cite: 79]

- [cite_start]**Tutor Management:** [cite: 80]
  - [cite_start]**Profile Moderation:** Review, approve, or reject new Tutor registration profiles. [cite: 81]
  - [cite_start]**Account Management:** Edit information, view activity history, and suspend/ban accounts that violate terms. [cite: 82]
- [cite_start]**Student Management:** [cite: 83]
  - [cite_start]**Account Management:** Look up, edit information, reset passwords, and suspend/ban accounts. [cite: 84]
  - [cite_start]**Support:** Intervene to resolve student account-related issues. [cite: 85]

[cite_start]**Content & Quality Management** [cite: 86]

- [cite_start]**Course/Lesson Management:** [cite: 87]
  - [cite_start]**Content Moderation:** Approve, edit, or remove courses/lessons created by Tutors to ensure compliance with standards. [cite: 88]
  - [cite_start]**Category Management:** Organize, create, or delete course categories. [cite: 89]
- [cite_start]**Teaching Quality Monitoring:** [cite: 90]
  - [cite_start]**Lesson Review:** Access and review detailed transcripts of completed lessons. [cite: 91]
  - [cite_start]**AI Analytics:** Review auto-generated performance reports (e.g., Tutor vs. Student talk time, topics covered, engagement levels). [cite: 92]
  - [cite_start]**Rating & Review Management:** Monitor and manage student ratings and reviews of Tutors and courses. [cite: 93]

[cite_start]**Operations Management** [cite: 94]

- [cite_start]**Overall Schedule Management:** [cite: 95]
  - [cite_start]**Global Monitoring:** View the schedule for the entire system. [cite: 96]
  - [cite_start]**Conflict Resolution:** Detect and intervene to resolve scheduling conflicts or system errors. [cite: 97]
  - [cite_start]**Reschedule Support:** Reschedule lessons on behalf of users (Tutors/Students) in special cases. [cite: 98]
- [cite_start]**Support & Communication:** [cite: 99]
  - [cite_start]**Support Ticket Management:** Receive and process support requests from users. [cite: 100]
  - [cite_start]**System Announcements:** Send important notifications (e.g., maintenance, updates) to all or specific groups of users. [cite: 101]

[cite_start]**Financial Management** [cite: 102]

- [cite_start]**Transaction Management:** [cite: 103]
  - [cite_start]**Payment Confirmation:** Reconcile and confirm course payments from Students. [cite: 104]
  - [cite_start]**Refund Processing:** Manage and approve refund requests. [cite: 105]
- [cite_start]**Earnings & Payouts:** [cite: 106]
  - [cite_start]**Revenue Tracking:** Monitor platform revenue and Tutor earnings. [cite: 107]
  - [cite_start]**Payout Management:** Approve and process payout requests from Tutors. [cite: 108]

[cite_start]**Analytics & Reporting** [cite: 109]

- [cite_start]**Dashboard:** Provides a real-time overview of key performance indicators (KPIs) (e.g., new users, ongoing lessons, revenue). [cite: 110]
- [cite_start]**Custom Report Generation:** [cite: 111]
  - [cite_start]**Revenue Reports:** Details on revenue, profit, and commissions. [cite: 112]
  - [cite_start]**User Reports:** Statistics on user registrations and active users. [cite: 113]
  - [cite_start]**Quality Reports:** Aggregated ratings, top-rated/lowest-rated Tutors and courses. [cite: 114]

[cite_start]**System Configuration** [cite: 115]

- [cite_start]**Fee & Commission Settings:** Adjust the platform's commission rate for Tutors. [cite: 116]
- [cite_start]**Role & Permission Management:** Create and assign permissions to other administrative roles (e.g., support staff, finance staff). [cite: 117]
- [cite_start]**Template Management:** Edit the content of system-generated emails and automated notifications. [cite: 118]

---

### [cite_start]Tutor Dashboard [cite: 119]

[cite_start]**Registration & Verification** [cite: 120]

- [cite_start]**Onboarding Flow:** Comprehensive sign-up process allowing tutors to upload CVs, professional certificates (e.g., TESOL, IELTS), and intro videos for verification. [cite: 121]
- [cite_start]**Profile Approval:** Track the status of account verification by the Admin team. [cite: 122]

[cite_start]**Profile & Course Management** [cite: 123]

- [cite_start]**Professional Profile:** Create and customize a detailed profile with bio, teaching methodology, and introduction video to attract students. [cite: 124]
- [cite_start]**Course Builder:** Create and manage courses, set tuition fees, and organize curriculum materials. [cite: 125]

[cite_start]**Smart Schedule Management** [cite: 126]

- [cite_start]**Availability Settings:** Flexible interface for tutors to set weekly recurring hours or specific free slots. [cite: 127]
- [cite_start]**Calendar System:** Visual calendar to view upcoming classes, managing bookings, and handling rescheduling requests seamlessly. [cite: 128]
- [cite_start]Schedules are auto-generated based on availability. [cite: 129]

[cite_start]**Teaching & Classroom Tools** [cite: 130]

- [cite_start]**Virtual Classroom Access:** Direct gateway to conduct teaching sessions via the integrated video, screen sharing, and whiteboard system. [cite: 131]
- [cite_start]**In-Class Tools:** Access to lesson plans and teaching aids during the session [cite: 132]

[cite_start]**AI Insights & Student Progress** [cite: 133]

- [cite_start]**AI Lesson Summaries:** Automatically generated recaps of every completed session. [cite: 134] [cite_start]Tutors can review these AI summaries to quickly recall what was taught, student performance, and key takeaways before the next class. [cite: 135]
- [cite_start]**Progress Tracking:** Monitor student growth through AI-analyzed data logs from previous sessions [cite: 136]

[cite_start]**Homework & Community Engagement** [cite: 137]

- [cite_start]**Assignment & Grading:** Assign homework to students, track submissions, and provide detailed feedback or grades. [cite: 138]
- [cite_start]**Homework Exchange Social Hub (New):** A community feature where tutors can oversee student discussions. [cite: 139] [cite_start]Tutors can view "Homework Exchange" threads, endorse high-quality peer answers, or offer expert guidance on difficult topics discussed by students. [cite: 140]

[cite_start]**Financial Management** [cite: 141]

- [cite_start]**Income Dashboard:** Real-time view of total earnings, transaction history for each class, and pending balances. [cite: 142]
- [cite_start]**Withdrawals:** Functionality to request income withdrawals to bank accounts or e-wallets [cite: 143]

---

## [cite_start]Non-functional requirement: [cite: 144]

- [cite_start]**Real-time Performance:** Low latency for video/audio in the online classroom. [cite: 145]
- [cite_start]**AI response time:** ≤ 3.5 seconds. [cite: 146]
- [cite_start]**API response latency:** ≤ 400ms. [cite: 147]
- [cite_start]**Security:** OAuth2, JWT. [cite: 148]
- [cite_start]**System architecture:** .NET monolithic. [cite: 149]
