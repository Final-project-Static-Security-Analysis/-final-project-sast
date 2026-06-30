# Search this PR for comments starting with "Allon:" - I tried to comment inline wherever I saw something.

# General and markdown issues I comment inline on:
- I don't understand the split of the "scanner" and "ui" directories. It seems like you duplicated the prompt to the 
  UI too. Why isn't the UI just invoking the scanner (or at least calling some shared logic)?
- Why is the project called "-final-project-sast" with a "-" as the first character?
- Why do you mention Python 3.11? I don't see anything here specific to 3.11
- The architecture diagram seems outdated - e.g., there's no taint analysis implemetation in the code
- For the CWE list, I'd make them all links to the MITRE site
- I'd check the screenshots in to the project too, and use relative links in the README
- Not sure I understand the `action.yml` file. Is this an exmaple on how to use the scanner? Perhaps it's worth publishing it as a reusable GitHub Action?
- I saw this in several places - it's more idiomatic to use `??` for null-ish coalescing in JS than `||`. For example, 
  `const x = a ?? b` instead of `const x = a || b`
- You mentioned the project is licensed under MIT, but I don't see a LICENSE file in the repo. You should add one.
  You can grab it from https://choosealicense.com/licenses/mit/ (just remember to fill in the year and your names)

# package.json:
- The test script is broken. If it's really not in use, just remove it
- You should align the `engines` entry with the actual Node.js version you use in the Dockerfile. Or at the very 
  least, I suggest requiring something that isn't EOL.
- The `bin` entry refers to a file that doesn't exist.
- Similarly, so does the `start` script.
