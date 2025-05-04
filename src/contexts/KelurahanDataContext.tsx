import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface KelurahanFeature {
  type: string;
  properties: Record<string, any>;
  geometry: any;
}

interface KelurahanDataContextType {
  kelurahanFeatures: KelurahanFeature[];
  loading: boolean;
  error: string | null;
}

const KelurahanDataContext = createContext<KelurahanDataContextType>({
  kelurahanFeatures: [],
  loading: true,
  error: null,
});

export const useKelurahanData = () => useContext(KelurahanDataContext);

export const KelurahanDataProvider = ({ children }: { children: ReactNode }) => {
  const [kelurahanFeatures, setKelurahanFeatures] = useState<KelurahanFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data-map/kelurahan.geojson')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch kelurahan.geojson');
        return res.json();
      })
      .then(data => {
        setKelurahanFeatures(data.features);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  return (
    <KelurahanDataContext.Provider value={{ kelurahanFeatures, loading, error }}>
      {children}
    </KelurahanDataContext.Provider>
  );
};
