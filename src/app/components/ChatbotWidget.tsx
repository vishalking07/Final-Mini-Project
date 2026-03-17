import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Minimize2, ChevronDown, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
  time: string;
  suggestions?: string[];
}

// ─── Knowledge Base ───────────────────────────────────────────────────────────
const KB: { patterns: RegExp[]; response: string; suggestions?: string[] }[] = [
  {
    patterns: [/hello|hi|hey|good (morning|afternoon|evening)|greet/i],
    response: "Hello! 👋 Welcome to the **BIT Sathy Student Support Bot**! I'm here to help you with anything about college — academics, fees, hostel, placements, and more. What can I help you with today?",
    suggestions: ["Fee payment", "Hostel info", "Placement drives", "Academic schedule"],
  },
  {
    patterns: [/fee|payment|tuition|amount|pay/i],
    response: "💰 **Fee Details:**\n• B.E / B.Tech: ~₹80,000 – ₹1,10,000 per year\n• Scholarships available for SC/ST/BC/OBC students via Tamil Nadu government\n• Fee payment portal: **https://bip.bitsathy.ac.in**\n• Deadline reminder: Usually end of July (odd sem) and end of December (even sem)\n\nFor exact amounts, contact the Accounts Section at +91-4295-226001.",
    suggestions: ["How to pay fees online?", "Scholarship details", "BIP Portal help"],
  },
  {
    patterns: [/scholarship|financial aid|merit/i],
    response: "🎓 **Scholarship Information:**\n• Government: SC/ST/BC/OBC scholarships through Tamil Nadu eSevai\n• Merit scholarship: Top 10% of each department\n• Sports quota: Based on achievements\n• Economically weaker section: Up to 50% fee waiver\n\nVisit the Student Welfare Office (Block B, Ground Floor) with your documents.",
    suggestions: ["Required documents", "Application process", "Contact welfare office"],
  },
  {
    patterns: [/hostel|accommodation|stay|room/i],
    response: "🏠 **Hostel Information:**\n• **Boys Hostels:** Sri Vivekananda, Sri Ramanuja (5 blocks)\n• **Girls Hostels:** Separate block with 24/7 security\n• Facilities: Wi-Fi, laundry, medical room, indoor games\n• Mess: 3 meals + snacks daily\n• Fee: ~₹50,000–₹65,000 per year\n\nContact: Hostel Office — +91-4295-226002\nFor allotment, register via BIP Portal.",
    suggestions: ["Hostel fees", "Hostel facilities", "How to apply for hostel?"],
  },
  {
    patterns: [/placement|campus|drive|recruit|job|company/i],
    response: "💼 **Placement Information:**\n• Training & Placement Cell: Dedicated support for every student\n• Top recruiters: Google, Amazon, TCS, Infosys, Zoho, Wipro\n• Highest package: ₹32 LPA (2024 batch)\n• Average package: ₹11.4 LPA\n• 847+ students placed (2024)\n\n📌 Visit the **Placements** page to register for campus drives and see upcoming schedules!\n\nContact T&P Cell: placement@bitsathy.ac.in",
    suggestions: ["How to register for placement?", "Upcoming drives", "Placement training"],
  },
  {
    patterns: [/exam|result|mark|grade|cgpa|gpa|arrear/i],
    response: "📊 **Examination & Results:**\n• Results are published on the **BIP Portal** (https://bip.bitsathy.ac.in)\n• University exams are conducted by Anna University\n• Internal assessment: 3 cycle tests + 1 model exam per semester\n• Arrear exam: Apply through BIP → Examination → Arrear Registration\n• Grade appeal: Submit request to the Examination Cell within 10 days of result\n\nFor result queries: exam@bitsathy.ac.in",
    suggestions: ["How to check results?", "Arrear registration", "Internal marks"],
  },
  {
    patterns: [/library|book|issue|return|borrow/i],
    response: "📚 **Central Library:**\n• Location: Main Block, Ground Floor\n• Timings: Mon–Fri: 8 AM – 8 PM | Sat: 8 AM – 5 PM | Sunday: Closed\n• Digital access: Delnet, IEEE, Springer via BIT Wiki\n• Books per student: 3 books for 15 days\n• Fine: ₹2 per day for late return\n\nLibrary Portal: https://wiki.bitsathy.ac.in\nContact: library@bitsathy.ac.in",
    suggestions: ["How to access e-books?", "Extend book return date", "Library membership"],
  },
  {
    patterns: [/wifi|internet|network|campus wifi/i],
    response: "📶 **Campus Wi-Fi:**\n• Network Name: **BIT-SATHY** (campus-wide)\n• Speed: 1 Gbps fiber backbone\n• Login: Use your BIT Portal credentials\n• Available in: All blocks, hostels, library, canteen\n• For issues: IT Help Desk, Server Room, Main Block\n\nContact IT Support: itsupport@bitsathy.ac.in or raise a ticket at https://supportdesk.bitsathy.ac.in",
    suggestions: ["Wi-Fi login issues", "Internet not working", "BIP portal help"],
  },
  {
    patterns: [/transport|bus|college bus|route|travel/i],
    response: "🚌 **Bus / Transport:**\n• College buses available from Erode, Salem, Coimbatore, Tiruppur, Namakkal\n• Routes and schedules are updated on the BIP portal at the start of each semester\n• Monthly bus pass available at the Transport Office\n• Contact: transport@bitsathy.ac.in | Transport Office, Admin Block\n\nFor new route requests, submit a petition to the Student Welfare Officer.",
    suggestions: ["Bus routes", "Bus pass application", "Transportation fees"],
  },
  {
    patterns: [/anti.?ragging|ragging|complain|grievance|harassment/i],
    response: "🛡️ **Anti-Ragging & Grievance:**\n• BIT Sathy has **zero tolerance** for ragging\n• 24/7 Anti-Ragging Helpline: **1800-180-5522** (toll-free)\n• Internal committee meets every Friday at 3 PM\n• Online complaint: https://antiragging.in\n\n**Grievance Redressal:**\n• Submit complaints to the Student Grievance Committee\n• Confidentiality is maintained\n• Contact: grievance@bitsathy.ac.in\n\nYou are safe here. Please do not hesitate to report.",
    suggestions: ["How to file a complaint?", "Anti-ragging committee members"],
  },
  {
    patterns: [/bip|portal|login|password|forgot.*password|reset/i],
    response: "🔑 **BIP Portal (bip.bitsathy.ac.in):**\n• Login with your Roll Number and password\n• Forgot password? Click 'Forgot Password' on the login page\n• BIP Portal uses: Fee payment, Results, Hall tickets, Leave applications\n• Mobile app: BIT Sathy App on Play Store / App Store\n\nFor portal issues, contact: support@bitsathy.ac.in or https://supportdesk.bitsathy.ac.in",
    suggestions: ["Can't login to BIP", "Hall ticket download", "Leave application"],
  },
  {
    patterns: [/support.?desk|ticket|raise.*ticket|it.*support/i],
    response: "🎫 **Support Desk:**\n• URL: **https://supportdesk.bitsathy.ac.in**\n• Raise tickets for: BIP issues, ID card, Certificate requests, Wi-Fi, Library\n• Response time: Usually within 24 hours\n• Track your ticket status on the same portal\n\nCategories available: Academic, IT, Finance, Hostel, Transport, Library.",
    suggestions: ["How to raise a ticket?", "Track my ticket", "Emergency contact"],
  },
  {
    patterns: [/canteen|food|mess|cafeteria|eat/i],
    response: "🍽️ **Canteen & Mess:**\n• Main Canteen: Open 7:30 AM – 8:30 PM (weekdays)\n• Mess: Breakfast 7–8 AM | Lunch 12–1:30 PM | Dinner 7–8:30 PM\n• Special counters: Juice, Snacks, North Indian\n• Hostel mess coupon system via BIP Portal\n• Feedback: Submit via BIT Wiki feedback form",
    suggestions: ["Mess menu", "Hostel mess coupons"],
  },
  {
    patterns: [/club|activity|extra.?curricular|event|fest|symposium/i],
    response: "🎭 **Clubs & Activities:**\n• **Technical Clubs:** IEEE, ACM, Robotics, Coding Club\n• **Cultural:** Music, Dance, Drama, Fine Arts\n• **Sports:** Cricket, Football, Basketball, Badminton, Volleyball\n• **NSS/NCC** available for social service\n• Annual Fest: **Prathibha** (Cultural) | **Techno Blast** (Technical)\n\nJoin clubs via BIT Wiki or approach your department coordinator.",
    suggestions: ["How to join a club?", "Upcoming events", "Techno Blast dates"],
  },
  {
    patterns: [/attendance|leave|od|on duty|medical/i],
    response: "📋 **Attendance & Leave:**\n• Minimum attendance required: **75%** per subject\n• Below 75%: Detained from semester exam\n• Medical leave: Submit medical certificate within 3 days to class teacher\n• OD (On Duty) for events/competitions: Apply via BIP → Leave Module\n• Leave application: BIP Portal → Academic → Leave Request\n\nFor attendance queries, contact your class teacher or HOD.",
    suggestions: ["How to apply for OD?", "Medical leave process", "Attendance shortage"],
  },
  {
    patterns: [/certificate|bonafide|transfer.*certificate|tc|noc/i],
    response: "📄 **Certificates & Documents:**\n• **Bonafide Certificate:** Apply via BIP Portal (ready in 2–3 working days)\n• **Transfer Certificate (TC):** Apply at the admin office with all dues cleared\n• **Character Certificate:** Apply at the admin office\n• **NOC:** Through department HOD\n\nAll applications available at: BIP Portal → Certificates Section\nOr submit a ticket at https://supportdesk.bitsathy.ac.in",
    suggestions: ["Bonafide certificate process", "TC application", "Documents required"],
  },
  {
    patterns: [/department|cse|it|ece|eee|mech|civil|mba|mca/i],
    response: "🏫 **Departments at BIT Sathy:**\n• CSE – Computer Science & Engineering\n• IT – Information Technology\n• ECE – Electronics & Communication Engineering\n• EEE – Electrical & Electronics Engineering\n• MECH – Mechanical Engineering\n• CIVIL – Civil Engineering\n• MBA – Master of Business Administration\n• MCA – Master of Computer Applications\n\nVisit the **About College → Departments** page for detailed information.",
    suggestions: ["Department faculty", "Department events", "HOD contact"],
  },
  {
    patterns: [/thank|thanks|thank you|great|awesome|helpful/i],
    response: "😊 You're welcome! I'm glad I could help. If you have any more questions, feel free to ask anytime. Good luck with your studies at **BIT Sathy**! 🎓\n\nIs there anything else I can help you with?",
    suggestions: ["Fee details", "Placement drives", "Library info"],
  },
  {
    patterns: [/bye|goodbye|see you|exit|close/i],
    response: "👋 Goodbye! Have a great day! Remember, I'm always here if you need help. Study hard and aim high! 🚀",
  },
];

