# Welcome!

Contributions are very welcome on the Aiven netlify-nextjs example. When contributing please keep this in mind:

- Open an issue to discuss new bigger features.
- Write code consistent with the project style and make sure the tests are passing.
- Stay in touch with us if we have follow up questions or requests for further changes.

# Development

Development of this project requires a PostgreSQL database as well as a Redis database. You can use a local database or use the Aiven for PostgreSQL® and Aiven for Redis® managed databases, available on https://aiven.io.

## Local Environment

1. Install dependencies: `npm i`
2. Set environment variables; copy the `.env.template` file to another `.env` file and replace the connection strings with your own ones. You can easily copy the connection strings from the Aiven Console.
3. Run the development server: `npm run dev`

## Static checking and Linting

- Formatting: `npm run format`
- Linting: `npm run lint`

# Opening a PR

- Commit messages should describe the changes, not the filenames. Win our admiration by following
  the [excellent advice from Chris Beams](https://chris.beams.io/posts/git-commit/) when composing
  commit messages.
- Choose a meaningful title for your pull request.
- The pull request description should focus on what changed and why.
- Check that the tests pass (and add test coverage for your changes if appropriate).
