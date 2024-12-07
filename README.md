# AL Code Documentation Generator

This tool processes Business Central AL files and generates documentation using the Anthropic Claude API.

## Prerequisites

- [Deno](https://deno.com/) installed
- Anthropic API key

## Setup

1. Clone this repository
2. Set your Anthropic API key as an environment variable:
   ```cmd
   set ANTHROPIC_API_KEY=your-api-key
   ```

## Usage

1. Create a directory called `al-files` and place your AL source files in it:
   ```cmd
   mkdir al-files
   ```

2. Run the script:
   ```cmd
   deno run --allow-read --allow-write --allow-net --allow-env process_al_files.ts
   ```

3. The generated documentation will be created in the `docs` directory, with each AL file having a corresponding markdown file.

## Output

The tool generates markdown documentation for each AL file, including:
- Rule ID
- Purpose
- What the rule checks
- Why it matters
- Recommendations
- Severity and area information

## Example

For an AL file named `MyRule.al`, the tool will generate `docs/MyRule.md` containing the analysis and documentation.
