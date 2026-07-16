import { useEffect, useMemo, useState } from "react";
import { FileText, Sparkles, SendHorizonal } from "lucide-react";
import api from "../api/axios";

export default function Copilot() {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [prepResult, setPrepResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchLatestResume = async () => {
      try {
        const { data } = await api.get("/resume/latest");
        if (data?.text_content) {
          setResumeText(data.text_content);
          setStatus("Loaded your latest saved resume.");
        }
      } catch {
        // No saved resume yet; ignore.
      }
    };

    fetchLatestResume();
  }, []);

  const canAnalyze = useMemo(() => resumeText.trim() && jobDescription.trim(), [resumeText, jobDescription]);

  const handleUpload = async () => {
    if (!resumeFile) {
      setStatus("Choose a resume file first.");
      return;
    }

    setUploading(true);
    setStatus("Uploading and extracting your resume...");

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const { data } = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResumeText(data.resume?.text_content || "");
      setStatus(`Resume saved: ${data.resume?.file_name || resumeFile.name}`);
    } catch (err) {
      setStatus(err.response?.data?.message || "Resume upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!canAnalyze) {
      setStatus("Add a resume and a job description to continue.");
      return;
    }

    setLoading(true);
    setStatus("Running resume analysis and interview prep...");

    try {
      const [{ data: matchData }, { data: prepData }] = await Promise.all([
        api.post("/copilot/resume-match", { resumeText, jobDescription }),
        api.post("/copilot/interview-prep", { resumeText, jobDescription }),
      ]);

      setMatchResult(matchData);
      setPrepResult(prepData);
      setStatus("Analysis completed.");
    } catch (err) {
      setStatus(err.response?.data?.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "600" }}>Copilot Assist</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            Upload a resume, compare it against a job description, and prepare interview answers.
          </p>
        </div>
        <div className="card" style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: "8px", color: "var(--accent)" }}>
          <Sparkles size={14} />
          AI-assisted hiring workflow
        </div>
      </div>

      {status && (
        <div className="card" style={{ padding: "12px 14px", color: "var(--text-muted)", fontSize: "13px" }}>
          {status}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "16px" }}>
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
            <FileText size={15} /> Resume upload
          </div>

          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
            style={{ color: "var(--text-muted)", fontSize: "13px" }}
          />

          <button className="btn btn-primary" onClick={handleUpload} disabled={uploading} style={{ width: "fit-content" }}>
            {uploading ? "Uploading..." : "Upload resume"}
          </button>

          <label style={{ fontSize: "12px", color: "var(--text-muted)" }}>Resume text</label>
          <textarea
            className="input"
            rows={10}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here or upload a file."
            style={{ minHeight: "220px", resize: "vertical" }}
          />
        </div>

        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
            <SendHorizonal size={15} /> Job description
          </div>

          <textarea
            className="input"
            rows={12}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description you want to target."
            style={{ minHeight: "260px", resize: "vertical" }}
          />

          <button className="btn btn-primary" onClick={handleAnalyze} disabled={loading || !canAnalyze}>
            {loading ? "Analyzing..." : "Run analysis"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
        <div className="card">
          <h3 style={{ fontSize: "13px", fontWeight: "600", marginBottom: "10px" }}>Resume match</h3>
          {matchResult ? (
            <>
              <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--accent)" }}>{matchResult.score}%</div>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "6px" }}>{matchResult.summary}</p>
              <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {matchResult.matchedKeywords?.map((keyword) => (
                  <span key={keyword} style={{ padding: "4px 8px", borderRadius: "999px", background: "var(--accent-bg)", color: "var(--accent)", fontSize: "11px" }}>
                    {keyword}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Your match score will appear here once you run the analysis.</p>
          )}
        </div>

        <div className="card">
          <h3 style={{ fontSize: "13px", fontWeight: "600", marginBottom: "10px" }}>Interview prep</h3>
          {prepResult ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>Questions</div>
                <ul style={{ paddingLeft: "16px", color: "var(--text-muted)", fontSize: "13px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {prepResult.questions?.map((question) => <li key={question}>{question}</li>)}
                </ul>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>Tips</div>
                <ul style={{ paddingLeft: "16px", color: "var(--text-muted)", fontSize: "13px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {prepResult.tips?.map((tip) => <li key={tip}>{tip}</li>)}
                </ul>
              </div>
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Interview questions and preparation tips will appear after analysis.</p>
          )}
        </div>
      </div>
    </div>
  );
}
