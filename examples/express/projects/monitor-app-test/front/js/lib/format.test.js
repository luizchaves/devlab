import { describe, expect, it } from 'vitest';

import { formatLatency, latencyRatio } from './format.js';

describe('formatLatency', () => {
  it('appends the unit to a number', () => {
    expect(formatLatency(12)).toBe('12 ms');
  });

  it('treats zero as a valid measurement', () => {
    expect(formatLatency(0)).toBe('0 ms');
  });

  it('shows a dash when there was no response', () => {
    expect(formatLatency(null)).toBe('—');
    expect(formatLatency(undefined)).toBe('—');
  });
});

describe('latencyRatio', () => {
  it('converts latency into a percentage of the 200 ms scale', () => {
    expect(latencyRatio(100)).toBe(50);
  });

  it('saturates above the scale', () => {
    expect(latencyRatio(5000)).toBe(100);
  });

  it('returns zero for a failed measurement', () => {
    expect(latencyRatio(null)).toBe(0);
  });
});
