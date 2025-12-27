# Insight Navigator - India Election 2024 Analytics Dashboard

A comprehensive analytics dashboard for the Indian General Elections 2024, providing detailed insights into constituency results, party performance, state-wise breakdowns, and key metrics from all 543 Lok Sabha seats.

## Features

- 📊 Real-time election data visualization
- 🗺️ Interactive maps powered by Mapbox GL
- 📈 Party-wise performance analytics
- 🏛️ Constituency-level results
- 📱 Responsive design with dark mode support
- 🔍 Advanced filtering and search capabilities

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Backend**: Supabase
- **Data Visualization**: Recharts
- **Maps**: Mapbox GL
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```sh
# Clone the repository
git clone https://github.com/Aatifraza123/insight-navigator.git

# Navigate to the project directory
cd insight-navigator

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080/`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_URL=your_supabase_url
```

## Project Structure

```
insight-navigator/
├── public/           # Static assets
│   └── data/        # Election data files
├── src/
│   ├── components/  # Reusable UI components
│   ├── contexts/    # React contexts (Theme, etc.)
│   ├── data/        # Data utilities and constants
│   ├── hooks/       # Custom React hooks
│   ├── integrations/# Third-party integrations (Supabase)
│   ├── lib/         # Utility functions
│   ├── pages/       # Page components
│   └── types/       # TypeScript type definitions
└── supabase/        # Supabase configuration
```

## Key Features Breakdown

### Data Analytics
- Comprehensive election results from 543 constituencies
- Party-wise vote share analysis
- Winner and runner-up statistics
- Margin of victory calculations

### Visualization
- Interactive charts using Recharts
- Geographic data representation with Mapbox
- State-wise performance metrics
- Trend analysis and comparisons

### User Experience
- Dark/Light theme toggle
- Responsive design for all devices
- Fast loading with optimized builds
- Intuitive navigation and filtering

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase
- Mapbox GL
- Recharts

## Deployment

### Vercel Deployment

1. **Via Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository: `https://github.com/Aatifraza123/general-election-2024.git`
   - Vercel will auto-detect Vite configuration
   - Add environment variables:
     - `VITE_GROQ_API_KEY`
     - `VITE_GEMINI_API_KEY`
   - Click "Deploy"

2. **Via Vercel CLI:**
   ```sh
   npm i -g vercel
   vercel login
   vercel --prod
   ```

### Render Deployment

1. **Via Render Dashboard:**
   - Go to [render.com](https://render.com)
   - Click "New Static Site"
   - Connect your GitHub repository: `https://github.com/Aatifraza123/general-election-2024.git`
   - Render will auto-detect `render.yaml` configuration
   - Add environment variables in the dashboard:
     - `VITE_GROQ_API_KEY`
     - `VITE_GEMINI_API_KEY`
   - Click "Create Static Site"

2. **Configuration (already included in render.yaml):**
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

### Build for Production

```sh
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

```sh
npm run preview
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Contact

For questions or feedback, please open an issue on GitHub.

---

Built with ❤️ for transparent election analytics
