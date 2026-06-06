"use client";

import { useState, useEffect } from 'react';

// Chaves para cada módulo no localStorage
export const STORAGE_KEYS = {
  FACULDADE: 'lifeos_faculdade_data',
  CASA: 'lifeos_casa_data',
  CARDAPIO: 'lifeos_cardapio_data',
  METAS: 'lifeos_metas_data',
  DASHBOARD_EVENTS: 'lifeos_dashboard_events'
};

export function usePersistedData<T>(key: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar dados do localStorage", e);
      }
    }
    setIsLoaded(true);
  }, [key]);

  // Salvar dados sempre que mudarem
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }, [data, key, isLoaded]);

  const addItem = (item: any) => {
    setData((prev: any) => [item, ...prev]);
  };

  return { data, setData, addItem, isLoaded };
}

// Função utilitária para adicionar dados de fora (ex: do Assistente)
export function saveDataToModule(moduleName: string, itemTitle: string) {
  const keyMap: Record<string, string> = {
    'Faculdade': STORAGE_KEYS.FACULDADE,
    'Casa': STORAGE_KEYS.CASA,
    'Cardápio': STORAGE_KEYS.CARDAPIO,
    'Metas': STORAGE_KEYS.METAS,
    'Geral': STORAGE_KEYS.FACULDADE // Fallback para faculdade se for geral
  };

  const key = keyMap[moduleName] || STORAGE_KEYS.FACULDADE;
  const saved = localStorage.getItem(key);
  let currentData = [];
  
  if (saved) {
    try {
      currentData = JSON.parse(saved);
    } catch (e) {}
  }

  const newItem = {
    id: Math.random().toString(36).substring(7),
    title: itemTitle,
    date: new Date().toLocaleDateString('pt-BR'),
  };

  localStorage.setItem(key, JSON.stringify([newItem, ...currentData]));
  return newItem;
}
