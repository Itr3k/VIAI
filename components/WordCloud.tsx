import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { WordFrequency } from '../types';

interface WordCloudProps {
  words: WordFrequency[];
  height?: number;
}

const WordCloud: React.FC<WordCloudProps> = ({ words, height = 300 }) => {
  
  // Normalize sizes for display
  const normalizedWords = useMemo(() => {
    if (!words.length) return [];
    
    const maxVal = Math.max(...words.map(w => w.value));
    const minVal = Math.min(...words.map(w => w.value));
    
    const fontScale = d3.scaleLinear()
      .domain([minVal, maxVal])
      .range([14, 48]); // Font size range in px

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    return words.map((w, i) => ({
      ...w,
      size: fontScale(w.value),
      color: colorScale(i.toString())
    }));
  }, [words]);

  if (words.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-slate-50 rounded-lg border border-slate-200`} style={{ height }}>
        <p className="text-slate-400 text-sm">No analysis data available</p>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-xl border border-slate-200 p-6 flex flex-wrap content-center justify-center items-center gap-x-4 gap-y-2 overflow-hidden shadow-sm"
      style={{ height }}
    >
      {normalizedWords.map((word, idx) => (
        <span
          key={idx}
          className="font-semibold transition-all duration-300 hover:scale-110 cursor-default opacity-90 hover:opacity-100"
          style={{
            fontSize: `${word.size}px`,
            color: word.color,
          }}
          title={`Frequency: ${word.value}`}
        >
          {word.text}
        </span>
      ))}
    </div>
  );
};

export default WordCloud;