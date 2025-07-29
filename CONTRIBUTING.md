# Contributing to NimbleBrain Widget

Thank you for your interest in contributing to the NimbleBrain Widget! This document provides guidelines for contributing to the project.

## Development Setup

### Prerequisites
- Node.js 24+ (nvm recommended for version management)
- npm

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/NimbleBrainInc/nimblebrain-widget.git
   cd nimblebrain-widget
   ```

2. **Use the correct Node.js version**
   ```bash
   # If using nvm (recommended)
   nvm use  # Uses version from .nvmrc file
   
   # If you don't have Node 24 installed yet
   nvm install  # Installs and uses the version from .nvmrc
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development**
   ```bash
   npm run dev          # Watch mode for development
   npm run serve        # Serve test page locally
   ```

4. **Test your changes**
   - Visit `http://localhost:8080` to test the widget
   - Check console for errors
   - Test with different agent IDs

## Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Edit files in `src/` directory
   - Follow existing code style and patterns
   - Test locally using `npm run serve`

3. **Build and test**
   ```bash
   npm run build        # Production build
   npm run serve        # Test the build
   ```

4. **Clean up** (if needed)
   ```bash
   npm run clean        # Clear cache and dist/
   ```

### Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Add comments for complex logic
- Keep functions focused and small
- Use meaningful variable names

### Testing

Before submitting changes:

1. **Test locally**
   ```bash
   npm run build
   npm run serve
   ```

2. **Test different scenarios**
   - Valid and invalid agent IDs
   - Different API endpoints
   - Error conditions
   - Various browser sizes

3. **Check demo pages**
   - Test files in `demo/` directory
   - Ensure all examples still work

## Submitting Changes

### Pull Request Process

1. **Ensure your branch is up to date**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Create a clear commit message**
   ```bash
   git commit -m "feat: add new widget positioning option"
   ```

3. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - Use a descriptive title
   - Explain what your changes do
   - Reference any related issues
   - Include testing instructions

### Commit Message Format

Use conventional commits format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## Project Structure

```
nimblebrain-widget/
├── src/
│   ├── widget.ts       # Main widget implementation
│   ├── api.ts          # NimbleBrain API client
│   ├── widget.css      # Widget styles
│   └── assets/         # Images and static assets
├── demo/               # Test pages and demos
├── public/             # Static files for CDN
├── scripts/            # Build scripts
├── dist/               # Built files (generated)
├── webpack.config.js   # Development build config
└── webpack.prod.config.js # Production build config
```

## Deployment

The widget is deployed to Cloudflare Pages:

```bash
npm run deploy:cloudflare    # Deploy to production
npm run deploy:cf-staging    # Deploy to staging
```

**Note:** Only maintainers can deploy to production.

## Reporting Issues

When reporting bugs:

1. **Use a clear title**
2. **Describe the problem**
   - What happened?
   - What did you expect?
   - Steps to reproduce
3. **Include environment details**
   - Browser version
   - Operating system
   - Widget version
4. **Add screenshots if helpful**

## Feature Requests

For new features:

1. **Check existing issues** first
2. **Describe the use case**
3. **Explain the proposed solution**
4. **Consider backward compatibility**

## Questions?

- Check existing [issues](https://github.com/NimbleBrainInc/nimblebrain-widget/issues)
- Review the [documentation](README.md)
- Contact support@nimblebrain.ai

## Code of Conduct

- Be respectful and constructive
- Focus on the issue, not the person
- Help others learn and grow
- Follow project coding standards

Thank you for contributing! 🎉