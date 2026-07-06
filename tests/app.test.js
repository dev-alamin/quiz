// app.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'fs';

beforeEach(() => {
    document.body.innerHTML = readFileSync('./index.html', 'utf-8');
    vi.resetModules(); // important: your module has top-level state and DOM binding
});

it('disables next button until an option is chosen', async () => {
    global.fetch = vi.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve([
                { question: 'Q1', options: ['a', 'b'], answer: 0 }
            ]),
        })
    );

    await import('../app.js'); // triggers the IIFE that loads questions
    // ...simulate clicking start, then an option, then assert btn-next.disabled === false
});