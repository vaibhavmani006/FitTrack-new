import React, { useState, useEffect, useMemo } from "react";
import {
  Flame, Beef, Wheat, Droplet, Dumbbell, CalendarDays, Settings2,
  Plus, Trash2, Check, ChevronDown, ChevronUp, PlayCircle, X,
  LayoutDashboard, UtensilsCrossed, TrendingUp, RotateCcw
} from "lucide-react";

const COLORS = {
  bg: "#0E1113",
  surface: "#171B1E",
  surfaceHi: "#1F2428",
  border: "#2A3034",
  text: "#EDEFF1",
  textDim: "#8B939A",
  textFaint: "#5C6469",
  cal: "#FF5A36",
  protein: "#3ECF8E",
  carb: "#4C8DFF",
  fat: "#F2B84B",
};

const todayStr = (d = new Date()) => {
  const yr = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${yr}-${mo}-${da}`;
};

const fmtDateLabel = (iso) => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
};

const ytLink = (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q + " tutorial hindi")}`;

const DEFAULT_GOALS = { calories: 2400, protein: 150, carbs: 270, fat: 70 };

const QUICK_FOODS = [
  { name: "Roti (1 medium)", cal: 120, protein: 3, carb: 18, fat: 3.7 },
  { name: "White rice (1 cup)", cal: 205, protein: 4.3, carb: 45, fat: 0.4 },
  { name: "Dal (1 cup)", cal: 230, protein: 18, carb: 40, fat: 0.8 },
  { name: "Paneer (100g)", cal: 265, protein: 18, carb: 6, fat: 20 },
  { name: "Boiled egg (1)", cal: 78, protein: 6.3, carb: 0.6, fat: 5.3 },
  { name: "Chicken breast (100g)", cal: 165, protein: 31, carb: 0, fat: 3.6 },
  { name: "Banana (1)", cal: 105, protein: 1.3, carb: 27, fat: 0.4 },
  { name: "Milk (1 cup)", cal: 149, protein: 8, carb: 12, fat: 8 },
  { name: "Curd / dahi (1 cup)", cal: 150, protein: 8, carb: 11, fat: 8 },
  { name: "Peanut butter (1 tbsp)", cal: 94, protein: 4, carb: 3, fat: 8 },
  { name: "Almonds (10)", cal: 70, protein: 2.6, carb: 2.5, fat: 6 },
  { name: "Whey scoop", cal: 120, protein: 24, carb: 3, fat: 1 },
  { name: "Oats (1 cup cooked)", cal: 150, protein: 5, carb: 27, fat: 2.5 },
  { name: "Mixed sabzi (1 cup)", cal: 120, protein: 4, carb: 15, fat: 5 },
  { name: "Chapati + ghee", cal: 150, protein: 3, carb: 18, fat: 7 },
];

const MEAL_TYPES = ["Breakfast", "Lunch", "Snack", "Dinner"];

const MUSCLE_PROGRAM = [
  {
    day: "Day 1 — Push",
    exercises: [
      { name: "Push-ups", sets: "4", reps: "12-15", tip: "Full range, chest to floor, elbows 45°.", q: "push up form" },
      { name: "Pike push-ups", sets: "3", reps: "8-12", tip: "Hips high, targets shoulders.", q: "pike push up" },
      { name: "Chair dips", sets: "3", reps: "10-15", tip: "Use a sturdy chair, elbows tucked for triceps.", q: "chair tricep dips" },
      { name: "Diamond push-ups", sets: "3", reps: "8-12", tip: "Hands close together under chest.", q: "diamond push up" },
    ],
  },
  {
    day: "Day 2 — Pull",
    exercises: [
      { name: "Towel/doorway rows", sets: "4", reps: "10-15", tip: "Feet against door frame, pull chest to hands.", q: "doorway towel row" },
      { name: "Superman hold", sets: "3", reps: "20-30s", tip: "Squeeze lower back and glutes at top.", q: "superman exercise" },
      { name: "Reverse snow angels", sets: "3", reps: "12-15", tip: "Lying face down, targets rear delts and back.", q: "reverse snow angel exercise" },
      { name: "Bicep curls (bag/bottle)", sets: "3", reps: "12-15", tip: "Use a filled backpack or water bottles.", q: "bicep curl home dumbbell" },
    ],
  },
  {
    day: "Day 3 — Legs & core",
    exercises: [
      { name: "Bodyweight squats", sets: "4", reps: "15-20", tip: "Knees track over toes, chest up.", q: "bodyweight squat form" },
      { name: "Walking lunges", sets: "3", reps: "12 each leg", tip: "Step long, back knee near floor.", q: "walking lunges form" },
      { name: "Glute bridges", sets: "3", reps: "15-20", tip: "Squeeze glutes hard at the top.", q: "glute bridge form" },
      { name: "Wall sit", sets: "3", reps: "30-45s", tip: "Thighs parallel to floor, back flat on wall.", q: "wall sit exercise" },
      { name: "Plank", sets: "3", reps: "30-60s", tip: "Straight line head to heels, brace core.", q: "plank form" },
    ],
  },
];

const CALISTHENICS_PROGRAM = [
  {
    day: "Push-up progression",
    exercises: [
      { name: "Knee push-ups", sets: "3", reps: "12-15", tip: "Start here if standard push-ups are hard.", q: "knee push up progression" },
      { name: "Standard push-ups", sets: "4", reps: "10-15", tip: "Master strict form before progressing.", q: "standard push up progression" },
      { name: "Archer push-ups", sets: "3", reps: "6-8 each side", tip: "One arm extended out to the side.", q: "archer push up tutorial" },
      { name: "One-arm push-up progression", sets: "3", reps: "3-6", tip: "Advanced — use elevated feet or band assist.", q: "one arm push up progression" },
    ],
  },
  {
    day: "Pull-up progression",
    exercises: [
      { name: "Dead hang", sets: "3", reps: "20-30s", tip: "Build grip and shoulder stability first.", q: "dead hang pull up bar" },
      { name: "Negative pull-ups", sets: "3", reps: "5-8", tip: "Jump to top, lower down slowly (3-5s).", q: "negative pull up tutorial" },
      { name: "Band-assisted pull-ups", sets: "3", reps: "6-10", tip: "Use a resistance band looped over the bar.", q: "band assisted pull up" },
      { name: "Full pull-ups", sets: "4", reps: "AMRAP", tip: "Chin clears the bar, full extension at bottom.", q: "pull up form tutorial" },
    ],
  },
  {
    day: "Core & L-sit line",
    exercises: [
      { name: "Hollow body hold", sets: "3", reps: "20-30s", tip: "Lower back pressed to floor throughout.", q: "hollow body hold tutorial" },
      { name: "Plank to pike", sets: "3", reps: "10-12", tip: "Piston hips up keeping legs straight.", q: "plank to pike exercise" },
      { name: "Tuck L-sit", sets: "3", reps: "10-20s", tip: "Knees to chest, hands pressing floor/parallettes.", q: "tuck l sit progression" },
      { name: "Full L-sit", sets: "3", reps: "5-15s", tip: "Legs straight out, advanced core/hip flexor strength.", q: "l sit progression tutorial" },
    ],
  },
  {
    day: "Handstand & skills",
    exercises: [
      { name: "Wall handstand hold", sets: "4", reps: "20-40s", tip: "Chest to wall, stack shoulders over wrists.", q: "wall handstand hold tutorial" },
      { name: "Handstand push-up negatives", sets: "3", reps: "3-5", tip: "Lower slowly from wall handstand.", q: "handstand push up negative" },
      { name: "Pistol squat progression", sets: "3", reps: "5-8 each leg", tip: "Use a chair or wall for assistance at first.", q: "pistol squat progression tutorial" },
      { name: "Muscle-up drills", sets: "3", reps: "3-5", tip: "Combine explosive pull-up with transition practice.", q: "muscle up progression tutorial" },
    ],
  },
];

const STORAGE_PREFIX = "fitlog:";

function useStoredState(key, initial) {
  const fullKey = STORAGE_PREFIX + key;
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(fullKey);
      return raw != null ? JSON.parse(raw) : initial;
    } catch (e) {
      return initial;
    }
  });

  // Re-read from localStorage whenever the key changes (e.g. switching dates)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(fullKey);
      setValue(raw != null ? JSON.parse(raw) : initial);
    } catch (e) {
      setValue(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullKey]);

  useEffect(() => {
    try {
      localStorage.setItem(fullKey, JSON.stringify(value));
    } catch (e) {
      console.error("localStorage set failed", fullKey, e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, fullKey]);

  return [value, setValue, true];
}

function Ring({ pct, size = 168, stroke = 14, color, trackColor = "#262B2F", children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, pct));
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={trackColor} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={c * (1 - clamped)}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}

