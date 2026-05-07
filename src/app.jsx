import { useState, useEffect } from "react";

const ESTADOS_3D = ["Pendiente", "Imprimiendo", "Listo", "Entregado"];
const ESTADOS_AGENCIA = ["Por hacer", "En proceso", "Revisión", "Completado"];
const PRIORIDADES = ["Alta", "Media", "Baja"];
const MATERIALES = ["PLA", "PETG", "ABS", "TPU", "Resina", "Otro"];
const TIPOS_TAREA = ["Redes", "Diseño", "Reporte", "Contenido", "Reunión", "Otro"];

const COLORES_ESTADO_3D = {
  "Pendiente": "#f59e0b", "Imprimiendo": "#3b82f6",
  "Listo": "#10b981", "Entregado": "#6b7280",
};
const COLORES_ESTADO_AG = {
  "Por hacer": "#f59e0b", "En proceso": "#3b82f6",
  "Revisión": "#a855f7", "Completado": "#6b7280",
};
const COLORES_PRIORIDAD = { Alta: "#ef4444", Media: "#f59e0b", Baja: "#10b981" };
const TIPO_COLORS = { Redes: "#06b6d4", Diseño: "#f59e0b", Reporte: "#10b981", Contenido: "#a855f7", Reunión: "#3b82f6", Otro: "#64748b" };

const INITIAL_PEDIDOS = [
  { id: 1, cliente: "Martín G.", pieza: "Soporte para celular", material: "PLA", color: "#ff6b35", estado: "Imprimiendo", prioridad: "Alta", fecha: "2026-05-08", nota: "Escala 1:1" },
  { id: 2, cliente: "Laura V.", pieza: "Figura decorativa", material: "PETG", color: "#a78bfa", estado: "Pendiente", prioridad: "Media", fecha: "2026-05-10", nota: "" },
];
const INITIAL_TAREAS = [
  { id: 1, titulo: "Redactar post para cliente X", cliente: "Agencia Norte", tipo: "Redes", estado: "En proceso", prioridad: "Alta", fecha: "2026-05-07", nota: "Instagram + LinkedIn" },
  { id: 2, titulo: "Informe mensual de métricas", cliente: "Agencia Norte", tipo: "Reporte", estado: "Por hacer", prioridad: "Media", fecha: "2026-05-09", nota: "" },
];

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}

const btnBase = {
  border: "none", borderRadius: 8, padding: "8px 18px",
  fontWeight: 700, cursor: "pointer", fontSize: 13,
  fontFamily: "'DM Mono', monospace",
};
const inputStyle = {
  width: "100%", background: "#0d0d1f", border: "1px solid #2a2a4a",
  borderRadius: 8, color: "#e2e8f0", padding: "9px 12px", fontSize: 13,
  outline: "none", boxSizing: "border-box", fontFamily: "'DM Mono', monospace",
};

function Badge({ label, color }) {
  return (
    <span style={{
      background: color + "22", color, border: `1px solid ${color}44`,
      borderRadius: 6, padding: "2px 9px", fontSize: 11, fontWeight: 700,
      letterSpacing: 0.4, whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 13 }}>
      <label style={{ display: "block", fontSize: 10, color: "#666", marginBottom: 4, fontWeight: 700, letterSpacing: 1 }}>{label}</label>
      {children}
    </div>
  );
}

function Input({ label, as, children, ...props }) {
  const el = as === "select"
    ? <select {...props} style={inputStyle}>{children}</select>
    : as === "textarea"
    ? <textarea {...props} style={{ ...inputStyle, resize: "vertical", minHeight: 58 }} />
    : <input {...props} style={inputStyle} />;
  return <Field label={label}>{el}</Field>;
}

