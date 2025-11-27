import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Mic, X, Send, Sparkles, Volume2, Loader2 } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const KorraAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Hi, I'm Korra. I can help you analyze your data or answer questions about your agency. How can I help?",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI processing
        setTimeout(() => {
            const response = generateMockResponse(userMsg.content);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const generateMockResponse = (input: string): string => {
        const lower = input.toLowerCase();
        if (lower.includes('summary') || lower.includes('overview')) {
            return "Based on your recent data, you've had 45 calls this week with an average sentiment score of 72/100. Agent Sarah is performing exceptionally well.";
        }
        if (lower.includes('billing') || lower.includes('invoice')) {
            return "I found 3 recent calls discussing billing issues. Two were resolved successfully, but one with 'Greenwood Legal' requires follow-up.";
        }
        if (lower.includes('agent') || lower.includes('performance')) {
            return "Your top performing agent this week is Sarah (Sales) with 145 calls. Mike (Support) has the highest customer satisfaction rating.";
        }
        return "I can help you with that. I'm analyzing your call transcripts and CRM data to find the best answer. (This is a demo response from Korra)";
    };

    const toggleListening = () => {
        setIsListening(!isListening);
        if (!isListening) {
            // Simulate voice input after 3 seconds
            setTimeout(() => {
                setInputValue("Give me a summary of today's calls");
                setIsListening(false);
            }, 3000);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all hover:scale-105 z-50 ${isOpen ? 'hidden' : 'flex'}`}
            >
                <Sparkles className="w-6 h-6 animate-pulse" />
            </button>

            {/* Chat Interface */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Korra AI</h3>
                                <p className="text-xs text-indigo-100 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    Online
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-bl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-slate-100 flex gap-1">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Voice Visualizer Overlay */}
                    {isListening && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 text-white">
                            <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center mb-6 animate-pulse shadow-[0_0_30px_rgba(79,70,229,0.5)]">
                                <Mic className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Listening...</h3>
                            <p className="text-white/70 text-sm">Speak now</p>
                            <div className="flex gap-1 mt-8 h-8 items-end">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-2 bg-white rounded-full animate-[bounce_1s_infinite]" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
                                ))}
                            </div>
                            <button
                                onClick={() => setIsListening(false)}
                                className="mt-8 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-slate-100">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleListening}
                                className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                            >
                                <Mic className="w-5 h-5" />
                            </button>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask Korra anything..."
                                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default KorraAssistant;
