import React, { useRef, useState, useEffect } from 'react';
import { ConceptMapInfo } from '../types';

interface ConceptMapDisplayProps {
  data: ConceptMapInfo;
}

const ConceptMapDisplay: React.FC<ConceptMapDisplayProps> = ({ data }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };
        // İlk render'da ve pencere yeniden boyutlandırıldığında boyutları güncelle
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, [data]); // Veri değiştiğinde de yeniden boyutlandırmayı tetikle

    const { centralConcept, relatedConcepts } = data;
    const count = relatedConcepts.length;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const radiusX = Math.max(dimensions.width * 0.35, 150);
    const radiusY = Math.max(dimensions.height * 0.35, 150);

    return (
        <div className="bg-surface-800/50 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl ring-1 ring-surface-600/50 animate-fade-in-up printable-content">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-primary-400 text-center flex-grow">Konsept Haritası: {centralConcept}</h2>
                <button
                    onClick={() => window.print()}
                    className="no-print -mr-2 p-2 text-text-muted rounded-full hover:bg-surface-700/50 hover:text-primary-400 transition-colors"
                    aria-label="Haritayı yazdır"
                >
                    <span className="material-symbols-outlined">print</span>
                </button>
            </div>
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
                                className="stroke-current text-surface-600"
                                strokeWidth="2"
                                strokeDasharray="4"
                            />
                        );
                    })}
                </svg>

                {/* Merkez Kavram */}
                <div
                    className="absolute flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 bg-primary-600 rounded-full text-center p-4 shadow-lg"
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
                            className="absolute flex flex-col items-center justify-center w-36 h-24 sm:w-40 sm:h-28 bg-surface-700 rounded-lg text-center p-2 shadow-md transition-transform duration-300 hover:scale-110 hover:shadow-primary-500/20"
                            style={{
                                top: `${nodeY}px`,
                                left: `${nodeX}px`,
                                transform: 'translate(-50%, -50%)',
                                zIndex: 1,
                            }}
                        >
                            <span className="text-xs text-primary-400 italic mb-1">{concept.relationship}</span>
                            <span className="font-semibold text-sm text-text-main">{concept.topic}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ConceptMapDisplay;