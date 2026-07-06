// quiz-logic.test.js
import { describe, it, expect } from 'vitest';
import { isCorrect, buildResult, calculateScore } from '../quiz-logic.js';

describe('isCorrect', () => {
    it('returns true when chosen index matches answer', () => {
        const q = { question: 'Q1', options: ['a', 'b'], answer: 1 };
        expect(isCorrect(q, 1)).toBe(true);
    });

    it('returns false when chosen index does not match', () => {
        const q = { question: 'Q1', options: ['a', 'b'], answer: 1 };
        expect(isCorrect(q, 0)).toBe(false);
    });
});

describe('calculateScore', () => {
    it('counts only correct results', () => {
        const results = [{ correct: true }, { correct: false }, { correct: true }];
        expect(calculateScore(results)).toBe(2);
    });

    it('returns 0 for empty results', () => {
        expect(calculateScore([])).toBe(0);
    });
});