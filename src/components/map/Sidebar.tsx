import React, { useState, useEffect } from 'react';
import './Sidebar.css';

interface SidebarProps {
  kecamatanList: string[];
  kelurahanList: string[];
  rtList: string[];
  selectedKecamatan: string | null;
  selectedKelurahan: string | null;
  selectedRT: string | null;
  onKecamatanChange: (v: string) => void;
  onKelurahanChange: (v: string) => void;
  onRTChange: (v: string) => void;
  onResetFilters: () => void;
  batasRTLayerActive: boolean;
  loading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  kecamatanList,
  kelurahanList,
  rtList,
  selectedKecamatan,
  selectedKelurahan,
  selectedRT,
  onKecamatanChange,
  onKelurahanChange,
  onRTChange,
  onResetFilters,
  batasRTLayerActive,
  loading,
}) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <>
      {/* Tombol toggle sidebar dengan arrow kanan/kiri dan warna adaptif mode gelap/terang */}
      <button
        className={`sidebar-toggle${collapsed ? ' collapsed' : ''}`}
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Buka filter' : 'Tutup filter'}
        aria-label={collapsed ? 'Buka filter' : 'Tutup filter'}
      >
        {/* Ikon panah kanan/kiri, warna adaptif */}
        <svg
          width="22" height="22" viewBox="0 0 24 24" fill="none"
          style={{
            display: 'block',
            transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.2s',
            color: 'var(--sidebar-toggle-fg)',
            backgroundColor: 'var(--sidebar-toggle-bg)'
          }}
        >
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {/* Sidebar hanya muncul jika tidak collapsed */}
      {!collapsed && (
        <div className="sidebar-container">
          {loading ? (
            <div className="sidebar-loading">Memuat data…</div>
          ) : (
            <div className="sidebar-content">
              <h3>Filter Data</h3>
              <div className="sidebar-filter">
                <label>Kecamatan</label>
                <select value={selectedKecamatan || ''} onChange={e => onKecamatanChange(e.target.value)}>
                  <option value="">Semua</option>
                  {kecamatanList.map((kec, i) => (
                    <option key={i} value={kec}>{kec}</option>
                  ))}
                </select>
                <label>Kelurahan</label>
                <select value={selectedKelurahan || ''} onChange={e => onKelurahanChange(e.target.value)}>
                  <option value="">Semua</option>
                  {kelurahanList.map((kel, i) => (
                    <option key={i} value={kel}>{kel}</option>
                  ))}
                </select>
                {batasRTLayerActive ? (
                  <>
                    <label>RT</label>
                    <select value={selectedRT || ''} onChange={e => onRTChange(e.target.value)}>
                      <option value="">Semua</option>
                      {rtList.map((rt, i) => (
                        <option key={i} value={rt}>{rt}</option>
                      ))}
                    </select>
                  </>
                ) : (
                  <div className="sidebar-rt-disabled">Layer Batas RT tidak aktif</div>
                )}
                <button 
                  className="sidebar-reset-button"
                  onClick={onResetFilters}
                  disabled={!selectedKecamatan && !selectedKelurahan && !selectedRT}
                >
                  Reset Filter
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Sidebar;
