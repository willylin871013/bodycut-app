import { useState, useEffect, useRef, useCallback } from "react";

// ── CONSTANTS ──────────────────────────────────────────────────────────────
const START = 83.7, TARGET = 79.1;
const START_DATE = "2026-05-30", END_DATE = "2026-08-03";
const STORAGE_KEY = "bodycut_entries_v1";

const PHASES = [
  { weeks: "W1–2", dates: "05.30 — 06.13", name: "適應期 ADAPTATION", tag: "MODERATE CUT", tagColor: "#ff4d00", target: 82.3,
    train: ["重訓 4次/週（全身複合動作）","低強度有氧 30分鐘 × 3次","每週減重目標：0.7 kg","保持大重量，防肌肉流失"],
    diet: ["熱量：2,250 kcal（赤字 -660）","蛋白質：每公斤 2.2g → 184g","碳水：訓練前後集中攝取","建立飲食習慣，紀錄每餐"] },
  { weeks: "W3–5", dates: "06.14 — 07.05", name: "主力減脂期 DEEP CUT", tag: "AGGRESSIVE CUT", tagColor: "#e8ff00", target: 80.1,
    train: ["重訓 5次/週（推拉腿分化）","HIIT 20分鐘 × 2次/週","低強度有氧 40分鐘 × 2次","步數目標：每天 10,000 步"],
    diet: ["熱量：2,100 kcal（赤字 -810）","蛋白質：維持 180–190g","每週一次 Refeed Day 2,600 kcal","碳水選糙米、地瓜"] },
  { weeks: "W6–7", dates: "07.06 — 07.19", name: "強化期 INTENSIFY", tag: "AGGRESSIVE CUT", tagColor: "#e8ff00", target: 79.3,
    train: ["重訓維持 5次/週","早晨空腹有氧 20分鐘","HIIT 減為 1次，防疲勞","睡眠 7–8小時（恢復關鍵）"],
    diet: ["熱量：2,050 kcal（赤字 -860）","循環碳水：訓練日 +100 kcal","休息日碳水降至 100g 以下"] },
  { weeks: "W8–9", dates: "07.20 — 08.03", name: "衝刺收尾 PEAK WEEK", tag: "FINAL PUSH", tagColor: "#00d4ff", target: 79.1,
    train: ["重訓降為 3–4次","每日步行有氧 45分鐘","停止 HIIT，讓身體消炎","08.03 InBody 複測"],
    diet: ["熱量：2,000 kcal（赤字 -900）","蛋白質拉高至 200g","減少鈉鹽，降水腫","最後 3天輕微碳水填充"] },
];