function MacroBar({ label, icon, value, goal, color }) {
  const pct = goal > 0 ? Math.min(1, value / goal) : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: COLORS.textDim, fontSize: 13 }}>
          {icon}
          <span>{label}</span>
        </div>
        <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 13, color: COLORS.text }}>
          {Math.round(value)}<span style={{ color: COLORS.textFaint }}>/{goal}g</span>
        </span>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: "#262B2F", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct * 100}%`, background: color, borderRadius: 4, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        background: "none", border: "none", cursor: "pointer",
        color: active ? COLORS.cal : COLORS.textFaint,
        padding: "8px 4px", flex: 1, fontFamily: "Inter, sans-serif",
      }}
    >
      {icon}
      <span style={{ fontSize: 11, fontWeight: 500 }}>{label}</span>
    </button>
  );
}

export default function FitTrackApp() {
  const [tab, setTab] = useState("dashboard");
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [goals, setGoals] = useStoredState("goals", DEFAULT_GOALS);
  const [entries, setEntries, entriesLoaded] = useStoredState(`meals:${selectedDate}`, []);
  const [workoutDone, setWorkoutDone, workoutLoaded] = useStoredState(`workout:${selectedDate}`, []);
  const [history, setHistory] = useStoredState("history-index", []);
  const [customName, setCustomName] = useState("");
  const [customCal, setCustomCal] = useState("");
  const [customProtein, setCustomProtein] = useState("");
  const [customCarb, setCustomCarb] = useState("");
  const [customFat, setCustomFat] = useState("");
  const [customMeal, setCustomMeal] = useState("Breakfast");
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedProgram, setExpandedProgram] = useState("muscle");
  const [expandedDay, setExpandedDay] = useState(null);
  const [pastEntries, setPastEntries] = useState({});
  const [pastWorkouts, setPastWorkouts] = useState({});

  // Reset per-day states when the selected date changes; useStoredState keys are derived
  // from selectedDate so they auto-reload via effect below by re-mounting state hooks.
  // (React re-runs the storage hook because key changes trigger new effect deps.)

  useEffect(() => {
    if (!history.includes(selectedDate)) {
      setHistory((h) => (h.includes(selectedDate) ? h : [...h, selectedDate].sort()));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (tab !== "progress") return;
    let cancelled = false;
    (async () => {
      const days = history.slice(-14);
      const ent = {};
      const wk = {};
      for (const d of days) {
        try {
          const r = await window.storage.get(`meals:${d}`, false);
          ent[d] = r && r.value ? JSON.parse(r.value) : [];
        } catch { ent[d] = []; }
        try {
          const r2 = await window.storage.get(`workout:${d}`, false);
          wk[d] = r2 && r2.value ? JSON.parse(r2.value) : [];
        } catch { wk[d] = []; }
      }
      if (!cancelled) { setPastEntries(ent); setPastWorkouts(wk); }
    })();
    return () => { cancelled = true; };
  }, [tab, history.length]);

  const totals = useMemo(() => {
    return entries.reduce((acc, e) => ({
      cal: acc.cal + e.cal, protein: acc.protein + e.protein,
      carb: acc.carb + e.carb, fat: acc.fat + e.fat,
    }), { cal: 0, protein: 0, carb: 0, fat: 0 });
  }, [entries]);

  const addQuickFood = (food, meal) => {
    setEntries((prev) => [...prev, { id: Date.now() + Math.random(), meal, name: food.name, cal: food.cal, protein: food.protein, carb: food.carb, fat: food.fat }]);
  };

  const addCustomFood = () => {
    if (!customName.trim() || !customCal) return;
    setEntries((prev) => [...prev, {
      id: Date.now() + Math.random(), meal: customMeal, name: customName.trim(),
      cal: Number(customCal) || 0, protein: Number(customProtein) || 0,
      carb: Number(customCarb) || 0, fat: Number(customFat) || 0,
    }]);
    setCustomName(""); setCustomCal(""); setCustomProtein(""); setCustomCarb(""); setCustomFat("");
    setShowAddForm(false);
  };

  const removeEntry = (id) => setEntries((prev) => prev.filter((e) => e.id !== id));

  const toggleExercise = (name) => {
    setWorkoutDone((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);
  };

  const changeDate = (delta) => {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + delta);
    const iso = todayStr(d);
    if (iso > todayStr()) return;
    setSelectedDate(iso);
  };

  const calPct = goals.calories > 0 ? totals.cal / goals.calories : 0;
  const isToday = selectedDate === todayStr();
  const program = expandedProgram === "muscle" ? MUSCLE_PROGRAM : CALISTHENICS_PROGRAM;

  return (
    <div style={{
      fontFamily: "Inter, sans-serif", background: COLORS.bg, color: COLORS.text,
      minHeight: "600px", maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column",
      borderRadius: 20, overflow: "hidden", border: `1px solid ${COLORS.border}`,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
        * { box-sizing: border-box; }
        input, select { font-family: Inter, sans-serif; }
        ::placeholder { color: ${COLORS.textFaint}; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "20px 20px 12px", borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em" }}>
            FIT<span style={{ color: COLORS.cal }}>LOG</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => changeDate(-1)} style={navBtnStyle}>‹</button>
            <span style={{ fontSize: 13, color: COLORS.textDim, minWidth: 90, textAlign: "center" }}>
              {isToday ? "Today" : fmtDateLabel(selectedDate)}
            </span>
            <button onClick={() => changeDate(1)} disabled={isToday} style={{ ...navBtnStyle, opacity: isToday ? 0.3 : 1 }}>›</button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        {tab === "dashboard" && (
          <div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <Ring pct={calPct} color={calPct > 1 ? COLORS.fat : COLORS.cal}>
                <Flame size={20} color={COLORS.cal} style={{ marginBottom: 4 }} />
                <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 26, fontWeight: 500 }}>
                  {Math.round(totals.cal)}
                </div>
                <div style={{ fontSize: 11, color: COLORS.textFaint }}>of {goals.calories} kcal</div>
              </Ring>
            </div>

            <div style={{ background: COLORS.surface, borderRadius: 14, padding: 16, marginBottom: 20 }}>
              <MacroBar label="Protein" icon={<Beef size={14} />} value={totals.protein} goal={goals.protein} color={COLORS.protein} />
              <MacroBar label="Carbs" icon={<Wheat size={14} />} value={totals.carb} goal={goals.carbs} color={COLORS.carb} />
              <MacroBar label="Fat" icon={<Droplet size={14} />} value={totals.fat} goal={goals.fat} color={COLORS.fat} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Today's log</span>
              <span style={{ fontSize: 12, color: COLORS.textFaint }}>{entries.length} items</span>
            </div>

            {entries.length === 0 && (
              <div style={{ textAlign: "center", padding: "24px 0", color: COLORS.textFaint, fontSize: 13 }}>
                Nothing logged yet. Add a meal below.
              </div>
            )}

            {MEAL_TYPES.map((mt) => {
              const items = entries.filter((e) => e.meal === mt);
              if (items.length === 0) return null;
              return (
                <div key={mt} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: COLORS.textFaint, marginBottom: 6 }}>{mt}</div>
                  {items.map((e) => (
                    <div key={e.id} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      background: COLORS.surface, borderRadius: 10, padding: "10px 12px", marginBottom: 6,
                    }}>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 500 }}>{e.name}</div>
                        <div style={{ fontSize: 11, color: COLORS.textFaint, fontFamily: "IBM Plex Mono, monospace" }}>
                          {e.cal} kcal · P{e.protein} C{e.carb} F{e.fat}
                        </div>
                      </div>
                      <button onClick={() => removeEntry(e.id)} style={{ background: "none", border: "none", color: COLORS.textFaint, cursor: "pointer", padding: 4 }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {tab === "log" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>Quick add</span>
              <button onClick={() => setShowAddForm((s) => !s)} style={pillBtnStyle}>
                <Plus size={14} /> Custom
              </button>
            </div>

            {showAddForm && (
              <div style={{ background: COLORS.surface, borderRadius: 12, padding: 14, marginBottom: 16 }}>
                <input placeholder="Food name" value={customName} onChange={(e) => setCustomName(e.target.value)} style={inputStyle} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "8px 0" }}>
                  <input placeholder="Calories" type="number" value={customCal} onChange={(e) => setCustomCal(e.target.value)} style={inputStyle} />
                  <select value={customMeal} onChange={(e) => setCustomMeal(e.target.value)} style={inputStyle}>
                    {MEAL_TYPES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
                  <input placeholder="Protein g" type="number" value={customProtein} onChange={(e) => setCustomProtein(e.target.value)} style={inputStyle} />
                  <input placeholder="Carb g" type="number" value={customCarb} onChange={(e) => setCustomCarb(e.target.value)} style={inputStyle} />
                  <input placeholder="Fat g" type="number" value={customFat} onChange={(e) => setCustomFat(e.target.value)} style={inputStyle} />
                </div>
                <button onClick={addCustomFood} style={{ ...pillBtnStyle, width: "100%", justifyContent: "center", background: COLORS.cal, color: "#fff", border: "none" }}>
                  Add to log
                </button>
              </div>
            )}

            <div style={{ marginBottom: 10, fontSize: 12, color: COLORS.textFaint }}>Tap a food, then choose meal</div>
            {QUICK_FOODS.map((f) => (
              <QuickFoodRow key={f.name} food={f} onAdd={addQuickFood} />
            ))}
          </div>
        )}

        {tab === "workouts" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button onClick={() => { setExpandedProgram("muscle"); setExpandedDay(null); }}
                style={{ ...toggleBtnStyle, background: expandedProgram === "muscle" ? COLORS.cal : COLORS.surface, color: expandedProgram === "muscle" ? "#fff" : COLORS.textDim }}>
                Muscle building
              </button>
              <button onClick={() => { setExpandedProgram("cali"); setExpandedDay(null); }}
                style={{ ...toggleBtnStyle, background: expandedProgram === "cali" ? COLORS.cal : COLORS.surface, color: expandedProgram === "cali" ? "#fff" : COLORS.textDim }}>
                Calisthenics
              </button>
            </div>

            {program.map((day, di) => {
              const isOpen = expandedDay === di;
              const doneCount = day.exercises.filter((ex) => workoutDone.includes(ex.name)).length;
              return (
                <div key={day.day} style={{ background: COLORS.surface, borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
                  <button onClick={() => setExpandedDay(isOpen ? null : di)} style={{
                    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "none", border: "none", color: COLORS.text, padding: 14, cursor: "pointer",
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{day.day}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, color: COLORS.textFaint, fontFamily: "IBM Plex Mono, monospace" }}>
                        {doneCount}/{day.exercises.length}
                      </span>
                      {isOpen ? <ChevronUp size={16} color={COLORS.textFaint} /> : <ChevronDown size={16} color={COLORS.textFaint} />}
                    </div>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "0 14px 14px" }}>
                      {day.exercises.map((ex) => {
                        const done = workoutDone.includes(ex.name);
                        return (
                          <div key={ex.name} style={{
                            background: COLORS.surfaceHi, borderRadius: 10, padding: 12, marginBottom: 8,
                            border: done ? `1px solid ${COLORS.protein}` : `1px solid transparent`,
                          }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 13.5, fontWeight: 500 }}>{ex.name}</div>
                                <div style={{ fontSize: 11.5, color: COLORS.textDim, margin: "4px 0", fontFamily: "IBM Plex Mono, monospace" }}>
                                  {ex.sets} sets × {ex.reps}
                                </div>
                                <div style={{ fontSize: 11.5, color: COLORS.textFaint, marginBottom: 8 }}>{ex.tip}</div>
                                <a href={ytLink(ex.q)} target="_blank" rel="noreferrer" style={{
                                  display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5,
                                  color: COLORS.carb, textDecoration: "none",
                                }}>
                                  <PlayCircle size={13} /> Watch tutorial
                                </a>
                              </div>
                              <button onClick={() => toggleExercise(ex.name)} style={{
                                width: 26, height: 26, borderRadius: "50%", border: `1.5px solid ${done ? COLORS.protein : COLORS.border}`,
                                background: done ? COLORS.protein : "none", display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", flexShrink: 0, marginLeft: 8,
                              }}>
                                {done && <Check size={14} color="#0E1113" />}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === "progress" && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Last 14 days</div>
            {history.slice(-14).reverse().map((d) => {
              const e = pastEntries[d] || [];
              const w = pastWorkouts[d] || [];
              const cal = e.reduce((s, x) => s + x.cal, 0);
              const pct = goals.calories > 0 ? Math.min(1, cal / goals.calories) : 0;
              return (
                <div key={d} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 68, fontSize: 11, color: COLORS.textFaint, flexShrink: 0 }}>{fmtDateLabel(d)}</div>
                  <div style={{ flex: 1, height: 10, background: "#262B2F", borderRadius: 5, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct * 100}%`, background: COLORS.cal, borderRadius: 5 }} />
                  </div>
                  <div style={{ width: 54, fontSize: 11, fontFamily: "IBM Plex Mono, monospace", color: COLORS.textDim, textAlign: "right" }}>{Math.round(cal)}</div>
                  <div style={{ width: 18, textAlign: "center" }}>
                    {w.length > 0 && <Dumbbell size={13} color={COLORS.protein} />}
                  </div>
                </div>
              );
            })}
            {history.length === 0 && (
              <div style={{ textAlign: "center", padding: "24px 0", color: COLORS.textFaint, fontSize: 13 }}>
                Log a few days to see your trend here.
              </div>
            )}
          </div>
        )}

        {tab === "settings" && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Daily goals</div>
            <GoalInput label="Calories (kcal)" value={goals.calories} onChange={(v) => setGoals({ ...goals, calories: v })} icon={<Flame size={14} color={COLORS.cal} />} />
            <GoalInput label="Protein (g)" value={goals.protein} onChange={(v) => setGoals({ ...goals, protein: v })} icon={<Beef size={14} color={COLORS.protein} />} />
            <GoalInput label="Carbs (g)" value={goals.carbs} onChange={(v) => setGoals({ ...goals, carbs: v })} icon={<Wheat size={14} color={COLORS.carb} />} />
            <GoalInput label="Fat (g)" value={goals.fat} onChange={(v) => setGoals({ ...goals, fat: v })} icon={<Droplet size={14} color={COLORS.fat} />} />

            <div style={{ marginTop: 20, padding: 14, background: COLORS.surface, borderRadius: 12, fontSize: 12, color: COLORS.textFaint, lineHeight: 1.6 }}>
              For muscle building, aim for roughly 1.6–2.2g protein per kg bodyweight, and a slight calorie surplus (+200 to +400 kcal above maintenance). Adjust these numbers as your weight and progress change.
            </div>

            <button onClick={() => { setGoals(DEFAULT_GOALS); }} style={{ ...pillBtnStyle, marginTop: 16 }}>
              <RotateCcw size={13} /> Reset to defaults
            </button>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{ display: "flex", borderTop: `1px solid ${COLORS.border}`, background: COLORS.surface }}>
        <TabButton active={tab === "dashboard"} onClick={() => setTab("dashboard")} icon={<LayoutDashboard size={18} />} label="Today" />
        <TabButton active={tab === "log"} onClick={() => setTab("log")} icon={<UtensilsCrossed size={18} />} label="Add food" />
        <TabButton active={tab === "workouts"} onClick={() => setTab("workouts")} icon={<Dumbbell size={18} />} label="Workout" />
        <TabButton active={tab === "progress"} onClick={() => setTab("progress")} icon={<TrendingUp size={18} />} label="Progress" />
        <TabButton active={tab === "settings"} onClick={() => setTab("settings")} icon={<Settings2 size={18} />} label="Goals" />
      </div>
    </div>
  );
}

