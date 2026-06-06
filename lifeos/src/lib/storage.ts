"use client";

import { useMemo, useEffect, useState } from "react";

// Chaves para cada módulo no localStorage
export const STORAGE_KEYS = {
  FACULDADE: "lifeos_faculdade_data",
  CASA: "lifeos_casa_data",
  CARDAPIO: "lifeos_cardapio_data",
  METAS: "lifeos_metas_data",
  BIBLIOTECA: "lifeos_biblioteca_data",
  MIDIA: "lifeos_midia_data",
  ESTUDOS: "lifeos_estudos_data",
  IDEIAS: "lifeos_ideias_data",
  DASHBOARD_EVENTS: "lifeos_dashboard_events",
};

function loadFromLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const saved = window.localStorage.getItem(key);
  if (!saved) return fallback;
  try {
    return JSON.parse(saved) as T;
  } catch {
    return fallback;
  }
}

export function usePersistedData<T>(key: string, initialValue: T) {
  const initial = useMemo(() => loadFromLocalStorage<T>(key, initialValue), [key, initialValue]);
  const [data, setData] = useState<T>(initial);

  // Salvar dados sempre que mudarem
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, JSON.stringify(data));
  }, [data, key]);

  const addItem = (item: unknown) => {
    // Só funciona para listas (array). Se não for, mantém o comportamento seguro.
    setData((prev) => {
      if (Array.isArray(prev)) {
        return ([item, ...prev] as unknown) as T;
      }
      return prev;
    });
  };

  return { data, setData, addItem };
}

// Função utilitária para adicionar dados de fora (ex: do Assistente)
export function saveDataToModule(moduleName: string, itemTitle: string) {
  const keyMap: Record<string, string> = {
    Faculdade: STORAGE_KEYS.FACULDADE,
    Casa: STORAGE_KEYS.CASA,
    Cardapio: STORAGE_KEYS.CARDAPIO,
    Metas: STORAGE_KEYS.METAS,
    Biblioteca: STORAGE_KEYS.BIBLIOTECA,
    "Filmes & Series": STORAGE_KEYS.MIDIA,
    Estudos: STORAGE_KEYS.ESTUDOS,
    Ideias: STORAGE_KEYS.IDEIAS,
    Geral: STORAGE_KEYS.FACULDADE,
  };

  const key = keyMap[moduleName] || STORAGE_KEYS.FACULDADE;
  const currentData = loadFromLocalStorage<unknown[]>(key, []);

  const newItem = {
    id: crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
    title: itemTitle,
    date: new Date().toLocaleDateString("pt-BR"),
  };

  window.localStorage.setItem(key, JSON.stringify([newItem, ...currentData]));
  return newItem;
}
