import React, { useState, useEffect, useRef, useMemo } from 'react';
import { QuizQuestion } from '../types';

interface Props {
    questions: QuizQuestion[];
    title: string;
}

interface LeaderboardEntry {
    score: number;
    total: number;
    date: string;
}

const Quiz: React.FC<Props> = ({ questions: rawQuestions, title }) => {
    const [seed, setSeed] = useState(0);
    const questions = useMemo(() => {
        const shuffled = [...rawQuestions].sort(() => Math.random() - 0.5);
        return shuffled.map(q => ({
            ...q,
            options: [...q.options].sort(() => Math.random() - 0.5)
        }));
    }, [rawQuestions, seed]);

    const [answers, setAnswers] = useState<(string | null)[]>(Array(questions.length).fill(null));
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(questions.length * 30);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('chemQuizLeaderboard');
        if (saved) setLeaderboard(JSON.parse(saved));
    }, []);

    useEffect(() => {
        if (!submitted && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && !submitted) {
            handleSubmit();
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [timeLeft, submitted]);

    const handleOptionChange = (questionIndex: number, option: string) => {
        if (submitted) return;
        const newAnswers = [...answers];
        newAnswers[questionIndex] = option;
        setAnswers(newAnswers);
    };

    const handleSubmit = () => {
        if (submitted) return;
        if (timerRef.current) clearInterval(timerRef.current);

        let currentScore = 0;
        answers.forEach((answer, index) => {
            if (answer === questions[index].correct_answer) {
                currentScore++;
            }
        });

        const newEntry: LeaderboardEntry = {
            score: currentScore,
            total: questions.length,
            date: new Date().toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
        };

        const updatedLeaderboard = [newEntry, ...leaderboard]
            .sort((a, b) => (b.score / b.total) - (a.score / a.total))
            .slice(0, 5);

        setLeaderboard(updatedLeaderboard);
        localStorage.setItem('chemQuizLeaderboard', JSON.stringify(updatedLeaderboard));
        setScore(currentScore);
        setSubmitted(true);
    };

    const handleReset = () => {
        setAnswers(Array(questions.length).fill(null));
        setSubmitted(false);
        setScore(0);
        setTimeLeft(rawQuestions.length * 30);
        setSeed(prev => prev + 1);
    };

    const getOptionClass = (questionIndex: number, option: string) => {
        const isSelected = answers[questionIndex] === option;
        const isCorrect = questions[questionIndex].correct_answer === option;

        // Sonuç ekranında özel renkler (Yeşil/Kırmızı Sabit)
        if (submitted) {
            if (isCorrect) {
                return "bg-gradient-to-br from-emerald-500 to-teal-700 text-white ring-2 ring-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.4)] scale-[1.03] z-10 border-white/20";
            }
            if (isSelected && !isCorrect) {
                return "bg-gradient-to-br from-rose-600 to-red-800 text-white ring-2 ring-rose-300 shadow-[0_0_25px_rgba(225,29,72,0.4)] z-10 border-white/20";
            }
            return "bg-white/5 text-text-muted opacity-25 grayscale-[0.5]";
        }

        // Seçili şık: Menekşe/Mor Gradyan (Temadan bağımsız pop-up renk)
        if (isSelected) {
            return "bg-gradient-to-r from-violet-600 to-indigo-700 text-white ring-2 ring-violet-300 scale-[1.06] shadow-[0_15px_35px_rgba(124,58,237,0.4)] z-20 border-white/30";
        }

        // Boş şık: Temiz Glass-Card
        return "bg-white/5 hover:bg-white/10 text-text-main border border-white/10 hover:border-white/25 transition-all duration-300 hover:scale-[1.02]";
    };

    return (
        <div className="glass-panel p-8 sm:p-12 rounded-4xl mt-16 animate-fade-in-up">
            {!submitted && (
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-5 px-1">
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-primary-400">hourglass_empty</span>
                            ZAMANIN İŞLİYOR
                        </span>
                        <span className={`text-3xl font-mono font-black tracking-widest ${timeLeft < 15 ? 'text-red-500 animate-pulse' : 'text-primary-400'}`}>
                            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                        </span>
                    </div>
                    <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
                        <div 
                            className={`h-full transition-all duration-1000 ease-linear rounded-full ${timeLeft < 15 ? 'bg-gradient-to-r from-red-600 to-pink-500' : 'bg-gradient-to-r from-primary-600 to-primary-400'}`}
                            style={{ width: `${(timeLeft / (questions.length * 30)) * 100}%` }}
                        ></div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-20">
                <div className="flex items-center gap-8">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 p-5 rounded-3xl shadow-xl border border-white/10 backdrop-blur-xl group hover:scale-110 transition-transform duration-500">
                       <span className="material-symbols-outlined text-5xl text-primary-400 group-hover:rotate-12 transition-transform">quiz</span>
                    </div>
                    <h3 className="text-4xl sm:text-6xl font-black text-white tracking-tighter">
                        {title}
                    </h3>
                </div>
                {submitted && (
                    <div className="px-12 py-8 bg-gradient-to-br from-white/10 to-transparent rounded-4xl border border-white/10 backdrop-blur-3xl flex flex-col items-center shadow-2xl">
                        <span className="text-[11px] font-black text-text-muted uppercase tracking-[0.4em] mb-2">PERFORMANS</span>
                        <span className="text-6xl font-black bg-gradient-to-r from-primary-300 via-primary-500 to-indigo-400 bg-clip-text text-transparent">
                            %{Math.round((score / questions.length) * 100)}
                        </span>
                    </div>
                )}
            </div>

            {submitted && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-24">
                    <div className="lg:col-span-2 p-12 bg-white/5 rounded-4xl border border-white/10 flex flex-col sm:flex-row items-center gap-12 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className={`w-36 h-36 rounded-full flex items-center justify-center shrink-0 shadow-2xl border-4 ${score === questions.length ? 'bg-yellow-500/10 border-yellow-400/40 animate-bounce' : 'bg-primary-500/10 border-primary-400/40'}`}>
                            <span className={`material-symbols-outlined text-8xl ${score === questions.length ? 'text-yellow-400' : 'text-primary-400'}`}>
                                {score === questions.length ? 'workspace_premium' : 'psychology'}
                            </span>
                        </div>
                        <div className="text-center sm:text-left relative z-10">
                            <h4 className="text-4xl font-black text-white mb-4">
                                {score === questions.length ? 'Ustalık Mertebesi!' : score > questions.length / 2 ? 'Güçlü Bir Zihin!' : 'Keşif Başlasın!'}
                            </h4>
                            <p className="text-text-muted text-lg mb-10 leading-relaxed max-w-lg font-medium">
                                {score === questions.length 
                                    ? 'Moleküler seviyede kusursuz bir bilgiye sahipsin. Sen gerçek bir kimyagersin!' 
                                    : 'Analizler seni bekliyor. Eksiklerini tamamlayarak bir sonraki turda zirveyi hedefleyebilirsin.'}
                            </p>
                            <button onClick={handleReset} className="px-10 py-5 bg-primary-500 hover:bg-primary-400 text-white text-base font-black rounded-2xl transition-all flex items-center gap-3 shadow-[0_15px_40px_rgba(var(--color-primary-500),0.3)] hover:-translate-y-1 active:scale-95 mx-auto sm:mx-0">
                                <span className="material-symbols-outlined">restart_alt</span>
                                TESTİ YENİLE
                            </button>
                        </div>
                    </div>

                    <div className="p-10 bg-black/40 rounded-4xl border border-white/5 flex flex-col shadow-inner">
                        <h4 className="text-[10px] font-black text-primary-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                            <span className="material-symbols-outlined text-lg">leaderboard</span>
                            REKORLARIN
                        </h4>
                        <div className="space-y-6 flex-grow">
                            {leaderboard.map((entry, idx) => (
                                <div key={idx} className={`flex justify-between items-center pb-5 border-b border-white/5 ${idx === 0 ? 'text-primary-300' : 'text-text-muted'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${idx === 0 ? 'bg-primary-500 text-white' : 'bg-white/10 text-white/50'}`}>
                                            {idx + 1}
                                        </div>
                                        <span className="text-xs font-bold font-mono">{entry.date}</span>
                                    </div>
                                    <span className="font-black text-lg">{entry.score}/{entry.total}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-32">
                {questions.map((q, qIndex) => {
                    const isWrong = submitted && answers[qIndex] !== q.correct_answer;
                    return (
                        <div key={`${seed}-${qIndex}`} className="group relative">
                            <div className="flex gap-10 items-start mb-12">
                                <span className={`flex-shrink-0 w-16 h-16 rounded-3xl flex items-center justify-center font-black text-3xl border-2 transition-all duration-700 shadow-2xl ${submitted && isWrong ? 'bg-red-500/10 border-red-500/40 text-red-400' : 'bg-primary-500/10 border-primary-400/40 text-primary-400'}`}>
                                    {qIndex + 1}
                                </span>
                                <p className="font-black text-white text-3xl sm:text-4xl leading-tight pt-1 group-hover:text-primary-300 transition-colors duration-500 tracking-tight">
                                    {q.question}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-0 md:pl-24">
                                {q.options.map((option, oIndex) => (
                                    <button
                                        key={oIndex}
                                        onClick={() => handleOptionChange(qIndex, option)}
                                        disabled={submitted}
                                        className={`w-full text-left p-10 rounded-4xl transition-all duration-500 transform shadow-2xl relative overflow-hidden group/opt ${getOptionClass(qIndex, option)}`}
                                    >
                                        <div className="flex items-center justify-between gap-6 relative z-10">
                                            <span className="text-2xl font-bold leading-tight tracking-tight">{option}</span>
                                            {submitted && q.correct_answer === option && (
                                                <div className="bg-white/20 p-2 rounded-full animate-pulse">
                                                    <span className="material-symbols-outlined text-white text-4xl">done_all</span>
                                                </div>
                                            )}
                                            {submitted && answers[qIndex] === option && q.correct_answer !== option && (
                                                <div className="bg-white/20 p-2 rounded-full">
                                                    <span className="material-symbols-outlined text-white text-4xl">close</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/opt:opacity-100 transition-opacity"></div>
                                    </button>
                                ))}
                            </div>
                            {submitted && (
                                <div className={`mt-14 md:ml-24 p-10 rounded-4xl border-l-[20px] animate-fade-in-up shadow-2xl backdrop-blur-3xl ${isWrong ? 'bg-red-500/5 border-red-600/50' : 'bg-emerald-500/5 border-emerald-600/50'}`}>
                                    <div className="flex items-center gap-5 mb-6">
                                        <div className={`p-3 rounded-2xl ${isWrong ? 'bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]'}`}>
                                            <span className={`material-symbols-outlined text-3xl ${isWrong ? 'text-red-400' : 'text-emerald-400'}`}>
                                                {isWrong ? 'lightbulb_circle' : 'auto_awesome'}
                                            </span>
                                        </div>
                                        <h5 className={`text-sm font-black uppercase tracking-[0.4em] ${isWrong ? 'text-red-400' : 'text-emerald-400'}`}>
                                            {isWrong ? 'DERİN ANALİZ' : 'BİLGİ NOTU'}
                                        </h5>
                                    </div>
                                    <p className="text-text-main text-2xl italic leading-relaxed font-bold tracking-tight">
                                        {q.explanation}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {!submitted && (
                <div className="mt-32 text-center">
                    <button 
                        onClick={handleSubmit} 
                        className="group relative px-24 py-10 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-black text-3xl rounded-4xl hover:from-primary-500 hover:to-indigo-500 transition-all shadow-[0_30px_70px_rgba(79,70,229,0.4)] hover:-translate-y-3 flex items-center gap-6 mx-auto ring-1 ring-white/30"
                    >
                        ANALİZİ TAMAMLA
                        <span className="material-symbols-outlined group-hover:translate-x-3 transition-transform text-4xl">rocket_launch</span>
                    </button>
                    <p className="mt-10 text-[12px] text-text-muted font-black tracking-[0.5em] uppercase opacity-30">
                        {answers.filter(a => a !== null).length} / {questions.length} SORU CEVAPLANDI
                    </p>
                </div>
            )}
        </div>
    );
};

export default Quiz;