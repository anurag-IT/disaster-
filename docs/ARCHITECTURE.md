# Architecture

The Vite React application serves the operator UI and calls an Express API. Calls are initiated server-side through Twilio. Twilio connects answered calls to the Node WebSocket media service, which isolates state by `streamSid` and receives 8 kHz mu-law frames. Provider adapters are responsible for STT, validated Groq extraction, and telephony-compatible TTS. PostgreSQL is the production system of record; UI updates should be broadcast after each transaction.

The deterministic priority engine consumes only explicitly confirmed incident state. It never dispatches resources. An operator reviews evidence and assigns a team.
