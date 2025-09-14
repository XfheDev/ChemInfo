import React, { useRef, useState, useEffect } from 'react';

// Bu bileşenin alması beklenen veri yapısı
interface ConceptMapData {
    centralConcept: string;
    relatedConcepts: {
        topic: string;
        relationship: string;
    }[];
}

interface ConceptMapDisplayProps {
  // data: ConceptMapData; // Gelecekte bu şekilde kullanılacak
  data: any; // Geçici olarak any kullanılıyor, çünkü ana akışta henüz yok
}

const ConceptMapDisplay: React.FC<ConceptMapDisplayProps> = ({ data }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Konteyner boyutlarını dinamik olarak al
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Eğer veri yoksa veya beklenen formatta değilse, eski yer tutucuyu göster
    if (!data || !data.centralConcept || !data.relatedConcepts) {
        return (
             <div className="bg-gray-800/50 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl ring-1 ring-white/10 animate-fade-in-up">
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">Konsept Haritası (Gelecek Özellik)</h2>
                <p className="text-gray-400">Bu özellik için uygun veri bulunamadı veya özellik henüz aktif değil.</p>
            </div>
        );
    }

    const { centralConcept, relatedConcepts } = data as ConceptMapData;
    const count = relatedConcepts.length;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    // Yarıçapı konteynerin boyutuna göre ayarla
    const radiusX = dimensions.width * 0.35;
    const radiusY = dimensions.height * 0.35;

    return (
        <div className="bg-gray-800/50 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl ring-1 ring-white/10 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-cyan-400 mb-8 text-center">Konsept Haritası: {centralConcept}</h2>
            <div ref={containerRef} className="relative w-full min-h-[400px] sm:min-h-[500px]">
                {/* Bağlantı Çizgileri (SVG) */}
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                    {relatedConcepts.map((_, i) => {
                        const angle = (i / count) * 2 * Math.PI - Math.PI / 2; // Üstten başla
                        const nodeX = centerX + radiusX * Math.cos(angle);
                        const nodeY = centerY + radiusY * Math.sin(angle);
                        return (
                            <line
                                key={i}
                                x1={centerX}
                                y1={centerY}
                                x2={nodeX}
                                y2={nodeY}
                                className="stroke-current text-gray-600"
                                strokeWidth="2"
                                strokeDasharray="4"
                            />
                        );
                    })}
                </svg>

                {/* Merkez Kavram */}
                <div
                    className="absolute flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 bg-cyan-600 rounded-full text-center p-4 shadow-lg"
                    style={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2,
                    }}
                >
                    <span className="font-bold text-white text-base sm:text-lg">{centralConcept}</span>
                </div>

                {/* İlişkili Kavramlar */}
                {relatedConcepts.map((concept, i) => {
                    const angle = (i / count) * 2 * Math.PI - Math.PI / 2; // Üstten başla
                    const nodeX = centerX + radiusX * Math.cos(angle);
                    const nodeY = centerY + radiusY * Math.sin(angle);
                    return (
                        <div
                            key={i}
                            className="absolute flex flex-col items-center justify-center w-36 h-24 sm:w-40 sm:h-28 bg-gray-700 rounded-lg text-center p-2 shadow-md transition-transform duration-300 hover:scale-110 hover:shadow-cyan-500/20"
                            style={{
                                top: `${nodeY}px`,
                                left: `${nodeX}px`,
                                transform: 'translate(-50%, -50%)',
                                zIndex: 1,
                            }}
                        >
                            <span className="text-xs text-cyan-400 italic mb-1">{concept.relationship}</span>
                            <span className="font-semibold text-sm text-white">{concept.topic}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ConceptMapDisplay;