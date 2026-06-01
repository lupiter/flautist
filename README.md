# Chalumeau

Chalumeau is a web-based app for musicians. It provides tools including a and a metronome.

## Features

- **Tuner**: Detect notes and frequency in real-time. Supports both input and tone generation.
- **Metronome**: With adjustable BPM and time signatures. Visual and sound.
- **Responsive Design**

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (latest LTS recommended)
- [npm](https://www.npmjs.com/)

### Installation

Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

### Building for Production

To create an optimized production build:

```bash
npm run build
```

The production files will be located in the `dist/` directory.

### Testing

To run the test suite:

```bash
npm test
```

To run end-to-end tests with Playwright:

```bash
npm run test:e2e
```
