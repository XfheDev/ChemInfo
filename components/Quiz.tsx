import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface Props {
    questions: QuizQuestion[];
    title: string;
}

const Quiz: React.FC<Props> = ({ questions, title }) => {
    const [answers, setAnswers] = useState<(string | null)[]>(Array(questions.length).fill(null));
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleOptionChange = (questionIndex: number, option: string) => {
        if (submitted) return;
        const newAnswers = [...answers];
        newAnswers[questionIndex] = option;
        setAnswers(newAnswers);
    };

    const handleSubmit = () => {
        let currentScore = 0;
        answers.forEach((answer, index) => {
            if (answer === questions[index].correct_answer) {
                currentScore++;
            }
        });
        setScore(currentScore);
        setSubmitted(true);
    };
    
    const handleReset = () => {
        setAnswers(Array(questions.length).fill(null));
        setSubmitted(false);
        setScore(0);
    }

    const getOptionClass = (questionIndex: number, option: string) => {
        if (!submitted) return "hover:bg-gray-600/70";
        const isCorrect = option === questions[questionIndex].correct_answer;
        const isSelected = option === answers[questionIndex];
        if (isCorrect) return "bg-green-500/50 ring-2 ring-green-400";
        if (isSelected) return "bg-red-500/50 ring-2 ring-red-400";
        return "opacity-50";
    }

    return (
        <div className="bg-gray-800/60 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl ring-1 ring-white/10 mt-8">
            <h3 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined">quiz</span>
                {title}
            </h3>
            
            {submitted && (
                 <div className="text-center bg-gray-900/50 p-6 rounded-xl mb-8 ring-1 ring-cyan-500/50">
                    <h4 className="text-xl font-bold text-white">Test Sonucu</h4>
                    <p className="text-3xl font-extrabold text-cyan-400 my-2">{score} / {questions.length}</p>
                    <button onClick={handleReset} className="mt-4 px-6 py-2 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-500 transition-colors">
                        Tekrar Dene
                    </button>
                </div>
            )}

            <div className="space-y-8">
                {questions.map((q, qIndex) => (
                    <div key={qIndex}>
                        <p className="font-semibold text-white mb-3">{qIndex + 1}. {q.question}</p>
                        <div className="space-y-2">
                            {q.options.map((option, oIndex) => (
                                <button
                                    key={oIndex}
                                    onClick={() => handleOptionChange(qIndex, option)}
                                    disabled={submitted}
                                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${getOptionClass(qIndex, option)} ${answers[qIndex] === option && !submitted ? 'bg-cyan-600/50 ring-2 ring-cyan-500' : 'bg-gray-700/50'}`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                         {submitted && <p className="mt-3 text-sm text-gray-400 p-3 bg-gray-900/50 rounded-lg">{q.explanation}</p>}
                    </div>
                ))}
            </div>

            {!submitted && (
                <div className="mt-8 text-center">
                     <button onClick={handleSubmit} disabled={answers.some(a => a === null)} className="px-8 py-3 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Testi Bitir
                    </button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
