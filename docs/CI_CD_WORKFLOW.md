# CI/CD Workflow for Disduct Cameroun Connect

This document outlines the Continuous Integration/Continuous Deployment (CI/CD) workflow implemented for the Disduct Cameroun Connect project using GitHub Actions. This workflow ensures code quality, consistency, and functionality across the development lifecycle.

## Workflow Overview (`.github/workflows/node.js.yml`)

The primary CI/CD workflow is defined in `.github/workflows/node.js.yml`. It is triggered on every `push` to the `main` branch and on every `pull_request` targeting the `main` branch.

The workflow consists of two main jobs: `lint` and `test`.

### Job 1: `lint`

This job focuses on code quality checks and runs once on `ubuntu-latest` with Node.js v20 (Active LTS).

1.  **Checkout Code:**
    *   `uses: actions/checkout@v4`
    *   Checks out your repository code, making it available to the workflow.

2.  **Setup Node.js Environment (v20):**
    *   `uses: actions/setup-node@v4`
    *   Configures the Node.js environment to version 20. It also caches `npm` dependencies to speed up subsequent runs.

3.  **Install Dependencies:**
    *   `run: npm ci`
    *   Installs project dependencies using `npm ci`, ensuring a clean installation based on `package-lock.json`.

4.  **Run ESLint:**
    *   `run: npm run lint`
    *   Executes the ESLint linter to identify and report on patterns found in JavaScript/TypeScript code, ensuring adherence to coding standards and best practices.

5.  **Check Prettier Formatting:**
    *   `run: npm run prettier:check`
    *   Verifies that the code adheres to the Prettier formatting rules, ensuring consistent code style across the project.

6.  **Run TypeScript Type Check:**
    *   `run: tsc --noEmit`
    *   Performs a TypeScript compilation check without emitting any output files, catching type-related errors early in the development process.

### Job 2: `test`

This job runs after the `lint` job completes successfully (`needs: lint`). It focuses on building and testing the project across multiple Node.js versions.

1.  **Checkout Code:**
    *   `uses: actions/checkout@v4`
    *   Checks out your repository code.

2.  **Setup Node.js Environment (Matrix):**
    *   `uses: actions/setup-node@v4`
    *   Configures the Node.js environment for each version specified in the matrix (18.x, 20.x, 22.x). Caches `npm` dependencies.

3.  **Install Dependencies:**
    *   `run: npm ci`
    *   Installs project dependencies.

4.  **Build Project (Vite):**
    *   `run: npm run build`
    *   Builds the project for production.

5.  **Run Tests:**
    *   `run: npm test`
    *   Executes the project's test suite. This step is now actively included in the workflow.

## Local Development and Testing

To ensure your changes adhere to the project's quality standards before pushing to the repository, you can run the same checks locally.

1.  **Install Dependencies:**

    ```bash
    npm install
    # or if you use bun
    bun install
    ```

2.  **Run ESLint:**

    ```bash
    npm run lint
    ```

    This command will report any linting issues.
    - **Fixing `react-refresh/only-export-components` warnings:** These warnings indicate that a file exports non-component values (like constants or utility functions) alongside React components. For optimal React Fast Refresh performance, it's recommended to move these non-component exports to separate files. While these are warnings and won't break your build, addressing them improves the development experience.

3.  **Check Prettier Formatting:**

    ```bash
    npm run prettier:check
    ```

    This command will show if any files are not formatted correctly. To automatically format your code, you can run:

    ```bash
    npm run prettier
    ```

    It's recommended to run `npm run prettier:check -- --write "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}"` regularly to maintain consistent code style.

4.  **Run TypeScript Check:**

    ```bash
    tsc --noEmit
    ```

    This command will check for any TypeScript compilation errors.

5.  **Build Project:**

    ```bash
    npm run build
    ```

6.  **Run Tests (Future Implementation):**
    Once you have test files (e.g., `*.test.ts` or `*.spec.ts`), you can run your tests locally using:
    ```bash
    npm test
    ```
    The project's `package.json` indicates `vitest` is used for testing.

By following these local checks, you can catch most issues before they are flagged by the CI/CD pipeline, leading to a smoother development experience.