function QuickFoodRow({ food, onAdd }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 8 }}>
      <button onClick={() => setOpen((o) => !o)} style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        background: COLORS.surface, border: "none", borderRadius: 10, padding: "11px 13px",
        color: COLORS.text, cursor: "pointer",
      }}>
        <span style={{ fontSize: 13.5, fontWeight: 500 }}>{food.name}</span>
        <span style={{ fontSize: 11.5, color: COLORS.textFaint, fontFamily: "IBM Plex Mono, monospace" }}>{food.cal} kcal</span>
      </button>
      {open && (
        <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
          {MEAL_TYPES.map((mt) => (
            <button key={mt} onClick={() => { onAdd(food, mt); setOpen(false); }} style={{
              flex: "1 1 auto", fontSize: 12, padding: "7px 10px", borderRadius: 8,
              background: COLORS.surfaceHi, border: `1px solid ${COLORS.border}`, color: COLORS.textDim, cursor: "pointer",
            }}>
              {mt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function GoalInput({ label, value, onChange, icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, background: COLORS.surface, borderRadius: 10, padding: "10px 13px" }}>
      {icon}
      <span style={{ fontSize: 13, flex: 1, color: COLORS.textDim }}>{label}</span>
      <input
        type="number" value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        style={{ width: 70, background: COLORS.surfaceHi, border: `1px solid ${COLORS.border}`, borderRadius: 6, color: COLORS.text, padding: "6px 8px", fontSize: 13, textAlign: "right" }}
      />
    </div>
  );
}

const navBtnStyle = {
  background: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.text,
  width: 26, height: 26, borderRadius: "50%", cursor: "pointer", fontSize: 15, lineHeight: 1,
};

const pillBtnStyle = {
  display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5,
  background: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.textDim,
  borderRadius: 20, padding: "7px 12px", cursor: "pointer",
};

const toggleBtnStyle = {
  flex: 1, padding: "10px", borderRadius: 10, border: "none", cursor: "pointer",
  fontSize: 13, fontWeight: 500,
};

const inputStyle = {
  width: "100%", background: COLORS.surfaceHi, border: `1px solid ${COLORS.border}`,
  borderRadius: 8, color: COLORS.text, padding: "9px 11px", fontSize: 13,
};
