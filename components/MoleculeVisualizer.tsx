import React, { useEffect, useRef, useState, useCallback } from 'react';

declare global {
  interface Window { $3Dmol: any; }
}

interface MoleculeVisualizerProps {
  smiles?: string;
  name: string;
  cid?: string | number;
}

type ModelStyle = 'stick' | 'sphere' | 'ballAndStick';

const MoleculeVisualizer: React.FC<MoleculeVisualizerProps> = ({ smiles, name, cid }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [style, setStyle] = useState<ModelStyle>('ballAndStick');
  const [showLabels, setShowLabels] = useState(false);
  const [showSurface, setShowSurface] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isRotating, setIsRotating] = useState(true);

  // Görünüm stilini güncelleyen fonksiyon
  const updateStyle = useCallback(() => {
    if (!viewerRef.current || !window.$3Dmol) return;
    const v = viewerRef.current;
    
    try {
      v.removeAllLabels();
      v.removeAllSurfaces();
      
      // Stil nesnesini oluştur
      const styleObj: any = {};
      if (style === 'stick') {
        styleObj.stick = { radius: 0.2, colorscheme: 'Jmol' };
      } else if (style === 'sphere') {
        styleObj.sphere = { scale: 0.3, colorscheme: 'Jmol' };
      } else if (style === 'ballAndStick') {
        // Hibrit görünüm: Hem çubuk hem küre stillerini birleştirir
        styleObj.stick = { radius: 0.15, colorscheme: 'Jmol' };
        styleObj.sphere = { scale: 0.3, colorscheme: 'Jmol' };
      }

      v.setStyle({}, styleObj);

      if (showLabels) {
        const models = v.getModels();
        models.forEach((model: any) => {
          const atoms = model.getAtoms();
          atoms.forEach((atom: any) => {
            v.addLabel(atom.elem, {
              position: atom,
              font: 'Arial',
              fontSize: 10,
              fontColor: 'white',
              backgroundColor: 'black',
              backgroundOpacity: 0.6,
              alignment: 'center'
            });
          });
        });
      }

      if (showSurface) {
        v.addSurface(window.$3Dmol.SurfaceType.VDW, {
          opacity: 0.4,
          color: 'white'
        }, {}, {});
      }

      v.render();
    } catch (err) {
      console.error("Görselleştirme stili güncellenirken hata:", err);
    }
  }, [style, showLabels, showSurface]);

  // Pencere boyutu değiştiğinde canvas'ı güncelle
  useEffect(() => {
    const handleResize = () => {
      if (viewerRef.current) {
        viewerRef.current.resize();
        viewerRef.current.render();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let active = true;
    
    const initViewer = async () => {
      if (!containerRef.current || !window.$3Dmol) {
        // Kütüphane yüklenene kadar kısa aralıklarla dene
        setTimeout(() => { if(active) initViewer(); }, 300);
        return;
      }

      setLoading(true);
      setError(false);
      
      try {
        // Viewer örneğini oluştur (eğer yoksa)
        if (!viewerRef.current) {
          viewerRef.current = window.$3Dmol.createViewer(containerRef.current, {
            backgroundColor: 'transparent',
          });
        }
        
        const v = viewerRef.current;
        v.clear();

        let data = '';
        let format = '';

        // 1. Adım: PubChem 3D Verisi (Tercih edilen)
        if (cid) {
          try {
            const res = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF?record_type=3d`);
            if (res.ok) { data = await res.text(); format = 'sdf'; }
          } catch (e) {}
        }

        // 2. Adım: SMILES üzerinden PubChem 3D Verisi
        if (!data && smiles) {
          try {
            const res = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(smiles)}/SDF?record_type=3d`);
            if (res.ok) { data = await res.text(); format = 'sdf'; }
          } catch (e) {}
        }

        // 3. Adım: Standart 2D SDF (3Dmol.js bunu 3D'ye dönüştürebilir)
        if (!data && cid) {
          try {
            const res = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF`);
            if (res.ok) { data = await res.text(); format = 'sdf'; }
          } catch (e) {}
        }

        // 4. Adım: Ham SMILES Dizesi (Son çare)
        if (!data && smiles) {
          data = smiles;
          format = 'smi';
        }

        if (data && active) {
          v.addModel(data, format);
          v.zoomTo();
          updateStyle();
          
          if (isRotating) {
            v.animate({ loop: 'backAndForth', step: 1 });
          } else {
            v.stopAnimate();
          }

          setLoading(false);
        } else if (active) {
          setError(true);
          setLoading(false);
        }
      } catch (err) {
        console.error("Molekül yükleme hatası:", err);
        if (active) {
          setError(true);
          setLoading(false);
        }
      }
    };

    initViewer();

    return () => {
      active = false;
      if (viewerRef.current) {
        viewerRef.current.stopAnimate();
        viewerRef.current.clear();
      }
    };
  }, [smiles, cid, isRotating]);

  // Kullanıcı stil değiştirdiğinde sadece stili güncelle
  useEffect(() => {
    updateStyle();
  }, [updateStyle]);

  const takeSnapshot = () => {
    if (!viewerRef.current) return;
    const canvas = containerRef.current?.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${name.replace(/\s+/g, '_')}_3D_Analizi.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="relative group/viz no-print w-full min-h-[500px] bg-gradient-to-br from-surface-800 to-black/40 rounded-5xl border border-white/5 shadow-2xl overflow-hidden animate-fade-in-up">
      {/* Üst Kontrol Paneli */}
      <div className="absolute top-6 left-6 z-10 space-y-4">
        <div className="bg-primary-500/10 backdrop-blur-2xl px-4 py-2 rounded-2xl border border-primary-500/20 shadow-lg">
            <span className="text-[9px] font-black text-primary-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse"></span>
                Dinamik 3D Render Motoru
            </span>
        </div>
        
        <div className="flex gap-2 p-1 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/5">
            {(['ballAndStick', 'stick', 'sphere'] as const).map((s) => (
                <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`px-3 py-1.5 rounded-xl text-[9px] font-black transition-all border ${
                        style === s 
                        ? 'bg-primary-500 border-primary-400 text-white shadow-[0_0_15px_rgba(var(--color-primary-500),0.4)]' 
                        : 'bg-transparent border-transparent text-text-muted hover:text-white hover:bg-white/5'
                    }`}
                >
                    {s === 'ballAndStick' ? 'HİBRİT' : s === 'stick' ? 'ÇUBUK' : 'KÜRE'}
                </button>
            ))}
        </div>
      </div>

      {/* Sağ Yan Kontroller */}
      <div className="absolute top-6 right-6 z-10 flex flex-col gap-2">
          <button 
            onClick={() => setShowLabels(!showLabels)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${showLabels ? 'bg-primary-500 border-primary-400 text-white shadow-lg' : 'bg-black/60 border-white/5 text-text-muted hover:text-white'}`}
            title="Atom Etiketleri"
          >
              <span className="material-symbols-outlined text-xl">label</span>
          </button>
          <button 
            onClick={() => setShowSurface(!showSurface)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${showSurface ? 'bg-primary-500 border-primary-400 text-white shadow-lg' : 'bg-black/60 border-white/5 text-text-muted hover:text-white'}`}
            title="Elektron Yoğunluğu (VDW)"
          >
              <span className="material-symbols-outlined text-xl">blur_on</span>
          </button>
      </div>

      {/* Alt Etkileşim Araçları */}
      <div className="absolute bottom-6 right-6 z-10 flex gap-2">
          <button 
            onClick={() => setIsRotating(!isRotating)}
            className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all ${isRotating ? 'bg-primary-500/20 border-primary-500 text-primary-400 shadow-inner' : 'bg-black/60 border-white/5 text-text-muted'}`}
            title={isRotating ? "Rotasyonu Durdur" : "Rotasyonu Başlat"}
          >
              <span className={`material-symbols-outlined text-2xl ${isRotating ? 'animate-spin-slow' : ''}`}>sync</span>
          </button>
          <button 
            onClick={takeSnapshot}
            className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 text-text-muted hover:text-white hover:bg-primary-500/20 transition-all shadow-xl"
            title="Görüntüyü Kaydet"
          >
              <span className="material-symbols-outlined text-2xl">photo_camera</span>
          </button>
      </div>

      {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-900/60 backdrop-blur-md z-20">
              <div className="w-14 h-14 border-4 border-primary-500/10 border-t-primary-500 rounded-full animate-spin"></div>
              <p className="mt-6 text-[10px] font-black text-primary-400 uppercase tracking-[0.3em] animate-pulse">Moleküler Geometri Oluşturuluyor</p>
          </div>
      )}

      {error && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-900/80 z-20 p-8 text-center animate-fade-in">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                <span className="material-symbols-outlined text-4xl text-white/20">molecule</span>
              </div>
              <h4 className="text-white font-bold mb-2">Görsel Veri Eksik</h4>
              <p className="text-[11px] font-medium text-text-muted max-w-[200px] leading-relaxed">Bu bileşik için geçerli bir 3D koordinat verisi bulunamadı.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-6 px-6 py-2 bg-white/5 border border-white/10 text-[10px] text-primary-400 rounded-xl uppercase font-black tracking-widest hover:bg-white/10 transition-all"
              >
                Yeniden Dene
              </button>
          </div>
      )}

      {/* 3Dmol.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full min-h-[500px] cursor-grab active:cursor-grabbing" />
      
      <style>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MoleculeVisualizer;