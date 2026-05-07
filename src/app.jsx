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
  fontWeight: 700, cursor: "point
