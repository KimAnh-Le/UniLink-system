import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Safe helper to obtain Gemini AI Client
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Route for CampusConnect Chatbot
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history, context } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      const ai = getAiClient();

      if (!ai) {
        // Fallback response if GEMINI_API_KEY is missing or loading
        return res.json({
          reply: `Hello! I am the CampusConnect AI Assistant. 🎓\n\nI am currently operating in smart assistance mode. Here are quick guides to help you:\n\n• **Booking Appointments**: Click "Appointments" in the navigation, pick a date, choose a 15-min or 30-min time slot, select Category (Online/Offline) and add notes.\n• **Enquiries**: Click "Enquiries" to submit or manage support requests across Academic, Financial, and Housing categories.\n• **Role Switcher**: Click the user profile icon at the top right to switch between Student, Admin, SSO Officer, and Manager.\n\nWhat would you like assistance with today?`,
        });
      }

      const systemInstruction = `You are the friendly, empathetic, and knowledgeable AI Assistant for "CampusConnect", a university student and administration portal.

Your primary mission is to answer student FAQs clearly, guide students through enquiry categories, help schedule consultations, and seamlessly bridge them to human staff support whenever needed.

Comprehensive Portal Overview & Enquiry Categories:
1. **Enquiry Categories**:
   - **Academic Enquiries**: Course enrollment, timetable conflicts, credit transfers, grade appeals, and academic probation advice.
   - **Financial Support**: Tuition fee schedules, scholarship applications, payment extensions, and financial aid packages.
   - **Housing & Accommodation**: On-campus dorm allocations, maintenance requests, residence rules, lease agreements, and off-campus housing advice.
   - **International Student Services**: Visa extensions, Confirmation of Enrolment (CoE), work limits (48 hrs/fortnight), overseas healthcare cover (OSHC), and orientation.
   - **Mental Health & Wellbeing**: Confidential counseling booking, stress management workshops, disability support accommodations, and crisis support.
   - **General Student Services**: Student ID cards, library access, campus parking, facility booking, and graduation ceremonies.

2. **Appointments & Consultation Booking**:
   - 15-minute or 30-minute consultation sessions available in Online (Zoom/Teams) or Offline (Student Service Hub) formats.
   - Selecting a consultation category, date, time slot, and brief discussion notes is required.
   - Double-booking prevention is automatically enforced for assigned advisors.

3. **Human Staff Support Escalation**:
   - If a student's question requires personal document review, official approval, or urgent human attention, guide them to:
     a) Submit an Enquiry Ticket under the **Enquiries** tab for SSO Officers.
     b) Schedule a 1-on-1 consultation under the **Appointments** tab.

4. **User Roles**:
   - **Student**: Submits enquiries, books advisor appointments, submits feedback.
   - **SSO Officer**: Reviews active enquiries, updates ticket status (Open -> In Progress -> Resolved), manages daily consultation appointments.
   - **Manager / Admin**: Views university resolution metrics, audit logs, student directory, and system configs.

User Context: ${context ? JSON.stringify(context) : 'General Student / User'}

Formatting Guidelines:
- Use markdown bolding (**term**) and bullet points (•) for readability.
- Be concise, polite, clear, and reassuring.
- Include actionable next steps for the user.`;

      let formattedHistory: any[] = [];
      if (Array.isArray(history) && history.length > 0) {
        formattedHistory = history.map((item) => ({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.content }],
        }));
      }

      const chatContents = [
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }] },
      ];

      let replyText = '';
      const modelsToTry = ['gemini-3.6-flash', 'gemini-2.5-flash'];
      let lastError: any = null;

      for (const modelName of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: chatContents,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });
          if (response.text) {
            replyText = response.text;
            break;
          }
        } catch (err: any) {
          console.warn(`Model ${modelName} failed, trying next fallback:`, err?.message || err);
          lastError = err;
        }
      }

      if (!replyText) {
        // Fallback intelligent guide if Gemini API is temporarily unavailable/throttled
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes('appointment') || lowerMsg.includes('book') || lowerMsg.includes('slot')) {
          replyText = `To book an appointment on **CampusConnect**:\n\n1. Click on the **Appointments** tab in the navigation bar.\n2. Pick your preferred date and select an available 15-minute or 30-minute slot.\n3. Choose consultation category (Online/Offline) and enter discussion notes.\n4. Click **Confirm Appointment**.`;
        } else if (lowerMsg.includes('enquiry') || lowerMsg.includes('ticket') || lowerMsg.includes('issue')) {
          replyText = `To submit or manage an enquiry:\n\n1. Navigate to the **Enquiries** tab.\n2. Click the **+ New** button.\n3. Select a category (Academic, Financial, Housing, International, or Mental Health) and type your description.\n4. Submit to receive an active ticket for SSO Officers to review.`;
        } else if (lowerMsg.includes('role') || lowerMsg.includes('admin') || lowerMsg.includes('sso') || lowerMsg.includes('switch')) {
          replyText = `To switch user roles:\n\n1. Click your profile avatar/name at the top right header.\n2. Choose between **Student**, **SSO Officer**, **Manager**, or **Admin** to test different views.`;
        } else {
          replyText = `I am here to help you navigate **CampusConnect**! 🎓\n\n• **Appointments**: Schedule 15 or 30 minute consultations.\n• **Enquiries**: Raise academic, financial, or housing tickets.\n• **Feedback**: Share ratings and suggestions for campus support services.\n\nHow else can I assist you today?`;
        }
      }

      return res.json({ reply: replyText });
    } catch (error: any) {
      console.error('Chat API Error:', error);
      return res.json({
        reply: "CampusConnect AI Assistant: You can manage appointments in the Appointments tab or submit enquiry tickets under the Enquiries tab!",
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