const DEFAULT_RESPONSE =
  "I'm not sure I understood that fully. 🤔 Could you rephrase or try one of the suggestions below? You can also visit the **Support Desk** at https://supportdesk.bitsathy.ac.in for detailed help.";

const DEFAULT_SUGGESTIONS = ["Fee payment", "Hostel details", "Placement info", "Exam results", "Library timings"];

function getBotResponse(query: string): { text: string; suggestions?: string[] } {
  const q = query.toLowerCase();
  for (const kb of KB) {
    if (kb.patterns.some(p => p.test(q))) {
      return { text: kb.response, suggestions: kb.suggestions };
    }
  }
  return { text: DEFAULT_RESPONSE, suggestions: DEFAULT_SUGGESTIONS };
}

function formatText(text: string) {
  // Bold **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : p.split("\n").map((line, j) => (
        <span key={j}>{line}{j < p.split("\n").length - 1 && <br />}</span>
      ))
  );
}

function getTime() {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

const QUICK_QUESTIONS = [
  "How to pay fees?",
  "Hostel information",
  "Upcoming placement drives",
  "How to check results?",
  "Library timings",
  "Anti-ragging helpline",
];

// ─── Component ────────────────────────────────────────────────────────────────
export function ChatbotWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1, role: "bot", time: getTime(),
      text: `Hi ${user?.name?.split(" ")[0] || "there"}! 👋 I'm **BIT Bot**, your AI assistant for BIT Sathy. How can I help you today?`,
      suggestions: ["Fee payment", "Hostel info", "Placement drives", "Academic schedule"],
    },
  ]);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, minimized]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput("");

    const userMsg: Message = { id: Date.now(), role: "user", text: trimmed, time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);

    if (!open) setUnread(c => c + 1);

    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));

    const { text: responseText, suggestions } = getBotResponse(trimmed);
    const botMsg: Message = { id: Date.now() + 1, role: "bot", text: responseText, time: getTime(), suggestions };
    setMessages(prev => [...prev, botMsg]);
    setTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 bit-no-print">
      {/* ── Floating button ── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300"
          style={{ background: "linear-gradient(135deg,#5540DE,#2e2378)", boxShadow: "0 8px 32px rgba(85,64,222,0.45)" }}
        >
          <MessageCircle size={20} className="text-white" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
              style={{ fontSize: "10px", fontWeight: 700 }}>
              {unread}
            </span>
          )}
        </button>
      )}

      {/* ── Chat window ── */}
      {open && (
        <div
          className="fixed bottom-6 right-6 z-50 flex flex-col rounded-3xl overflow-hidden shadow-2xl"
          style={{
            width: "360px",
            height: minimized ? "64px" : "580px",
            transition: "height 0.3s cubic-bezier(0.4,0,0.2,1)",
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(85,64,222,0.15)",
            boxShadow: "0 24px 80px rgba(85,64,222,0.25), 0 8px 32px rgba(0,0,0,0.12)",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 shrink-0 cursor-pointer"
            style={{ background: "linear-gradient(135deg,#5540DE,#2e2378)" }}
            onClick={() => setMinimized(!minimized)}
          >
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
                <Bot size={18} className="text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#5540DE]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm" style={{ fontWeight: 700 }}>BIT Bot</p>
              <p className="text-indigo-200" style={{ fontSize: "10px" }}>AI Assistant • BIT Sathy</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors" onClick={e => { e.stopPropagation(); setMinimized(!minimized); }}>
                {minimized ? <ChevronDown size={14} className="text-white" /> : <Minimize2 size={14} className="text-white" />}
              </div>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors" onClick={e => { e.stopPropagation(); setOpen(false); setMinimized(false); }}>
                <X size={14} className="text-white" />
              </div>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Quick questions */}
              <div className="px-3 py-2.5 flex gap-1.5 overflow-x-auto shrink-0" style={{ borderBottom: "1px solid rgba(85,64,222,0.08)" }}>
                {QUICK_QUESTIONS.map(q => (
                  <button key={q} onClick={() => sendMessage(q)}
                    className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full hover:bg-[#5540DE] hover:text-white transition-all shrink-0"
                    style={{ background: "#EEF2FF", color: "#5540DE", fontWeight: 600 }}>
                    {q}
                  </button>
                ))}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3" style={{ scrollbarWidth: "thin", scrollbarColor: "#e0d9ff transparent" }}>
                {messages.map(msg => (
                  <div key={msg.id} className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    {/* Avatar */}
                    <div className={`w-7 h-7 rounded-xl shrink-0 flex items-center justify-center`}
                      style={{ background: msg.role === "bot" ? "linear-gradient(135deg,#5540DE,#7c6de8)" : "linear-gradient(135deg,#374151,#6B7280)" }}>
                      {msg.role === "bot" ? <Bot size={14} className="text-white" /> : <User size={12} className="text-white" />}
                    </div>
                    <div className={`flex flex-col gap-1 max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                      <div
                        className="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                        style={{
                          background: msg.role === "user" ? "linear-gradient(135deg,#5540DE,#2e2378)" : "rgba(85,64,222,0.06)",
                          color: msg.role === "user" ? "white" : "#1F2937",
                          borderBottomRightRadius: msg.role === "user" ? "4px" : "16px",
                          borderBottomLeftRadius: msg.role === "bot" ? "4px" : "16px",
                          fontSize: "12.5px",
                        }}
                      >
                        {formatText(msg.text)}
                      </div>
                      <span className="text-gray-400 px-1" style={{ fontSize: "10px" }}>{msg.time}</span>
                      {/* Suggestions */}
                      {msg.suggestions && msg.role === "bot" && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {msg.suggestions.map(s => (
                            <button key={s} onClick={() => sendMessage(s)}
                              className="text-xs px-2.5 py-1 rounded-full hover:bg-[#5540DE] hover:text-white transition-all"
                              style={{ background: "#EEF2FF", color: "#5540DE", fontWeight: 600, border: "1px solid rgba(85,64,222,0.2)" }}>
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {typing && (
                  <div className="flex items-end gap-2">
                    <div className="w-7 h-7 rounded-xl shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#5540DE,#7c6de8)" }}>
                      <Bot size={14} className="text-white" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-bl-[4px] flex items-center gap-1.5" style={{ background: "rgba(85,64,222,0.06)" }}>
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#5540DE] animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-3 pb-3 pt-2 shrink-0" style={{ borderTop: "1px solid rgba(85,64,222,0.08)" }}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-2xl" style={{ background: "rgba(85,64,222,0.05)", border: "1px solid rgba(85,64,222,0.12)" }}>
                  <Sparkles size={14} className="text-[#5540DE] shrink-0" />
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything about BIT Sathy..."
                    className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
                    style={{ fontSize: "12.5px" }}
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim()}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                    style={{
                      background: input.trim() ? "linear-gradient(135deg,#5540DE,#2e2378)" : "rgba(85,64,222,0.1)",
                      color: input.trim() ? "white" : "#a8a0f0",
                    }}
                  >
                    <Send size={14} />
                  </button>
                </div>
                <p className="text-center text-gray-400 mt-1.5" style={{ fontSize: "10px" }}>
                  Powered by BIT Sathy AI • For urgent issues, visit{" "}
                  <a href="https://supportdesk.bitsathy.ac.in" target="_blank" rel="noopener noreferrer" className="text-[#5540DE] hover:underline" style={{ fontWeight: 600 }}>
                    Support Desk
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}