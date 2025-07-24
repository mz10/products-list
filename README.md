# Products List Application

A React-based web application for browsing and managing a list of game translations with filtering capabilities.

## Features

- Browse game translations with details
- Filter games by:
  - Sorting (name, downloads, date)
  - Category/genre
  - Game size
  - Translation quality
- Responsive design for all screen sizes
- Game detail pages
- Image loading with fallbacks

## Project Structure

```
products-list/
├── public/                  # Static files
│   ├── games.json           # Game data
│   ├── no-img.png           # Fallback image
│   └── vite.svg             # Vite logo
├── src/
│   ├── assets/              # Static assets
│   ├── components/          # React components
│   │   ├── FilterBar.tsx    # Filters and searching
│   │   ├── GameDetail.tsx   # Game detail view
│   │   ├── GameItemContent.tsx # Game list item
│   │   ├── games.tsx        # Main game list
│   │   └── If.tsx           # Conditional component
│   ├── constants.ts         # App constants
│   ├── hooks/               # Custom hooks
│   ├── stores/              # State management
│   ├── styles/              # SCSS styles
│   ├── types/               # TypeScript types
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main app component
│   └── main.tsx             # App entry point
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript config
└── vite.config.ts           # Vite config
```

## Installation

### Recommended: pnpm
This project recommends using [pnpm](https://pnpm.io/) for faster and more efficient dependency management.

1. Install pnpm globally (if you don't have it):
```bash
npm install -g pnpm
# or using winget on Windows:
winget install pnpm
```

2. Clone the repository:
```bash
git clone https://github.com/mz10/products-list.git
cd products-list
```

3. Install dependencies:
```bash
pnpm install
```

4. Run development server:
```bash
pnpm dev
```

5. Open in browser:
```
http://localhost:5173
```

### Alternative: npm
If you prefer using npm:
```bash
npm install
npm run dev
```

## Building for Production

Using pnpm (recommended):
```bash
pnpm build
```

Using npm:
```bash
npm run build
```

The build artifacts will be in the `dist/` directory.

## Technologies Used

- React 18
- TypeScript
- Vite
- Valtio (state management)
- Ant Design (UI components)
- SCSS (styling)
- React Icons
- React Router

## Data Flow

1. Game data is loaded from `public/games.json`
2. State is managed using Valtio stores
3. Filters are applied to the game list
4. Users can view game details by clicking on items
5. Images are loaded with fallback to placeholder

## License

Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)