function Modal({ title, accent, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(5,5,15,0.85)",
      backdropFilter: "blur(6px)", zIndex: 200,
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }} onClick={onClose}>
      <div style={{
        background: "#13132a", borderTop: `2px solid ${accent}`,
        borderRadius: "20px 20px 0 0", padding: "24px 20px 36px",
        width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 -8px 48px #0009",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontWeight: 800, fontSize: 16, color: "#e2e8f0", fontFamily: "'Syne', sans-serif" }}>{title}</span>
          <button onClick={onClose} style={{ background: "#1e1e3a", border: "none", color: "#aaa", fontSize: 16, cursor: "pointer", borderRadius: 8, width: 32, height: 32 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Form3D({ initial, onSave, onClose }) {
  const blank = { cliente: "", pieza: "", material: "PLA", color: "#ff6b35", estado: "Pendiente", prioridad: "Media", fecha: "", nota: "" };
  const [d, setD] = useState(initial ? { ...blank, ...initial } : blank);
  const set = (k, v) => setD(p => ({ ...p, [k]: v }));
  const valid = d.cliente.trim() && d.pieza.trim();
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
        <Input label="CLIENTE" value={d.cliente} onChange={e => set("cliente", e.target.value)} placeholder="Nombre del cliente" />
        <Input label="PIEZA / MODELO" value={d.pieza} onChange={e => set("pieza", e.target.value)} placeholder="¿Qué se imprime?" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 72px", gap: "0 12px" }}>
        <Input label="MATERIAL" as="select" value={d.material} onChange={e => set("material", e.target.value)}>
          {MATERIALES.map(m => <option key={m}>{m}</option>)}
        </Input>
        <Input label="PRIORIDAD" as="select" value={d.prioridad} onChange={e => set("prioridad", e.target.value)}>
          {PRIORIDADES.map(p => <option key={p}>{p}</option>)}
        </Input>
        <Field label="COLOR">
          <input type="color" value={d.color} onChange={e => set("color", e.target.value)}
            style={{ width: "100%", height: 38, background: "#0d0d1f", border: "1px solid #2a2a4a", borderRadius: 8, cursor: "pointer", padding: 3 }} />
        </Field>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
        <Input label="ESTADO" as="select" value={d.estado} onChange={e => set("estado", e.target.value)}>
          {ESTADOS_3D.map(s => <option key={s}>{s}</option>)}
        </Input>
        <Input label="FECHA ENTREGA" type="date" value={d.fecha} onChange={e => set("fecha", e.target.value)} />
      </div>
      <Input label="NOTAS" as="textarea" value={d.nota} onChange={e => set("nota", e.target.value)} placeholder="Detalles adicionales..." />
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
        <button onClick={onClose} style={{ ...btnBase, background: "#1e1e3a", color: "#aaa" }}>Cancelar</button>
        <button onClick={() => { if (valid) { onSave(d); onClose(); } }}
          style={{ ...btnBase, background: valid ? "#ff6b35" : "#333", color: valid ? "#fff" : "#666" }}>Guardar</button>
      </div>
    </div>
  );
}

function FormAgencia({ initial, onSave, onClose }) {
  const blank = { titulo: "", cliente: "", tipo: "Redes", estado: "Por hacer", prioridad: "Media", fecha: "", nota: "" };
  const [d, setD] = useState(initial ? { ...blank, ...initial } : blank);
  const set = (k, v) => setD(p => ({ ...p, [k]: v }));
  const valid = d.titulo.trim();
  return (
    <div>
      <Input label="TÍTULO DE LA TAREA" value={d.titulo} onChange={e => set("titulo", e.target.value)} placeholder="¿Qué hay que hacer?" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
        <Input label="CLIENTE / CUENTA" value={d.cliente} onChange={e => set("cliente", e.target.value)} placeholder="Cliente" />
        <Input label="TIPO" as="select" value={d.tipo} onChange={e => set("tipo", e.target.value)}>
          {TIPOS_TAREA.map(t => <option key={t}>{t}</option>)}
        </Input>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 12px" }}>
        <Input label="ESTADO" as="select" value={d.estado} onChange={e => set("estado", e.target.value)}>
          {ESTADOS_AGENCIA.map(s => <option key={s}>{s}</option>)}
        </Input>
        <Input label="PRIORIDAD" as="select" value={d.prioridad} onChange={e => set("prioridad", e.target.value)}>
          {PRIORIDADES.map(p => <option key={p}>{p}</option>)}
        </Input>
        <Input label="FECHA LÍMITE" type="date" value={d.fecha} onChange={e => set("fecha", e.target.value)} />
      </div>
      <Input label="NOTAS" as="textarea" value={d.nota} onChange={e => set("nota", e.target.value)} placeholder="Contexto o detalles..." />
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
        <button onClick={onClose} style={{ ...btnBase, background: "#1e1e3a", color: "#aaa" }}>Cancelar</button>
        <button onClick={() => { if (valid) { onSave(d); onClose(); } }}
          style={{ ...btnBase, background: valid ? "#a855f7" : "#333", color: valid ? "#fff" : "#666" }}>Guardar</button>
      </div>
    </div>
  );
}

function Card3D({ p, onEdit, onDelete, onNext }) {
  const color = COLORES_ESTADO_3D[p.estado];
  const idx = ESTADOS_3D.indexOf(p.estado);
  return (
    <div style={{
      background: "#13132a", border: `1px solid ${color}2a`,
      borderRadius: 14, padding: "14px 14px 12px", marginBottom: 10,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: color, borderRadius: "14px 0 0 14px" }} />
      <div style={{ paddingLeft: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#e2e8f0", fontFamily: "'Syne', sans-serif", lineHeight: 1.2 }}>{p.pieza}</div>
            <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{p.cliente}</div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: p.color, border: "2px solid #2a2a4a" }} />
            <Badge label={p.prioridad} color={COLORES_PRIORIDAD[p.prioridad]} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: p.nota ? 8 : 10 }}>
          <Badge label={p.material} color="#64748b" />
          <Badge label={p.estado} color={color} />
          {p.fecha && <span style={{ fontSize: 11, color: "#555" }}>📅 {p.fecha}</span>}
        </div>
        {p.nota && <div style={{ fontSize: 11, color: "#555", marginBottom: 10, fontStyle: "italic", lineHeight: 1.4 }}>{p.nota}</div>}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            {idx < ESTADOS_3D.length - 1 && (
              <button onClick={() => onNext(p.id)} style={{ ...btnBase, background: color + "20", color, padding: "4px 12px", fontSize: 11 }}>
                → {ESTADOS_3D[idx + 1]}
              </button>
            )}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => onEdit(p)} style={{ ...btnBase, background: "#1e1e3a", color: "#aaa", padding: "5px 11px", fontSize: 12 }}>✏️</button>
            <button onClick={() => onDelete(p.id)} style={{ ...btnBase, background: "#1e0a0a", color: "#ef4444", padding: "5px 11px", fontSize: 12 }}>✕</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardAgencia({ t, onEdit, onDelete, onNext }) {
  const color = COLORES_ESTADO_AG[t.estado];
  const idx = ESTADOS_AGENCIA.indexOf(t.estado);
  return (
    <div style={{
      background: "#13132a", border: `1px solid ${color}2a`,
      borderRadius: 14, padding: "14px 14px 12px", marginBottom: 10,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: color, borderRadius: "14px 0 0 14px" }} />
      <div style={{ paddingLeft: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#e2e8f0", fontFamily: "'Syne', sans-serif", lineHeight: 1.2 }}>{t.titulo}</div>
            <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{t.cliente}</div>
          </div>
          <Badge label={t.prioridad} color={COLORES_PRIORIDAD[t.prioridad]} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: t.nota ? 8 : 10 }}>
          <Badge label={t.tipo} color={TIPO_COLORS[t.tipo] || "#64748b"} />
          <Badge label={t.estado} color={color} />
          {t.fecha && <span style={{ fontSize: 11, color: "#555" }}>📅 {t.fecha}</span>}
        </div>
        {t.nota && <div style={{ fontSize: 11, color: "#555", marginBottom: 10, fontStyle: "italic", lineHeight: 1.4 }}>{t.nota}</div>}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            {idx < ESTADOS_AGENCIA.length - 1 && (
              <button onClick={() => onNext(t.id)} style={{ ...btnBase, background: color + "20", color, padding: "4px 12px", fontSize: 11 }}>
                → {ESTADOS_AGENCIA[idx + 1]}
              </button>
            )}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => onEdit(t)} style={{ ...btnBase, background: "#1e1e3a", color: "#aaa", padding: "5px 11px", fontSize: 12 }}>✏️</button>
            <button onClick={() => onDelete(t.id)} style={{ ...btnBase, background: "#1e0a0a", color: "#ef4444", padding: "5px 11px", fontSize: 12 }}>✕</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("3d");
  const [pedidos, setPedidos] = useLocalStorage("gestor_pedidos", INITIAL_PEDIDOS);
  const [tareas, setTareas] = useLocalStorage("gestor_tareas", INITIAL_TAREAS);
  const [modal, setModal] = useState(null);
  const [filtro, setFiltro] = useState("Todos");

  const savePedido = (d) => {
    if (modal?.item) setPedidos(ps => ps.map(p => p.id === modal.item.id ? { ...p, ...d } : p));
    else setPedidos(ps => [...ps, { ...d, id: Date.now() }]);
  };
  const deletePedido = (id) => { if (confirm("¿Eliminar este pedido?")) setPedidos(ps => ps.filter(p => p.id !== id)); };
  const nextPedido = (id) => setPedidos(ps => ps.map(p => {
    if (p.id !== id) return p;
    const idx = ESTADOS_3D.indexOf(p.estado);
    return idx < ESTADOS_3D.length - 1 ? { ...p, estado: ESTADOS_3D[idx + 1] } : p;
  }));

  const saveTarea = (d) => {
    if (modal?.item) setTareas(ts => ts.map(t => t.id === modal.item.id ? { ...t, ...d } : t));
    else setTareas(ts => [...ts, { ...d, id: Date.now() }]);
  };
  const deleteTarea = (id) => { if (confirm("¿Eliminar esta tarea?")) setTareas(ts => ts.filter(t => t.id !== id)); };
  const nextTarea = (id) => setTareas(ts => ts.map(t => {
    if (t.id !== id) return t;
    const idx = ESTADOS_AGENCIA.indexOf(t.estado);
    return idx < ESTADOS_AGENCIA.length - 1 ? { ...t, estado: ESTADOS_AGENCIA[idx + 1] } : t;
  }));

  const estados = tab === "3d" ? ESTADOS_3D : ESTADOS_AGENCIA;
  const coloresEstado = tab === "3d" ? COLORES_ESTADO_3D : COLORES_ESTADO_AG;
  const items = tab === "3d" ? pedidos : tareas;
  const filtrados = filtro === "Todos" ? items : items.filter(i => i.estado === filtro);
  const accent = tab === "3d" ? "#ff6b35" : "#a855f7";

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a18", display: "flex", flexDirection: "column" }}>
      <div style={{ borderBottom: "1px solid #1a1a2e", padding: "env(safe-area-inset-top, 12px) 20px 0", position: "sticky", top: 0, background: "#0a0a18", zIndex: 10 }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, paddingBottom: 16 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", fontFamily: "'Syne', sans-serif", letterSpacing: -0.5 }}>
                {tab === "3d" ? "🖨️ Pedidos 3D" : "📢 Agencia"}
              </div>
              <div style={{ fontSize: 10, color: "#444", letterSpacing: 1.5, fontWeight: 600, marginTop: 1 }}>GESTOR DE TRABAJO</div>
            </div>
            <button onClick={() => setModal({ type: tab, item: null })} style={{
              ...btnBase, background: accent, color: "#fff", padding: "9px 16px",
              boxShadow: `0 4px 16px ${accent}44`,
            }}>+ {tab === "3d" ? "Pedido" : "Tarea"}</button>
          </div>
          <div style={{ display: "flex" }}>
            {[["3d", "🖨️ Impresión 3D", "#ff6b35"], ["agencia", "📢 Agencia", "#a855f7"]].map(([key, label, c]) => (
              <button key={key} onClick={() => { setTab(key); setFiltro("Todos"); }} style={{
                flex: 1, background: "none", border: "none",
                borderBottom: tab === key ? `2px solid ${c}` : "2px solid transparent",
                color: tab === key ? c : "#444",
                padding: "10px 0", fontWeight: 800, cursor: "pointer",
                fontSize: 12, letterSpacing: 0.5, fontFamily: "'DM Mono', monospace",
              }}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: 600, margin: "0 auto", width: "100%", padding: "16px 16px 32px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          <button onClick={() => setFiltro("Todos")} style={{
            ...btnBase, padding: "6px 12px", fontSize: 11,
            background: filtro === "Todos" ? "#1e1e3a" : "transparent",
            color: filtro === "Todos" ? "#e2e8f0" : "#555",
            border: `1px solid ${filtro === "Todos" ? "#3a3a5a" : "#1a1a2e"}`,
          }}>Todos ({items.length})</button>
          {estados.map(e => {
            const count = items.filter(i => i.estado === e).length;
            const c = coloresEstado[e];
            const active = filtro === e;
            return (
              <button key={e} onClick={() => setFiltro(active ? "Todos" : e)} style={{
                ...btnBase, padding: "6px 12px", fontSize: 11,
                background: active ? c + "25" : "transparent",
                color: active ? c : "#555",
                border: `1px solid ${active ? c + "55" : "#1a1a2e"}`,
              }}>{e} ({count})</button>
            );
          })}
        </div>

        {filtrados.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{tab === "3d" ? "🖨️" : "📢"}</div>
            <div style={{ fontSize: 13, color: "#333" }}>
              No hay {tab === "3d" ? "pedidos" : "tareas"} {filtro !== "Todos" ? `en "${filtro}"` : "todavía"}
            </div>
          </div>
        ) : tab === "3d"
          ? filtrados.map(p => <Card3D key={p.id} p={p} onEdit={item => setModal({ type: "3d", item })} onDelete={deletePedido} onNext={nextPedido} />)
          : filtrados.map(t => <CardAgencia key={t.id} t={t} onEdit={item => setModal({ type: "agencia", item })} onDelete={deleteTarea} onNext={nextTarea} />)
        }
      </div>

      {modal?.type === "3d" && (
        <Modal title={modal.item ? "Editar pedido" : "Nuevo pedido 3D"} accent="#ff6b35" onClose={() => setModal(null)}>
          <Form3D initial={modal.item} onSave={savePedido} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === "agencia" && (
        <Modal title={modal.item ? "Editar tarea" : "Nueva tarea de agencia"} accent="#a855f7" onClose={() => setModal(null)}>
          <FormAgencia initial={modal.item} onSave={saveTarea} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}