// ── STYLES ─────────────────────────────────────────────────────────────────
const S = {
  app: { background:"#080808", color:"#f0f0f0", minHeight:"100vh", fontFamily:"'Noto Sans TC', sans-serif", overflow:"hidden" },
  nav: { display:"flex", alignItems:"stretch", borderBottom:"1px solid #222", background:"#111", position:"sticky", top:0, zIndex:50, height:52 },
  navLogo: { padding:"0 24px", display:"flex", alignItems:"center", borderRight:"1px solid #222", gap:10 },
  navLogoText: { fontFamily:"'Bebas Neue', sans-serif", fontSize:24, letterSpacing:3, color:"#e8ff00", lineHeight:1 },
  navLogoSub: { fontFamily:"'Roboto Mono', monospace", fontSize:8, color:"#555", letterSpacing:2, marginTop:3 },
  navTab: (active) => ({ padding:"0 22px", fontFamily:"'Roboto Mono', monospace", fontSize:10, letterSpacing:3, color: active?"#e8ff00":"#555", cursor:"pointer", border:"none", background:"transparent", height:52, display:"flex", alignItems:"center", transition:"color .2s", textTransform:"uppercase", position:"relative", borderRight:"1px solid #222", borderBottom: active?"2px solid #e8ff00":"2px solid transparent" }),
  badge: { marginLeft:6, background:"#e8ff00", color:"#000", fontSize:9, padding:"1px 5px", borderRadius:10, fontFamily:"'Roboto Mono', monospace" },
  
  // Plan
  hero: { padding:"36px 36px 24px", borderBottom:"1px solid #222", position:"relative", overflow:"hidden" },
  heroTag: { fontFamily:"'Roboto Mono', monospace", fontSize:10, letterSpacing:4, color:"#e8ff00", marginBottom:10 },
  heroH1: { fontFamily:"'Bebas Neue', sans-serif", fontSize:"clamp(48px,7vw,88px)", lineHeight:.9, letterSpacing:2 },
  heroSub: { marginTop:12, fontSize:11, color:"#555", fontFamily:"'Roboto Mono', monospace", letterSpacing:1 },
  statsStrip: { display:"grid", gridTemplateColumns:"repeat(5,1fr)", borderBottom:"1px solid #222" },
  statCell: { padding:"18px 22px", borderRight:"1px solid #222" },
  statLbl: { fontSize:9, letterSpacing:3, color:"#555", fontFamily:"'Roboto Mono', monospace", textTransform:"uppercase", marginBottom:6 },
  statVal: { fontFamily:"'Bebas Neue', sans-serif", fontSize:38, lineHeight:1 },
  planBody: { display:"grid", gridTemplateColumns:"1fr 360px" },
  phasesCol: { padding:"24px 28px", borderRight:"1px solid #222" },
  colTitle: { fontFamily:"'Bebas Neue', sans-serif", fontSize:22, letterSpacing:2, marginBottom:4, display:"flex", alignItems:"center", gap:10 },
  colSub: { fontSize:9, fontFamily:"'Roboto Mono', monospace", color:"#555", letterSpacing:2, marginBottom:18, paddingLeft:14 },
  phase: { marginBottom:3, border:"1px solid #222", overflow:"hidden" },
  phHead: { display:"grid", gridTemplateColumns:"88px 1fr auto", alignItems:"center", padding:"11px 15px", background:"#111", gap:11 },
  phNum: { fontFamily:"'Bebas Neue', sans-serif", fontSize:28, color:"#e8ff00", lineHeight:1 },
  phBody: { padding:"0 15px 15px", background:"#181818", display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 },
  phColTitle: { fontSize:8, letterSpacing:3, color:"#555", fontFamily:"'Roboto Mono', monospace", padding:"11px 0 7px", borderBottom:"1px solid #222", marginBottom:7 },
  phLi: { fontSize:11, color:"#bbb", padding:"2px 0 2px 11px", position:"relative", lineHeight:1.5 },
  sidebarCol: { padding:"24px 20px" },
  card: (borderLeft) => ({ border:"1px solid #222", padding:18, marginBottom:3, ...(borderLeft?{borderLeft:`3px solid ${borderLeft}`}:{}) }),
  cardTtl: (color) => ({ fontSize:9, letterSpacing:3, color: color||"#555", fontFamily:"'Roboto Mono', monospace", textTransform:"uppercase", marginBottom:11, paddingBottom:9, borderBottom:"1px solid #222" }),
  
  // Tracker
  trackerWrap: { display:"grid", gridTemplateColumns:"290px 1fr", minHeight:"calc(100vh - 52px)" },
  trSidebar: { background:"#111", borderRight:"1px solid #222", display:"flex", flexDirection:"column" },
  inpLabel: { display:"block", fontSize:9, color:"#888", fontFamily:"'Roboto Mono', monospace", letterSpacing:1, marginBottom:4 },
  input: { width:"100%", background:"#080808", border:"1px solid #222", color:"#f0f0f0", padding:"8px 10px", fontSize:13, fontFamily:"'Roboto Mono', monospace", outline:"none", borderRadius:2 },
  btnPrimary: { width:"100%", padding:10, background:"#e8ff00", color:"#000", border:"none", fontFamily:"'Bebas Neue', sans-serif", fontSize:16, letterSpacing:2, cursor:"pointer", borderRadius:2 },
  btnSecondary: { width:"100%", padding:8, background:"transparent", border:"1px solid #00d4ff", color:"#00d4ff", fontFamily:"'Bebas Neue', sans-serif", fontSize:14, letterSpacing:2, cursor:"pointer", borderRadius:2 },
  tcRow: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:3, padding:"12px 22px 3px" },
  tc: { background:"#111", border:"1px solid #222", padding:"11px 13px", borderRadius:2 },
};

