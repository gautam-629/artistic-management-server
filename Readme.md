# Express.js Project

A Node.js backend application built with Express.js and TypeScript.

## Prerequisites

- Node.js (20 or newer recommended)
- npm or yarn

## Installation

Clone the repository and install dependencies:

```bash
git clone <your-repository-url>
cd <project-directory>
npm install
```

## Available Scripts

This project includes the following npm scripts:

- **`npm start`**: Runs the server using ts-node
- **`npm run build`**: Compiles TypeScript code to JavaScript
- **`npm run dev`**: Runs the server in development mode with nodemon for
  auto-reloading
- **`npm run format:fix`**: Automatically formats code using Prettier
- **`npm run format:check`**: Checks code formatting without making changes
- **`npm run lint:check`**: Runs ESLint to check for code quality issues
- **`npm run lint:fix`**: Automatically fixes ESLint issues where possible
- **`npm test`**: Runs Jest tests in sequence
- **`npm run test:watch`**: Runs Jest tests in watch mode
- **`npm run test:coverage`**: Runs Jest tests with coverage reporting
- **`npm run prepare`**: Sets up Husky for Git hooks

## Development

To start the development server with auto-reloading:

```bash
npm run dev
```

The server will be available at http://localhost:<port>, where `<port>` is
defined in your configuration.

## Testing

This project uses Jest for testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Code Quality

This project maintains code quality using:

- **TypeScript** for type-checking
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for Git hooks

To ensure your code meets quality standards before committing:

```bash
# Check formatting
npm run format:check

# Fix formatting
npm run format:fix

# Check linting
npm run lint:check

# Fix linting issues
npm run lint:fix
```

## Building for Production

To build the project for production:

```bash
npm run build
```
