"use client";

import { useState, useEffect } from "react";

export function useAudioWaveform(
  url: string | undefined,
  barsCount: number = 24,
) {
  const [waveform, setWaveform] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!url) return;

    const generateWaveform = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();

        const audioContext = new (
          window.AudioContext ||
          (window as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext
        )();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const rawData = audioBuffer.getChannelData(0); // Use the first channel
        const samples = rawData.length;
        const blockSize = Math.floor(samples / barsCount);
        const filteredData = [];

        for (let i = 0; i < barsCount; i++) {
          const blockStart = blockSize * i;
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            sum = sum + Math.abs(rawData[blockStart + j]);
          }
          filteredData.push(sum / blockSize);
        }

        const multiplier = Math.pow(Math.max(...filteredData), -1);
        const normalizedData = filteredData.map((n) => n * multiplier);

        setWaveform(normalizedData);
      } catch (error) {
        console.error("Error generating waveform:", error);
        // Fallback to pseudo-random waveform if error occurs
        const fallback = Array.from({ length: barsCount }, () => Math.random());
        setWaveform(fallback);
      } finally {
        setLoading(false);
      }
    };

    generateWaveform();
  }, [url, barsCount]);

  return { waveform, loading };
}
