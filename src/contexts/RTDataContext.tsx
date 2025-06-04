
import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { RTFeature } from '@/components/map/types';

interface RTDataContextType {
  rtFeatures: RTFeature[];
  loading: boolean;
  error: string | null;
  loadRTData: () => void;
}

const RTDataContext = createContext<RTDataContextType>({
  rtFeatures: [],
  loading: false,
  error: null,
  loadRTData: () => {},
});

export const useRTData = () => useContext(RTDataContext);

export const RTDataProvider = ({ children }: { children: ReactNode }) => {
  const [rtFeatures, setRTFeatures] = useState<RTFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef(false);
  const loadingRef = useRef(false);

  const loadRTData = () => {
    if (loadedRef.current || loadingRef.current) return;
    setLoading(true);
    loadingRef.current = true;

    fetch('/data-map/BATAS_RT_AR.geojson')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch BATAS_RT_AR.geojson');
        return res.json();
      })
      .then(data => {
        setRTFeatures(data.features as RTFeature[]);
        setLoading(false);
        loadedRef.current = true;
        loadingRef.current = false;
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
        loadingRef.current = false;
      });
  };

  return (
    <RTDataContext.Provider value={{ rtFeatures, loading, error, loadRTData }}>
      {children}
    </RTDataContext.Provider>
  );
};
