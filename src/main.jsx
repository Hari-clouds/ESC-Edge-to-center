import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Plus, Trash2, Pencil, Check, X, Info, Target, ArrowDownRight, Sparkles, ArrowUpRight, Menu } from "lucide-react";
import "./styles.css";

const initialTasks = [
  { id: 1, title: "Define the vision", detail: "Clarify the outcome and what success means.", progress: 75, color: "#7dd3fc" },
  { id: 2, title: "Plan the next steps", detail: "Break the goal into clear, achievable actions.", progress: 45, color: "#c4b5fd" },
  { id: 3, title: "Build the first version", detail: "Create a small working prototype to test the idea.", progress: 25, color: "#f9a8d4" },
  { id: 4, title: "Gather feedback", detail: "Show the prototype to people and learn from them.", progress: 10, color: "#fcd34d" }
];

function ForwardArrow({ x, y, angle, color }) {
  // A single sharp forward point with three distinct tail points.
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`} className="task-arrow">
      <path d="M -23 -11 L -12 -5 L -18 -1 L -9 0 L -18 1 L -12 5 L -23 11 L -15 2 L -15 -2 Z" fill={color} opacity=".95" />
      <path d="M -15 -2 L 3 -2 L 3 -10 L 23 0 L 3 10 L 3 2 L -15 2 Z" fill={color} stroke="#0b1020" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="0" cy="0" r="2.5" fill="#0b1020" />
    </g>
  );
}

function OrbitCanvas({ tasks, overallProgress }) {
  const size = 440;
  const center = size / 2;
  const outerR = 166;
  const innerR = outerR * (1 - overallProgress / 100);
  const positions = useMemo(() => tasks.map((task, i) => {
    const angle = (-90 + i * (360 / Math.max(tasks.length, 1))) * Math.PI / 180;
    const taskR = outerR * (1 - task.progress / 100);
    return {
      ...task,
      angle: angle * 180 / Math.PI + 90,
      x: center + Math.cos(angle) * taskR,
      y: center + Math.sin(angle) * taskR,
      edgeX: center + Math.cos(angle) * outerR,
      edgeY: center + Math.sin(angle) * outerR,
      anchorX: center + Math.cos(angle) * (outerR + 18),
      anchorY: center + Math.sin(angle) * (outerR + 18)
    };
  }), [tasks, center]);
  return (
    <div className="orbit-wrap">
      <svg viewBox={`0 0 ${size} ${size}`} className="orbit" role="img" aria-label="E2C task markers move from the fixed outer boundary toward the central goal as their progress increases.">
        <defs>
          <radialGradient id="centerGlow">
            <stop offset="0%" stopColor="#67e8f9" stopOpacity=".23" />
            <stop offset="100%" stopColor="#67e8f9" stopOpacity="0" />
          </radialGradient>
          <pattern id="dotGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#334155" opacity=".65" />
          </pattern>
        </defs>
        <circle cx={center} cy={center} r="204" fill="url(#dotGrid)" />
        <circle cx={center} cy={center} r="184" fill="url(#centerGlow)" />
        {[55, 110, 166].map(r => <circle key={r} cx={center} cy={center} r={r} fill="none" stroke="#263449" strokeWidth="1" strokeDasharray="3 7" />)}
        <circle cx={center} cy={center} r={outerR} fill="rgba(15,23,42,.28)" stroke="#94a3b8" strokeWidth="2.5" />
        <circle cx={center} cy={center} r={outerR + 7} fill="none" stroke="#64748b" strokeWidth="1" opacity=".4" />
        <circle cx={center} cy={center} r={innerR} fill="rgba(34,211,238,.07)" stroke="#67e8f9" strokeWidth={overallProgress === 100 ? 0 : 2.5} opacity=".95" />
        {overallProgress > 0 && overallProgress < 100 && <circle cx={center} cy={center} r={innerR} fill="none" stroke="#67e8f9" strokeWidth="1" strokeDasharray="4 5" opacity=".65" />}
        {positions.map((task) => {
          const a = Math.atan2(center - task.y, center - task.x) * 180 / Math.PI;
          return (
            <g key={task.id}>
              <line x1={task.edgeX} y1={task.edgeY} x2={task.x} y2={task.y} stroke={task.color} strokeWidth="1.4" strokeDasharray="3 5" opacity=".38" />
              <circle cx={task.x} cy={task.y} r="14" fill={task.color} opacity=".13" />
              <circle cx={task.x} cy={task.y} r="5.5" fill={task.color} stroke="#0b1020" strokeWidth="2" />
              <ForwardArrow x={task.x} y={task.y} angle={a} color={task.color} />
            </g>
          );
        })}
        <circle cx={center} cy={center} r="35" fill="#101a2e" stroke="#67e8f9" strokeWidth="1.6" />
        <circle cx={center} cy={center} r="28" fill="url(#centerGlow)" />
        <text x={center} y={center - 4} textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="800">r = 0</text>
        <text x={center} y={center + 13} textAnchor="middle" fill="#67e8f9" fontSize="8" letterSpacing="1.4">THE GOAL</text>
        <text x={center} y="24" textAnchor="middle" fill="#94a3b8" fontSize="9" letterSpacing="2">EDGE</text>
      </svg>
      <div className="orbit-legend"><span><i className="legend-dot outer" /> Fixed outer boundary</span><span><i className="legend-dot inner" /> Overall progress circle</span></div>
    </div>
  );
}

function App() {
  const [projectName, setProjectName] = useState("Bring the vision to life");
  const [projectEditing, setProjectEditing] = useState(false);
  const [draftProject, setDraftProject] = useState(projectName);
  const [tasks, setTasks] = useState(initialTasks);
  const [overallProgress, setOverallProgress] = useState(32);
  const [newTask, setNewTask] = useState("");
  const [newDetail, setNewDetail] = useState("");
  const [showAbout, setShowAbout] = useState(false);
  const [selectedId, setSelectedId] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDetail, setEditDetail] = useState("");

  const average = tasks.length ? Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length) : 0;
  const selectedTask = tasks.find(t => t.id === selectedId) || tasks[0];

  function updateTask(id, patch) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  }
  function addTask(e) {
    e.preventDefault();
    const title = newTask.trim();
    if (!title) return;
    const palette = ["#7dd3fc", "#c4b5fd", "#f9a8d4", "#fcd34d", "#86efac", "#fdba74"];
    const task = { id: Date.now(), title, detail: newDetail.trim() || "Add a short note about this task.", progress: 0, color: palette[tasks.length % palette.length] };
    setTasks(prev => [...prev, task]);
    setSelectedId(task.id);
    setNewTask("");
    setNewDetail("");
  }
  function startEdit(task) {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDetail(task.detail);
  }
  function saveEdit(id) {
    if (editTitle.trim()) updateTask(id, { title: editTitle.trim(), detail: editDetail.trim() });
    setEditingId(null);
  }
  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (selectedId === id) setSelectedId(tasks.find(t => t.id !== id)?.id ?? null);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="E2C home"><span className="brand-mark"><ArrowDownRight size={19} /></span><span><b>E2C</b><small>EDGE TO CENTER</small></span></a>
        <nav className="site-nav" aria-label="Main navigation"><a href="#workspace">Workspace</a><a href="#principle">The principle</a><button onClick={() => setShowAbout(true)}>About</button></nav>
        <div className="top-actions"><span className="demo-pill"><span className="live-dot" /> LIVE DEMO</span><button className="header-cta" onClick={() => document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth" })}>Open workspace <ArrowUpRight size={14} /></button><button className="mobile-menu icon-button" onClick={() => setShowAbout(true)} aria-label="About E2C"><Menu size={18} /></button></div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14} /> A DIFFERENT WAY TO SEE PROGRESS</div>
          <h1>Turn ambition<br />into <span>momentum.</span></h1>
          <p>A more human way to see progress. Every task begins at the edge and moves with purpose toward what matters most.</p>
          <div className="hero-stats">
            <div><strong>{tasks.length.toString().padStart(2, "0")}</strong><span>ACTIVE TASKS</span></div>
            <div className="stat-divider" />
            <div><strong>{average}%</strong><span>TASK PROGRESS AVG.</span></div>
            <div className="stat-divider" />
            <div><strong>{overallProgress}%</strong><span>PROJECT JOURNEY</span></div>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="art-shine" /><div className="art-orbit one" /><div className="art-orbit two" /><div className="art-core"><Target size={30} /><span>r = 0</span></div><div className="art-marker marker-one" /><div className="art-marker marker-two" /><div className="art-label label-top">START AT THE EDGE</div><div className="art-label label-bottom">FOCUS ON THE GOAL</div></div>
      </section>

      <section className="workspace" id="workspace">
        <div className="section-heading">
          <div><div className="eyebrow">YOUR WORKSPACE</div><h2>{projectEditing ? "Edit project" : projectName}</h2><p>Adjust the project journey and move each task independently.</p></div>
          {projectEditing ? <div className="project-edit"><input value={draftProject} onChange={e => setDraftProject(e.target.value)} autoFocus aria-label="Project name" /><button className="small-primary" onClick={() => { if (draftProject.trim()) setProjectName(draftProject.trim()); setProjectEditing(false); }}>Save</button><button className="icon-button" onClick={() => setProjectEditing(false)} aria-label="Cancel"><X size={16} /></button></div> : <button className="subtle-button" onClick={() => { setDraftProject(projectName); setProjectEditing(true); }}><Pencil size={14} /> Edit project</button>}
        </div>

        <div className="workspace-grid">
          <section className="panel visualization-panel">
            <div className="panel-top"><div><span className="panel-kicker">01 / VISUAL MAP</span><h3>Progress orbit</h3></div><span className="r-zero">CENTER = r 0</span></div>
            <OrbitCanvas tasks={tasks} overallProgress={overallProgress} />
            <div className="slider-block overall-slider">
              <div className="slider-label"><label htmlFor="overall">Whole-project journey</label><strong>{overallProgress}%</strong></div>
              <input id="overall" type="range" min="0" max="100" value={overallProgress} onChange={e => setOverallProgress(Number(e.target.value))} style={{"--range-progress": `${overallProgress}%`}} />
              <div className="range-ends"><span>EDGE · 0%</span><span>CENTER · 100%</span></div>
              <p className="hint">This slider moves the inner circle. The outer boundary stays fixed.</p>
            </div>
          </section>

          <section className="panel tasks-panel">
            <div className="panel-top"><div><span className="panel-kicker">02 / TASK CONTROL</span><h3>Tasks in motion</h3></div><span className="count-badge">{tasks.length} {tasks.length === 1 ? "TASK" : "TASKS"}</span></div>
            <div className="task-list">
              {tasks.length === 0 && <div className="empty-state"><Target size={28} /><strong>Your circle is ready.</strong><span>Add a task to begin moving toward the goal.</span></div>}
              {tasks.map((task, index) => (
                <article key={task.id} className={`task-card ${selectedId === task.id ? "selected" : ""}`} onClick={() => setSelectedId(task.id)}>
                  <div className="task-card-head"><span className="task-index" style={{color: task.color}}>{String(index + 1).padStart(2, "0")}</span>
                    {editingId === task.id ? <div className="edit-task-fields" onClick={e => e.stopPropagation()}><input value={editTitle} onChange={e => setEditTitle(e.target.value)} aria-label="Task title" /><textarea value={editDetail} onChange={e => setEditDetail(e.target.value)} aria-label="Task details" rows="2" /><div className="edit-actions"><button className="mini-action confirm" onClick={() => saveEdit(task.id)}><Check size={14} /> Save</button><button className="mini-action" onClick={() => setEditingId(null)}><X size={14} /> Cancel</button></div></div> : <div className="task-title-wrap"><h4>{task.title}</h4><p>{task.detail}</p></div>}
                    <div className="task-actions"><button className="tiny-icon" onClick={e => {e.stopPropagation(); startEdit(task);}} aria-label={`Edit ${task.title}`}><Pencil size={14} /></button><button className="tiny-icon delete" onClick={e => {e.stopPropagation(); deleteTask(task.id);}} aria-label={`Delete ${task.title}`}><Trash2 size={14} /></button></div>
                  </div>
                  <div className="task-progress-line"><span>Task progress</span><strong style={{color: task.color}}>{task.progress}%</strong></div>
                  <input className="task-range" aria-label={`${task.title} progress`} type="range" min="0" max="100" value={task.progress} onClick={e => e.stopPropagation()} onChange={e => updateTask(task.id, {progress: Number(e.target.value)})} style={{"--range-progress": `${task.progress}%`, "--task-color": task.color}} />
                  <div className="task-foot"><span>{task.progress === 100 ? "AT THE CENTER" : task.progress === 0 ? "WAITING AT EDGE" : "MOVING FORWARD"}</span><button className="reset-task" onClick={e => {e.stopPropagation(); updateTask(task.id, {progress: 0});}}>Reset task</button></div>
                </article>
              ))}
            </div>
            <form className="add-task-form" onSubmit={addTask}>
              <div className="add-heading"><Plus size={16} /><span>Add a task</span></div>
              <input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="e.g. Prepare team presentation" aria-label="New task title" required />
              <input value={newDetail} onChange={e => setNewDetail(e.target.value)} placeholder="Optional details" aria-label="New task details" />
              <button className="add-button" type="submit"><Plus size={16} /> Add task</button>
            </form>
          </section>
        </div>
      </section>

      <section className="principle-strip" id="principle"><div className="principle-icon"><Target size={20} /></div><div><span className="principle-overline">THE E2C PRINCIPLE</span><strong>One boundary. Many journeys. One center.</strong><p>Project progress and task progress are independent by design—change either whenever the work changes.</p></div><span className="principle-tag">DESIGNED FOR CLARITY</span></section>

      <footer><div className="footer-brand"><b>E2C</b><span>EDGE TO CENTER</span></div><p>A visual concept for making progress easier to see.</p><button className="footer-link" onClick={() => setShowAbout(true)}>About & credits <Info size={14} /></button><span className="footer-copy">© E2C · INTERACTIVE CONCEPT DEMO</span></footer>

      {showAbout && <div className="modal-backdrop" role="presentation" onMouseDown={e => {if (e.target === e.currentTarget) setShowAbout(false);}}><section className="about-modal" role="dialog" aria-modal="true" aria-labelledby="about-title"><button className="modal-close" onClick={() => setShowAbout(false)} aria-label="Close about"><X size={18} /></button><div className="modal-symbol"><Target size={27} /></div><div className="eyebrow">THE IDEA BEHIND THE CIRCLE</div><h2 id="about-title">About E2C</h2><p className="about-lede">Edge to Center is a visual approach to progress: tasks begin at the boundary and move toward the center as work advances.</p><div className="credit-card"><span className="credit-label">CORE CONCEPT DESIGN</span><h3>K. Sathiyaseelan</h3><p>BFA · Senior Paint Artist, BOT VFX</p></div><div className="credit-card"><span className="credit-label">SOFTWARE ARCHITECT & WEB DEVELOPER</span><h3>S. Hariharasudhan</h3><p>B.Tech, 2nd Year · RIT Engineering College</p></div><div className="modal-note">This version is an interactive local-state demo. Changes are for presentation and are not shared across viewers.</div><button className="add-button modal-done" onClick={() => setShowAbout(false)}>Back to E2C</button></section></div>}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
