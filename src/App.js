import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [youtubeURL, setYoutubeURL] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    setSummary("");

    try {
      let res;

      if (mode === "text") {
        res = await axios.post("http://localhost:5000/summarize/text", {
          text,
        });
      }

      if (mode === "pdf") {
        const formData = new FormData();
        formData.append("file", file);

        res = await axios.post(
          "http://localhost:5000/summarize/pdf",
          formData
        );
      }

      if (mode === "youtube") {
        res = await axios.post(
          "http://localhost:5000/summarize/youtube",
          { url: youtubeURL }
        );
      }

      setSummary(res.data.summary);

    } catch (err) {
      if (err.response?.data?.summary) {
        setSummary(err.response.data.summary);
      } else {
        setSummary("❌ Something went wrong.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="app">
      <h1>🧠 AI Summarizer (Text, PDF & YouTube)</h1>

      <div className="mode-buttons">
        <button onClick={() => setMode("text")}>Text</button>
        <button onClick={() => setMode("pdf")}>PDF</button>
        <button onClick={() => setMode("youtube")}>YouTube</button>
      </div>

      {mode === "text" && (
        <textarea
          placeholder="Enter text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      )}

      {mode === "pdf" && (
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
      )}

      {mode === "youtube" && (
        <input
          type="text"
          placeholder="Enter YouTube URL"
          value={youtubeURL}
          onChange={(e) => setYoutubeURL(e.target.value)}
        />
      )}

      <button onClick={handleSummarize} disabled={loading}>
        {loading ? "Summarizing..." : "Summarize"}
      </button>

      {summary && (
        <div className="summary">
          <h3>Summary</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;
