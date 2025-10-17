## Transcript Cleanup NPM Package

A tiny CLI to clean up raw transcript files (especially WebVTT) by removing cue headers, timestamps, and common filler vocalizations (e.g., "uh", "um", "eh"). The tool saves a new file with a `-processed` suffix alongside the original.

### Features

- Removes `WEBVTT` header
- Strips cue numbers and timestamp lines (e.g., `00:00:00.000 --> 00:00:01.000`)
- Removes basic filler vocalizations like "uh", "um", "eh" (case-insensitive, with optional trailing punctuation)
- Collapses excessive blank lines and trims leading/trailing whitespace
- Preserves all other text

### Requirements

- Node.js ≥ 16

### Installation

You can run it on-demand with `npx`, or install it locally or globally.

#### Run with npx (recommended)

```bash
npx transcript-cleanup <path-to-text-file>
```

#### Install locally (dev dependency)

```bash
npm i -D transcript-cleanup
# then
npx transcript-cleanup <path-to-text-file>
```

#### Install globally

```bash
npm i -g transcript-cleanup
# then
transcript-cleanup <path-to-text-file>
```

### Usage

```bash
npx transcript-cleanup <path-to-text-file>
```

Examples:

```bash
npx transcript-cleanup ~/Documents/transcript.vtt
npx transcript-cleanup ./relative/path/file.txt
npx transcript-cleanup /absolute/path/to/file.txt
```

Path notes:

- `~` is expanded to your home directory
- Relative paths are resolved against the current working directory
- Absolute paths are used as-is

#### Output

- The processed file is written next to the input file using the `-processed` suffix.
  - Example: `transcript.vtt` → `transcript-processed.vtt`
- The CLI prints size statistics and reduction percentage.

### What gets removed?

This CLI applies a small set of regex-based rules:
- `WEBVTT` header line
- Cue number + timestamp lines, e.g.:
  ```
  42
  00:01:23.456 --> 00:01:25.678
  ```
- Common filler vocalizations with word boundaries (case-insensitive), e.g. `uh`, `umm`, `ehh`, optionally followed by `, . ?` and a space
- Sequences of 3+ blank lines are collapsed to 2

Note: The list is intentionally small and conservative to avoid removing meaningful content.

### Example

Input (`.vtt` excerpt):
```text
WEBVTT

1
00:00:01.000 --> 00:00:02.000
Uh, welcome to the session.

2
00:00:03.000 --> 00:00:04.000
Um... today we'll cover basics.
```

Output:
```text
welcome to the session.
today we'll cover basics.
```

### Exit codes

- `0` on success
- `1` on errors (e.g., file not found)

### License

Apache-2.0 © Jean M. Lescure
