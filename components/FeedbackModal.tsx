import React, { useState, useEffect } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setIsSuccess(false);
        setRating(0);
        setFeedback('');
        setEmail('');
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Automatically close after a delay on success
      setTimeout(() => onClose(), 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 no-print">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-surface-900 border border-white/10 rounded-4xl shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden animate-fade-in-up">
        
        {/* Glow Effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary-500/20 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-[80px]"></div>

        <div className="relative p-8 sm:p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Geri Bildirim</h2>
              <p className="text-text-muted text-sm mt-1">ChemInfo Pro'yu geliştirmemize yardımcı olun.</p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-text-muted hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Rating */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em]">Deneyiminizi Puanlayın</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="group transition-transform active:scale-90"
                    >
                      <span className={`material-symbols-outlined text-4xl transition-all ${
                        rating >= star ? 'text-yellow-400 fill-1' : 'text-white/10 group-hover:text-white/30'
                      }`}
                      style={{ fontVariationSettings: rating >= star ? "'FILL' 1" : "'FILL' 0" }}>
                        star
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em]">E-posta (İsteğe Bağlı)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="isim@ornek.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all placeholder:text-white/20"
                />
              </div>

              {/* Feedback Textarea */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em]">Görüşleriniz</label>
                <textarea
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Uygulama hakkında ne düşünüyorsunuz?"
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all placeholder:text-white/20 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !feedback.trim()}
                className="w-full py-5 bg-primary-600 hover:bg-primary-500 disabled:opacity-30 text-white font-black rounded-2xl transition-all shadow-xl shadow-primary-500/20 flex items-center justify-center gap-3 active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    GÖNDERİLİYOR...
                  </>
                ) : (
                  <>
                    GÖNDER
                    <span className="material-symbols-outlined">send</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="py-12 flex flex-col items-center text-center animate-fade-in">
              <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                <span className="material-symbols-outlined text-5xl text-emerald-400">check_circle</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Teşekkür Ederiz!</h3>
              <p className="text-text-muted">Geri bildiriminiz başarıyla iletildi. Uygulamayı geliştirmemize yardımcı olduğunuz için teşekkürler.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;