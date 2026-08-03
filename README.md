# UniLink ABC University Student Enquiry and Appointment System

UniLink is a unified web platform designed for the ABC university. It bridges the gap between students, Administrative Officers, Student Support Officers:, and university management through streamlined enquiry tracking, appointment scheduling, student records management, and AI-assisted support.

---

##  Key Features

### 1. Student Portal
- **Dashboard Overview**: Instant access to personal information, upcoming appointments, and open enquiry tickets.
- **Enquiry Ticketing**: Submit queries regarding Academics, Financial Aid, Housing, International Services, or IT Support with priority tags and real-time response logs.
- **Appointment Booking**: Schedule 1-on-1 consultations with academic advisors along with meeting location links and calendar integration.
- **Student Profile & Documents**: Access personal details.

### 2. Administrative & Officer Portal
- **Enquiry Workflow Management**: Filter, assign, update urgency/status, add internal notes, and send responses to student enquiries.
- **Appointment Calendar**: Manage scheduled advising sessions, reschedule requests, or update session completion notes.
- **Student Directory**: High-density lookup for student records, enquiries and appointments' statuses, and historical interactions.

### 3. Manager & Executive Dashboard
- **Analytics & SLA Tracking**: Recharts-powered metrics on enquiry response times, ticket categories, appointment volumes, and departmental performance.
- **Feedback Management Hub**: Monitor student satisfaction ratings and implement institutional feedback recommendations.
- **Audit Logging**: Comprehensive activity logs capturing user actions, administrative interventions, and record updates for governance.

### 4. AI Campus Assistant
- Integrated server-side **Gemini API** copilot for answering campus FAQs, guiding students on administrative procedures, and helping officers draft responses.

---

## Project Structure

```
.
├── server.ts              # Express server entry point & API routes
├── index.html             # Main HTML entry point
├── package.json           # Dependencies and scripts
├── metadata.json          # Application configuration metadata
├── src/
│   ├── App.tsx            # Primary application component & role management
│   ├── main.tsx           # React mounting entry point
│   ├── index.css          # Global Tailwind CSS styles
│   ├── types.ts           # Shared TypeScript interfaces & types
│   ├── components/        # UI components (Student, Officer, Manager, Admin, AI Chat)
│   └── data/              # Initial seed datasets & mock stores
```

---
