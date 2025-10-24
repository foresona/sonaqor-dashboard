# Sonaqor Dashboard

B2B Client portal for Sonaqor Behavioral Finance Intelligence Platform.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Data Fetching:** React Query
- **State Management:** Zustand
- **Charts:** Recharts
- **HTTP Client:** Axios

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

## Features

- 📊 **Real-time Insights** - View F_scores, personas, and forecasts
- 🔑 **API Key Management** - Generate and manage API keys
- 📈 **Analytics Dashboard** - Usage metrics and trends
- ⚡ **Webhook Configuration** - Real-time event notifications
- 👥 **User Management** - Manage end-user data
- 🚨 **Anomaly Alerts** - Real-time fraud detection

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Dashboard home
│   ├── insights/             # User insights pages
│   ├── api-keys/             # API key management
│   ├── settings/             # Account settings
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/               # Reusable components
│   ├── charts/              # Chart components
│   ├── ui/                  # UI primitives
│   └── layout/              # Layout components
├── lib/
│   ├── api.ts               # API client
│   └── utils.ts             # Utilities
└── types/                   # TypeScript types
```

## Environment Variables

See `.env.example` for required environment variables.

## Deployment

This project is optimized for Vercel deployment.

```bash
npm run build
```
