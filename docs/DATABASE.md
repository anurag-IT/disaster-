# Database

`prisma/schema.prisma` defines calls, transcripts, JSON-backed structured incidents, field evidence, responders, assignments, and incident updates. PostgreSQL is configured through `DATABASE_URL`. Run a reviewed Prisma migration after installing `prisma` and `@prisma/client`; no migration is generated against an unknown database in this credential-free build.
