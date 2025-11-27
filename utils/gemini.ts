import { AIAnalysis } from '../types';

export const runAnalysis = async (transcript: string): Promise<AIAnalysis> => {
    // Mock analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        sentimentScore: Math.floor(Math.random() * 100),
        summary: 'Automated analysis summary based on transcript content.',
        missedEmailOpportunity: Math.random() > 0.7,
        keywords: [
            { text: 'pricing', value: 50 },
            { text: 'support', value: 30 },
            { text: 'feature', value: 20 }
        ]
    };
};
