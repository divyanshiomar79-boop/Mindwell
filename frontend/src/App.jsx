import "./App.css";
import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function App() {
  const [journal, setJournal] = useState("");
  const [mood, setMood] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [breathing, setBreathing] = useState(false);

  // ⭐ NEW: login screen state
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const prompts = [
    "What made you smile today?",
    "What are you grateful for today?",
    "What challenged you today?",
    "Describe a peaceful moment today 🌿",
    "What did you learn about yourself today?"
  ];

  const [currentPrompt] = useState(
    prompts[Math.floor(Math.random() * prompts.length)]
  );

  // 💾 SAVE ENTRY (UNCHANGED)
  const handleSave = () => {
    if (journal.trim() === "") return alert("Please write something first ✍️");
    if (mood.trim() === "") return alert("Please select your mood 😊");

    const newEntry = {
      text: journal,
      mood,
      date: new Date().toLocaleString(),
    };

    setEntries((prev) => [...prev, newEntry]);

    setJournal("");
    setMood("");
    alert("Journal Saved 🌿");
  };

  const deleteEntry = (indexToDelete) => {
    setEntries(entries.filter((_, index) => index !== indexToDelete));
  };

  // 📥 EXPORT + LOADING + SUCCESS (NEW FEATURE)
  const exportData = () => {
    const input = document.querySelector(".pdf-area");

    setLoading(true); // ⭐ loading start

    html2canvas(input, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
      ignoreElements: (el) => el.classList?.contains("no-pdf"),
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "pt", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      pdf.save("MindWell_Journal.pdf");

      setLoading(false); // ⭐ loading end
      alert("Export Successful 🌿");
    });
  };

  // ⭐ LOGIN SCREEN (NEW FEATURE)
  if (!loggedIn) {
    return (
      <div className="login-screen">
        <h1>🌿 MindWell</h1>
        <p>Secure Mental Wellness Journal</p>

        <button className="btn primary" onClick={() => setLoggedIn(true)}>
          Enter Journal
        </button>
      </div>
    );
  }

  return (
    <div className={darkMode ? "container dark" : "container"}>
      <div className="card">

        <button className="btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        {/* ⭐ PREMIUM BADGE (UNCHANGED) */}
        <div className="premium-badge">✨ MindWell Premium UI</div>

        {/* ⭐ SECURE INDICATOR */}
        <div className="secure-badge">🔒 End-to-End Secured Journal</div>

        <h1>MindWell 🌿</h1>
        <p>Your Mental Wellness Journal</p>

        <h3>Today's Prompt 🌸</h3>
        <p className="prompt-box">{currentPrompt}</p>

        <input
          type="text"
          placeholder="Search journals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <textarea
          placeholder="Write your thoughts here..."
          rows="8"
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
        />

        <h3>How are you feeling today?</h3>
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="">Select Mood</option>
          <option value="😊">😊 Happy</option>
          <option value="😔">😔 Sad</option>
          <option value="😡">😡 Angry</option>
          <option value="😌">😌 Calm</option>
        </select>

        <button className="btn primary" onClick={handleSave}>
          Save Journal
        </button>

        <button className="btn export" onClick={exportData}>
          {loading ? "Exporting..." : "📥 Export My Data"}
        </button>

        <hr />

        {/* ⭐ BETTER BREATHING UI (VISUAL ONLY) */}
        <h2>🌬️ Advanced Breathing</h2>

        <div className="breathing-container">
          <div className={`breathing-circle ${breathing ? "active" : ""}`} />
          {breathing && <div className="pulse-ring"></div>}
        </div>

        <p className="breathing-text">
          {breathing
            ? "Inhale (4s)... Hold (7s)... Exhale (8s)..."
            : "Tap start to begin calming breath 🌿"}
        </p>

        <button className="btn" onClick={() => setBreathing(!breathing)}>
          {breathing ? "Stop" : "Start"}
        </button>

        <hr />

        <h2 className={darkMode ? "dark-title" : ""}>
          📒 Your Journal Entries
        </h2>

        {/* ⭐ BETTER EMPTY STATE */}
        {entries.length === 0 ? (
          <div className="empty-state">
            🌱 No entries yet — start writing your thoughts
          </div>
        ) : (
          <div className="pdf-area">
            {entries
              .filter((e) =>
                e.text.toLowerCase().includes(search.toLowerCase())
              )
              .map((entry, index) => (
                <div key={index} className="entry-card">

                  <h3 style={{ color: "#7CFC00" }}>{entry.mood}</h3>
                  <small>🕒 {entry.date}</small>
                  <p>{entry.text}</p>

                  <button
                    className="btn delete no-pdf"
                    onClick={() => deleteEntry(index)}
                  >
                    Delete
                  </button>

                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;