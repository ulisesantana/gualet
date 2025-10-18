# GitHub Copilot Instructions

Always write all the code and documentation in English.

When generating code, ensure it is well-structured, follows best practices, and includes comments where necessary for clarity. However, avoid over-commenting obvious code.

Don't use `2>&1` for commands, it ends up making imposible to read from the console.

When generating code snippets, ensure they are complete and can be run or integrated easily into a project.

This is a monorepo project. When generating code, ensure that it adheres to the monorepo structure and conventions. It's using npm workspaces, so ensure that dependencies are correctly managed within the workspace context.

This is an application for recording your expenses, so you can analyze and elaborate reports based on your data. When generating code, ensure that it aligns with the application's purpose and enhances its functionality.

The application is a backend with NestJS and a frontend with React. When generating code, ensure that it is compatible with these frameworks and follows their conventions. Also it contains e2e tests using Playwright, so ensure that any new features or changes are covered by appropriate unit and e2e tests if necessary. The idea behind using Playwright is to ensure that the application works as expected from the user's perspective. So, it starts a container with the database and has utilities to seed data and clean up after tests.

When generating code that interacts with external systems (like databases, APIs, etc.), include error handling and validation to ensure robustness.# If the user requests documentation or explanations, provide clear and concise information that is easy to understand, avoiding jargon unless specifically requested.
If the user requests code for a specific platform (like web, mobile, desktop), ensure the code is optimized for that platform and follows relevant guidelines and best practices.