// ── CHART ──────────────────────────────────────────────────────────────────
function WeightChart({ entries }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if(!canvas) return;
    const W = canvas.offsetWidth||700, H = 185;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,W,H);
    const PAD={t:13,b:24,l:32,r:14};
    const cW=W-PAD.l-PAD.r, cH=H-PAD.t-PAD.b;
    const startMs=new Date(START_DATE).getTime(), endMs=new Date(END_DATE).getTime(), totalMs=endMs-startMs;
    const minY=TARGET-0.8, maxY=START+0.4;
    const yS=v=>PAD.t+cH-((v-minY)/(maxY-minY))*cH;
    const xS=d=>PAD.l+((new Date(d).getTime()-startMs)/totalMs)*cW;
    // grid
    ctx.strokeStyle="#1a1a1a"; ctx.lineWidth=1;
    for(let y=Math.ceil(minY);y<=Math.ceil(maxY);y++){
      const yy=yS(y); ctx.beginPath(); ctx.moveTo(PAD.l,yy); ctx.lineTo(PAD.l+cW,yy); ctx.stroke();
      ctx.fillStyle="#333"; ctx.font="8px Roboto Mono"; ctx.textAlign="right"; ctx.fillText(y,PAD.l-3,yy+3);
    }
    // target dashed
    ctx.setLineDash([4,6]); ctx.strokeStyle="#222"; ctx.lineWidth=1.5;
    ctx.beginPath();
    for(let i=0;i<=9;i++){const x=PAD.l+(i/9)*cW,v=START-(START-TARGET)*(i/9),y=yS(v);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
    ctx.stroke(); ctx.setLineDash([]);
    // actual
    if(entries.length>0){
      const grad=ctx.createLinearGradient(PAD.l,0,PAD.l+cW,0);
      grad.addColorStop(0,"#ff4d00"); grad.addColorStop(1,"#e8ff00");
      const aG=ctx.createLinearGradient(0,PAD.t,0,PAD.t+cH);
      aG.addColorStop(0,"rgba(232,255,0,0.1)"); aG.addColorStop(1,"rgba(232,255,0,0)");
      ctx.beginPath();
      entries.forEach((e,i)=>{const x=xS(e.date),y=yS(e.weight);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
      ctx.lineTo(xS(entries[entries.length-1].date),PAD.t+cH);
      ctx.lineTo(xS(entries[0].date),PAD.t+cH);
      ctx.closePath(); ctx.fillStyle=aG; ctx.fill();
      ctx.beginPath(); ctx.strokeStyle=grad; ctx.lineWidth=2; ctx.lineJoin="round"; ctx.lineCap="round";
      entries.forEach((e,i)=>{const x=xS(e.date),y=yS(e.weight);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
      ctx.stroke();
      entries.forEach(e=>{
        const x=xS(e.date),y=yS(e.weight);
        ctx.beginPath(); ctx.arc(x,y,e.source==="inbody"?5:3,0,Math.PI*2);
        ctx.fillStyle=e.source==="inbody"?"#00d4ff":"#e8ff00"; ctx.fill();
      });
    }
    ctx.fillStyle="#00ff88"; ctx.font="bold 8px Roboto Mono"; ctx.textAlign="left";
    ctx.fillText("TARGET 79.1",PAD.l+cW-72,yS(TARGET)-4);
    ["W1","W2","W3","W4","W5","W6","W7","W8","W9"].forEach((l,i)=>{
      ctx.fillStyle="#2a2a2a"; ctx.font="8px Roboto Mono"; ctx.textAlign="center";
      ctx.fillText(l,PAD.l+(i/8)*cW,H-3);
    });
  }, [entries]);
  return <canvas ref={canvasRef} style={{width:"100%",height:185}} />;
}

// ── MAIN APP ───────────────────────────────────────────────────────────────
export default function BodyCutApp() {
  const [page, setPage] = useState("plan");
  const [tab, setTab] = useState("chart");
  const [entries, setEntries] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  // form
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [weight, setWeight] = useState("");
  const [bf, setBf] = useState("");
  const [note, setNote] = useState("");
  // inbody
  const [imgB64, setImgB64] = useState(null);
  const [imgName, setImgName] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileRef = useRef(null);

  // ── STORAGE ──
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(STORAGE_KEY);
        if (r?.value) setEntries(JSON.parse(r.value));
      } catch(e) { /* no data yet */ }
      setLoaded(true);
    })();
  }, []);

  const saveEntries = useCallback(async (newEntries) => {
    setSaving(true);
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(newEntries));
    } catch(e) { showToast("⚠ 儲存失敗"); }
    setSaving(false);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  };

  // ── COMPUTED ──
  const latest = entries.length > 0 ? entries[entries.length-1] : null;
  const lost = latest ? +(START - latest.weight).toFixed(1) : 0;
  const remaining = latest ? +(latest.weight - TARGET).toFixed(1) : +(START - TARGET).toFixed(1);
  const pct = Math.max(0, Math.min(100, Math.round((Math.max(0,lost)/(START-TARGET))*100)));
  const daysLeft = Math.max(0, Math.round((new Date(END_DATE)-new Date())/86400000));
  const overallPct = Math.max(0, Math.min(100, Math.round(((new Date()-new Date(START_DATE))/(new Date(END_DATE)-new Date(START_DATE)))*100)));
  const weekNum = Math.ceil((new Date()-new Date(START_DATE))/604800000);
  const currentPhase = weekNum<=2?"W1–2 適應期":weekNum<=5?"W3–5 主力減脂期":weekNum<=7?"W6–7 強化期":weekNum<=9?"W8–9 衝刺收尾":"計畫完成 🎉";

  // ── ADD ENTRY ──
  const addEntry = async () => {
    if (!date || !weight) { showToast("請填入日期與體重"); return; }
    const w = parseFloat(weight);
    if (w < 60 || w > 120) { showToast("體重數值不合理"); return; }
    const newEntry = { date, weight: w, bf: bf?parseFloat(bf):null, note, source:"manual", ts: Date.now() };
    const filtered = entries.filter(e => !(e.date === date && e.source === "manual"));
    const newEntries = [...filtered, newEntry].sort((a,b)=>a.date.localeCompare(b.date));
    setEntries(newEntries);
    await saveEntries(newEntries);
    setWeight(""); setBf(""); setNote("");
    showToast("✓ 已記錄並儲存");
  };

  // ── FILE / AI ──
  const handleFile = (file) => {
    if (!file?.type.startsWith("image/")) { showToast("請上傳圖片"); return; }
    const r = new FileReader();
    r.onload = e => { setImgB64(e.target.result.split(",")[1]); setImgName(file.name); };
    r.readAsDataURL(file);
  };

  const analyzeInBody = async () => {
    if (!imgB64) return;
    setAnalyzing(true); setAiResult(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:800,
          messages:[{role:"user", content:[
            {type:"image", source:{type:"base64", media_type:"image/jpeg", data:imgB64}},
            {type:"text", text:`這是 InBody 報告。找出以下數值以純 JSON 回傳（不要 markdown）：{"date":"YYYY-MM-DD，若無填 ${new Date().toISOString().split("T")[0]}","weight":體重數字,"bodyFat":體脂率數字或null,"muscleMass":骨骼肌數字或null,"note":"InBody測量摘要"}`}
          ]}]
        })
      });
      const data = await res.json();
      const txt = data.content.filter(b=>b.type==="text").map(b=>b.text).join("").replace(/```json|```/g,"").trim();
      setAiResult(JSON.parse(txt));
    } catch(e) { showToast("⚠ AI 解析失敗，請確認圖片清晰度"); }
    setAnalyzing(false);
  };

  const importAi = async () => {
    if (!aiResult) return;
    const d = aiResult;
    const newEntry = { date:d.date, weight:d.weight, bf:d.bodyFat, muscleMass:d.muscleMass, note:d.note||"InBody測量", source:"inbody", ts:Date.now() };
    const filtered = entries.filter(e => !(e.date === d.date && e.source === "inbody"));
    const newEntries = [...filtered, newEntry].sort((a,b)=>a.date.localeCompare(b.date));
    setEntries(newEntries);
    await saveEntries(newEntries);
    setAiResult(null); setImgB64(null); setImgName("");
    showToast("✓ InBody 數據已匯入");
  };

  if (!loaded) return (
    <div style={{...S.app, display:"flex", alignItems:"center", justifyContent:"center", height:"100vh"}}>
      <div style={{fontFamily:"'Bebas Neue', sans-serif", fontSize:32, color:"#e8ff00", letterSpacing:4}}>LOADING...</div>
    </div>
  );

  return (
    <div style={S.app}>
      {/* GOOGLE FONTS */}
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+TC:wght@300;400;500;700&family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        input,textarea{transition:border-color .2s;} input:focus,textarea:focus{border-color:#e8ff00!important;outline:none;}
        textarea{resize:vertical;}
        .phase-item{border:1px solid #222;margin-bottom:3px;transition:border-color .2s;}
        .phase-item:hover{border-color:rgba(232,255,0,.3);}
        .ph-li::before{content:'▸';position:absolute;left:0;color:#e8ff00;font-size:9px;}
        .log-row:hover{background:#111;}
        .btn-log:hover{opacity:.9;} .btn-log:active{transform:scale(.98);}
        .sync-pulse{animation:pulse .8s infinite;}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.3;}}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:#080808;} ::-webkit-scrollbar-thumb{background:#222;border-radius:2px;}
      `}</style>

      {/* TOAST */}
      {toast && (
        <div style={{position:"fixed",bottom:20,right:20,background:"#111",border:"1px solid #e8ff00",padding:"9px 16px",fontSize:10,fontFamily:"'Roboto Mono',monospace",color:"#e8ff00",letterSpacing:1,zIndex:300,borderRadius:2}}>
          {toast}
        </div>
      )}

      {/* NAV */}
      <nav style={S.nav}>
        <div style={S.navLogo}>
          <div>
            <div style={S.navLogoText}>BODY CUT</div>
            <div style={S.navLogoSub}>2026.05.30 → 08.03</div>
          </div>
        </div>
        <div style={{display:"flex"}}>
          {[["plan","📋 作戰計畫"],["tracker","📊 進度追蹤"]].map(([id,label])=>(
            <button key={id} style={S.navTab(page===id)} onClick={()=>setPage(id)}>
              {label}
              {id==="tracker" && <span style={S.badge}>{entries.length}</span>}
            </button>
          ))}
        </div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",padding:"0 18px",gap:7,fontSize:9,fontFamily:"'Roboto Mono',monospace",color:saving?"#e8ff00":"#555",letterSpacing:2,borderLeft:"1px solid #222"}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:saving?"#e8ff00":"#00ff88"}} className={saving?"sync-pulse":""} />
          {saving ? "同步中..." : `已儲存 · ${entries.length} 筆`}
        </div>
      </nav>

      {/* ══ PAGE: PLAN ══ */}
      {page==="plan" && (
        <div>
          <div style={S.hero}>
            <div style={{position:"absolute",right:-10,top:-20,fontFamily:"'Bebas Neue',sans-serif",fontSize:240,color:"rgba(232,255,0,0.03)",lineHeight:1,pointerEvents:"none"}}>CUT</div>
            <div style={S.heroTag}>▸ INBODY 920 ／ 健身工廠 ／ 2026.05.30 ／ 27歲 男性 172cm</div>
            <h1 style={S.heroH1}>專業<span style={{color:"#e8ff00"}}>減脂</span><br/>作戰計畫</h1>
            <div style={S.heroSub}>TARGET: 83.7KG → 79.1KG ／ BODY FAT: 16.9% → 12.0% ／ DURATION: 9 WEEKS</div>
          </div>

          <div style={S.statsStrip}>
            {[["目前體重","83.7 kg","#f0f0f0"],["目標體重","79.1 kg","#e8ff00"],["需減脂肪","4.6 kg","#ff4d00"],["InBody 評分","92 /100","#00d4ff"],["骨骼肌","39.8 kg","#00ff88"]].map(([l,v,c])=>(
              <div key={l} style={S.statCell}>
                <div style={S.statLbl}>{l}</div>
                <div style={{...S.statVal,color:c}}>{v}</div>
              </div>
            ))}
          </div>

          <div style={S.planBody}>
            <div>
              <div style={S.phasesCol}>
                <div style={S.colTitle}><div style={{width:4,height:24,background:"#e8ff00"}}/>週進度計畫</div>
                <div style={S.colSub}>// 2026.05.30 → 2026.08.03 ／ 9 WEEKS ／ PROFESSIONAL CUT PROTOCOL</div>
                {PHASES.map(p=>(
                  <div key={p.weeks} className="phase-item">
                    <div style={S.phHead}>
                      <div style={S.phNum}>{p.weeks}</div>
                      <div>
                        <div style={{fontSize:9,fontFamily:"'Roboto Mono',monospace",color:"#555",letterSpacing:1,marginBottom:3}}>{p.dates}</div>
                        <div style={{fontSize:13,fontWeight:700,letterSpacing:1,marginBottom:4}}>{p.name}</div>
                        <span style={{display:"inline-block",padding:"2px 8px",fontSize:8,letterSpacing:2,fontFamily:"'Roboto Mono',monospace",border:`1px solid ${p.tagColor}`,color:p.tagColor,textTransform:"uppercase"}}>{p.tag}</span>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,lineHeight:1}}>{p.target}</div>
                        <div style={{fontSize:8,color:"#555",fontFamily:"'Roboto Mono',monospace",letterSpacing:1}}>目標體重 kg</div>
                      </div>
                    </div>
                    <div style={S.phBody}>
                      {[["訓練安排",p.train],["飲食策略",p.diet]].map(([title,items])=>(
                        <div key={title}>
                          <div style={S.phColTitle}>{title}</div>
                          {items.map((item,i)=>(
                            <div key={i} className="ph-li" style={S.phLi}>{item}</div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {/* Progress */}
              <div style={{margin:"0 28px 3px",padding:"13px 17px",background:"#111",border:"1px solid #222"}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:9,fontFamily:"'Roboto Mono',monospace",color:"#555",letterSpacing:1,marginBottom:7}}>
                  <span>83.7 KG START</span><span>9週進度 {overallPct}%</span><span>79.1 KG TARGET</span>
                </div>
                <div style={{height:4,background:"#222"}}>
                  <div style={{height:"100%",background:"linear-gradient(90deg,#ff4d00,#e8ff00)",width:overallPct+"%",transition:"width .6s"}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:5,fontSize:8,fontFamily:"'Roboto Mono',monospace",color:"#333"}}>
                  {["W1 83.7","W2 83.0","W3 82.3","W4 81.6","W5 80.9","W6 80.2","W7 79.7","W8 79.4","W9 79.1"].map(w=><span key={w}>{w}</span>)}
                </div>
              </div>
            </div>

            {/* SIDEBAR */}
            <div style={S.sidebarCol}>
              <div style={S.card()}>
                <div style={S.cardTtl()}>// 熱量攝取策略</div>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:58,lineHeight:1,color:"#e8ff00"}}>2,100</div>
                <div style={{fontSize:11,color:"#555",fontFamily:"'Roboto Mono',monospace",marginBottom:13}}>kcal ／ 主力減脂期日均</div>
                <div style={{padding:"8px 10px",background:"#080808",borderLeft:"3px solid #ff4d00",marginBottom:12}}>
                  <div style={{fontSize:8,fontFamily:"'Roboto Mono',monospace",color:"#555",letterSpacing:2,marginBottom:3}}>基礎代謝率 (BMR)</div>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:"#bbb"}}>1,873 <span style={{fontSize:11,fontFamily:"'Roboto Mono',monospace",color:"#555"}}>kcal</span></div>
                  <div style={{fontSize:9,fontFamily:"'Roboto Mono',monospace",color:"#555",marginTop:2}}>TDEE ≈ 2,913 · 赤字 <span style={{color:"#ff4d00"}}>-810/day</span></div>
                </div>
                {[["PROTEIN 蛋白質","185g","#ff6b6b","35%"],["CARBS 碳水","175g","#e8ff00","33%"],["FAT 脂肪","73g","#00d4ff","32%"]].map(([n,v,c,p])=>(
                  <div key={n} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid #222"}}>
                    <div>
                      <div style={{fontSize:10,color:"#555",fontFamily:"'Roboto Mono',monospace",letterSpacing:1}}>{n}</div>
                      <div style={{height:2,background:"#222",marginTop:3,width:80}}><div style={{height:"100%",background:c,width:p}}/></div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:c,lineHeight:1}}>{v}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{...S.card(),borderColor:"rgba(0,212,255,.2)"}}>
                <div style={S.cardTtl("#00d4ff")}>// REFEED DAY PROTOCOL</div>
                <p style={{fontSize:11,color:"#bbb",lineHeight:1.8}}>每週選一天（訓練最重日子）熱量拉高至 <strong style={{color:"#00d4ff"}}>2,600 kcal</strong>。碳水增加 +300–400g，蛋白質維持，脂肪不增。<strong style={{color:"#00d4ff"}}>回補肌糖原、防代謝適應、穩定瘦素</strong>。</p>
              </div>

              <div style={S.card("#e8ff00")}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:2,marginBottom:11,color:"#e8ff00"}}>選手級黃金準則</div>
                {[["01","蛋白質每公斤 2.2g，每餐至少 35g"],["02","每日水分 3–4L"],["03","睡眠 7–8小時，皮質醇升高掉肌肉"],["04","每週量一次（早晨空腹）"],["05","重訓強度不大幅降低，強度是保肌信號"],["06","每3週身體照片記錄"]].map(([n,t])=>(
                  <div key={n} style={{display:"flex",gap:9,padding:"6px 0",borderBottom:"1px solid #222",fontSize:11,color:"#bbb",lineHeight:1.5}}>
                    <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:17,color:"#e8ff00",lineHeight:1,minWidth:18}}>{n}</div>
                    <div>{t}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{borderTop:"1px solid #222",padding:"12px 28px",display:"flex",justifyContent:"space-between",fontSize:9,fontFamily:"'Roboto Mono',monospace",color:"#333",letterSpacing:2}}>
            <span>INBODY 920 ／ 2026.05.30 ／ 健身工廠</span>
            <span>骨骼肌 <span style={{color:"#e8ff00"}}>39.8 KG</span> ／ 除脂體重 <span style={{color:"#e8ff00"}}>69.6 KG</span></span>
            <span>TARGET <span style={{color:"#e8ff00"}}>2026.08.03</span></span>
          </div>
        </div>
      )}

      {/* ══ PAGE: TRACKER ══ */}
      {page==="tracker" && (
        <div style={S.trackerWrap}>
          {/* LEFT SIDEBAR */}
          <div style={S.trSidebar}>
            <div style={{padding:"18px 20px 12px",borderBottom:"1px solid #222"}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:19,letterSpacing:2,color:"#e8ff00"}}>BODY LOG</div>
              <div style={{fontSize:8,fontFamily:"'Roboto Mono',monospace",color:"#555",letterSpacing:2,marginTop:3}}>Claude 雲端儲存 · 跨裝置同步</div>
            </div>

            {/* Phase */}
            <div style={{padding:"11px 20px",borderBottom:"1px solid #222"}}>
              <div style={{fontSize:8,fontFamily:"'Roboto Mono',monospace",color:"#555",letterSpacing:3,marginBottom:5}}>// 目前階段</div>
              <div style={{fontSize:11,fontWeight:700,color:"#e8ff00",marginBottom:7}}>{currentPhase}</div>
              <div style={{height:3,background:"#222"}}><div style={{height:"100%",background:"linear-gradient(90deg,#ff4d00,#e8ff00)",width:pct+"%",transition:"width .5s"}}/></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:8,fontFamily:"'Roboto Mono',monospace",color:"#555",marginTop:4}}>
                <span>05.30</span><span>{pct}%</span><span>08.03</span>
              </div>
            </div>

            {/* Manual Input */}
            <div style={{padding:"15px 20px",borderBottom:"1px solid #222"}}>
              <div style={{fontSize:8,fontFamily:"'Roboto Mono',monospace",color:"#555",letterSpacing:3,textTransform:"uppercase",marginBottom:10}}>// 手動輸入體重</div>
              <div style={{marginBottom:8}}>
                <label style={S.inpLabel}>日期</label>
                <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={S.input}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:8}}>
                <div>
                  <label style={S.inpLabel}>體重 (kg)</label>
                  <input type="number" value={weight} onChange={e=>setWeight(e.target.value)} step="0.1" min="60" max="120" placeholder="83.7" style={S.input}/>
                </div>
                <div>
                  <label style={S.inpLabel}>體脂率 (%)</label>
                  <input type="number" value={bf} onChange={e=>setBf(e.target.value)} step="0.1" min="5" max="40" placeholder="16.9" style={S.input}/>
                </div>
              </div>
              <div style={{marginBottom:8}}>
                <label style={S.inpLabel}>備註</label>
                <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="腿日、睡很好…" style={{...S.input,minHeight:44,fontSize:11}}/>
              </div>
              <button className="btn-log" onClick={addEntry} style={S.btnPrimary}>＋ 記錄</button>
            </div>

            {/* InBody Upload */}
            <div style={{padding:"15px 20px",borderBottom:"1px solid #222"}}>
              <div style={{fontSize:8,fontFamily:"'Roboto Mono',monospace",color:"#555",letterSpacing:3,textTransform:"uppercase",marginBottom:10}}>// 上傳 InBody 報告</div>
              <div
                onClick={()=>fileRef.current?.click()}
                style={{border:"1px dashed #222",padding:14,textAlign:"center",cursor:"pointer",borderRadius:2,transition:"border-color .2s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="#00d4ff"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="#222"}
              >
                <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
                <div style={{fontSize:20,marginBottom:5}}>📊</div>
                <div style={{fontSize:9,color:imgB64?"#00ff88":"#888",fontFamily:"'Roboto Mono',monospace",letterSpacing:1}}>
                  {imgB64 ? `✓ ${imgName}` : <span>拖曳或點擊上傳<br/><strong style={{color:"#00d4ff"}}>InBody 報告照片</strong></span>}
                </div>
              </div>
              <button onClick={analyzeInBody} disabled={!imgB64||analyzing} style={{...S.btnSecondary,marginTop:7,opacity:(!imgB64||analyzing)?.4:1}}>
                {analyzing?"⏳ 解析中...":"⚡ AI 解析 InBody"}
              </button>
              {aiResult && (
                <div style={{marginTop:8,padding:10,background:"rgba(0,212,255,.05)",border:"1px solid rgba(0,212,255,.2)",borderRadius:2,fontSize:10,fontFamily:"'Roboto Mono',monospace",color:"#bbb",lineHeight:1.7}}>
                  <div style={{color:"#00d4ff",fontSize:8,letterSpacing:3,marginBottom:7}}>// AI 解析結果</div>
                  {aiResult.date && <div>📅 {aiResult.date}</div>}
                  {aiResult.weight && <div>⚖️ 體重：<strong style={{color:"#e8ff00"}}>{aiResult.weight} kg</strong></div>}
                  {aiResult.bodyFat && <div>📊 體脂：<strong style={{color:"#00d4ff"}}>{aiResult.bodyFat}%</strong></div>}
                  {aiResult.muscleMass && <div>💪 骨骼肌：<strong style={{color:"#ff6b6b"}}>{aiResult.muscleMass} kg</strong></div>}
                  <button onClick={importAi} style={{marginTop:7,width:"100%",padding:6,background:"#00d4ff",color:"#000",border:"none",fontFamily:"'Bebas Neue',sans-serif",fontSize:13,letterSpacing:2,cursor:"pointer",borderRadius:2}}>✓ 匯入此數據</button>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div style={{padding:"11px 20px",marginTop:"auto",borderTop:"1px solid #222",display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
              {[["記錄天數",entries.length,"#e8ff00"],["已減 kg",lost.toFixed(1),"#00ff88"],["還差 kg",remaining>0?remaining.toFixed(1):"0.0","#ff4d00"],["剩餘天數",daysLeft,"#00d4ff"]].map(([l,v,c])=>(
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,lineHeight:1,color:c}}>{v}</div>
                  <div style={{fontSize:8,fontFamily:"'Roboto Mono',monospace",color:"#555",letterSpacing:2,marginTop:1}}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* MAIN */}
          <div style={{overflow:"auto"}}>
            <div style={{padding:"18px 22px 11px",borderBottom:"1px solid #222",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2}}>進度追蹤</h2>
              <div style={{display:"flex",gap:3}}>
                {[["chart","圖表"],["log","記錄"]].map(([id,label])=>(
                  <button key={id} onClick={()=>setTab(id)} style={{padding:"5px 13px",fontSize:9,fontFamily:"'Roboto Mono',monospace",letterSpacing:2,cursor:"pointer",border:`1px solid ${tab===id?"#e8ff00":"#222"}`,color:tab===id?"#e8ff00":"#888",background:tab===id?"rgba(232,255,0,.04)":"transparent",borderRadius:2}}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Cards */}
            <div style={S.tcRow}>
              {[["起始體重","83.7 kg","#ff4d00","2026.05.30"],["目前體重",latest?`${latest.weight} kg`:"—","#e8ff00",latest?.date||"尚無記錄"],["目標體重","79.1 kg","#00ff88","體脂 12%"],["目前體脂",latest?.bf?`${latest.bf}%`:"—","#00d4ff","目標 12.0%"]].map(([l,v,c,s])=>(
                <div key={l} style={S.tc}>
                  <div style={{fontSize:8,fontFamily:"'Roboto Mono',monospace",color:"#555",letterSpacing:2,marginBottom:4}}>{l}</div>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,lineHeight:1,color:c}}>{v}</div>
                  <div style={{fontSize:8,color:"#555",fontFamily:"'Roboto Mono',monospace",marginTop:2}}>{s}</div>
                </div>
              ))}
            </div>

            {/* Chart Tab */}
            {tab==="chart" && (
              <div style={{padding:"13px 22px"}}>
                <div style={{background:"#111",border:"1px solid #222",padding:17,borderRadius:2}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
                    <div style={{fontSize:9,fontFamily:"'Roboto Mono',monospace",color:"#555",letterSpacing:3}}>// 體重趨勢 (KG)</div>
                    <div style={{display:"flex",gap:12,fontSize:9,fontFamily:"'Roboto Mono',monospace",color:"#555"}}>
                      {[["#e8ff00","實際"],["#555","目標"],["#00d4ff","InBody"]].map(([c,l])=>(
                        <span key={l}><span style={{display:"inline-block",width:6,height:6,borderRadius:"50%",background:c,marginRight:4}}/>{l}</span>
                      ))}
                    </div>
                  </div>
                  <WeightChart entries={entries}/>
                </div>
              </div>
            )}

            {/* Log Tab */}
            {tab==="log" && (
              <div style={{padding:"0 22px 22px"}}>
                <div style={{display:"grid",gridTemplateColumns:"100px 78px 68px 68px 1fr 68px",gap:6,padding:"9px 11px",fontSize:8,fontFamily:"'Roboto Mono',monospace",color:"#555",letterSpacing:2,borderBottom:"1px solid #222",textTransform:"uppercase"}}>
                  {["日期","體重","變化","體脂%","備註","來源"].map(h=><span key={h}>{h}</span>)}
                </div>
                {entries.length===0 ? (
                  <div style={{padding:"48px 22px",textAlign:"center",color:"#555",fontFamily:"'Roboto Mono',monospace",fontSize:10,letterSpacing:2}}>
                    <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:56,color:"#222",marginBottom:9}}>0</div>
                    <div>尚無記錄<br/>從左側輸入開始追蹤</div>
                  </div>
                ) : [...entries].reverse().map((e,i,arr)=>{
                  const prev=arr[i+1];
                  let delta="—",color="#555";
                  if(prev){const d=+(e.weight-prev.weight).toFixed(1);if(d>0){delta="+"+d;color="#ff4d4d";}else if(d<0){delta=""+d;color="#00ff88";}else{delta="±0";}}
                  return (
                    <div key={e.ts} className="log-row" style={{display:"grid",gridTemplateColumns:"100px 78px 68px 68px 1fr 68px",gap:6,padding:"9px 11px",borderBottom:"1px solid #222",fontSize:11,fontFamily:"'Roboto Mono',monospace",alignItems:"center",transition:"background .15s"}}>
                      <span style={{color:"#888",fontSize:10}}>{e.date}</span>
                      <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,lineHeight:1}}>{e.weight}</span>
                      <span style={{color,fontSize:10}}>{delta}</span>
                      <span style={{color:"#e8ff00"}}>{e.bf?e.bf+"%":"—"}</span>
                      <span style={{color:"#888",fontSize:10,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.note||"—"}</span>
                      <span style={{fontSize:8,padding:"2px 6px",border:`1px solid ${e.source==="inbody"?"#00d4ff":"#555"}`,color:e.source==="inbody"?"#00d4ff":"#555",borderRadius:20,textAlign:"center"}}>{e.source==="inbody"?"InBody":"手動"}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
