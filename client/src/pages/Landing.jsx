import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  FiZap, FiFileText, FiTag, FiSearch, FiUpload,
  FiStar, FiArrowRight, FiCheck, FiMoon, FiCpu
} from 'react-icons/fi'

function Landing() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="landing">

      {/* ── HERO ── */}
      <section className="landing-hero">
        <div className="hero-badge">
          <FiCpu className="badge-icon" />
          <span>AI-Powered Note Assistant</span>
        </div>

        <h1 className="hero-title">
          Turn your notes into<br />
          <span className="hero-highlight">smart knowledge</span>
        </h1>

        <p className="hero-sub">
          NoteGPT automatically summarizes your notes, extracts text from PDFs,
          generates smart tags, and organises everything — so you can focus on
          what matters.
        </p>

        <div className="hero-cta">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary-lg">
              Go to Dashboard <FiArrowRight />
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn-primary-lg">
                Get Started Free <FiArrowRight />
              </Link>
              <Link to="/login" className="btn-ghost-lg">
                Sign In
              </Link>
            </>
          )}
        </div>

        <p className="hero-note">No credit card required · Free to get started</p>

        {/* Floating cards */}
        <div className="hero-cards">
          <div className="float-card card-left">
            <div className="fc-header"><FiZap className="fc-icon ai" /> AI Summary</div>
            <div className="fc-body">• Key concepts extracted<br />• 3–5 bullet points<br />• Instant results</div>
          </div>
          <div className="float-card card-center">
            <div className="fc-header"><FiFileText className="fc-icon note" /> My Notes</div>
            <div className="fc-tags">
              <span className="tag">React</span>
              <span className="tag">MongoDB</span>
              <span className="tag">AI</span>
            </div>
            <div className="fc-preview">NoteGPT is a full-stack note taking app with AI-powered summarisation…</div>
          </div>
          <div className="float-card card-right">
            <div className="fc-header"><FiTag className="fc-icon tag" /> Auto Tags</div>
            <div className="fc-tags">
              <span className="tag">Study</span><span className="tag">Tech</span>
              <span className="tag">Notes</span><span className="tag">AI</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="landing-features" id="features">
        <div className="section-label">Features</div>
        <h2 className="section-title">Everything you need to study smarter</h2>
        <p className="section-sub">
          Powerful tools built right in — no extra apps needed.
        </p>

        <div className="features-grid">
          {[
            {
              icon: <FiZap />, color: 'purple',
              title: 'AI Summarization',
              desc: 'Instantly summarize any note or PDF into concise bullet points using Google Gemini AI.'
            },
            {
              icon: <FiUpload />, color: 'blue',
              title: 'PDF Upload & Extract',
              desc: 'Upload PDF documents, extract all text automatically, and summarize the contents with one click.'
            },
            {
              icon: <FiTag />, color: 'green',
              title: 'Auto-Generated Tags',
              desc: 'AI reads your note and generates relevant tags automatically to keep everything organized.'
            },
            {
              icon: <FiSearch />, color: 'orange',
              title: 'Full-Text Search',
              desc: 'Search across all your notes and PDFs by title or content — results appear instantly.'
            },
            {
              icon: <FiStar />, color: 'yellow',
              title: 'Pin Important Notes',
              desc: 'Pin your most important notes to the top of the dashboard so they\'re always at hand.'
            },
            {
              icon: <FiMoon />, color: 'pink',
              title: 'Dark & Light Mode',
              desc: 'Seamlessly switch between dark and light themes with a single click from any page.'
            },
          ].map((f, i) => (
            <div className={`feature-card fc-${f.color}`} key={i}>
              <div className={`feature-icon fi-${f.color}`}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="landing-how" id="how-it-works">
        <div className="section-label">How it works</div>
        <h2 className="section-title">From note to insight in seconds</h2>

        <div className="steps-row">
          {[
            { num: '01', title: 'Create or Upload', desc: 'Write a new note or upload a PDF document directly into the app.' },
            { num: '02', title: 'AI Processes It', desc: 'Click "Summarize" — Gemini AI reads your content and generates a concise summary and tags.' },
            { num: '03', title: 'Review & Organise', desc: 'Pin important notes, search across everything, and keep your knowledge base tidy.' },
          ].map((s, i) => (
            <div className="step" key={i}>
              <div className="step-num">{s.num}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
              {i < 2 && <div className="step-arrow"><FiArrowRight /></div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT / CTA ── */}
      <section className="landing-cta" id="about">
        <div className="cta-box">
          <div className="cta-badge">Built with ❤️ by Chandan Saini</div>
          <h2>Ready to take smarter notes?</h2>
          <p>
            NoteGPT is a full-stack MERN application with MongoDB, Express, React, and Node.js —
            powered by Google Gemini AI.
          </p>
          <ul className="cta-checks">
            {['Free to use', 'AI-powered summaries', 'PDF support', 'Dark mode included'].map((c, i) => (
              <li key={i}><FiCheck className="check-icon" /> {c}</li>
            ))}
          </ul>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary-lg">
              Open Dashboard <FiArrowRight />
            </Link>
          ) : (
            <Link to="/signup" className="btn-primary-lg">
              Get Started Free <FiArrowRight />
            </Link>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <span className="footer-logo">✨ NoteGPT</span>
          <span className="footer-credit">Founder &amp; Key Developer: <strong>Chandan Saini</strong></span>
          <span className="footer-copy">Made with ❤️</span>
        </div>
      </footer>
    </div>
  )
}

export default Landing
