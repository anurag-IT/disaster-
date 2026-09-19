# AI pipeline

1. Buffer a meaningful caller utterance; do not send partial tokens to the LLM.
2. STT returns text or a visible transcription failure—never fabricated text.
3. The Groq adapter requests JSON and validates it with Zod.
4. Merge non-null facts while preserving confirmed values and evidence quotes.
5. Recompute priority in TypeScript.
6. Ask one question for the highest-priority unknown fact.
7. Convert the short response to 8 kHz mu-law before sending Twilio `media` and `mark` events.

Unknown is `null`, never `false`. Provider failures preserve the call, transcript, and incident for manual handling.
