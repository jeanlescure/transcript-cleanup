import fs from 'node:fs';
import path from 'node:path';
import { diffLines } from 'diff';

// Import the processContent function - we need to use require for CommonJS module
const { processContent } = require('../bin/transcript-cleanup.js');

const diffHelper = (expectedContent: string, processedContent: string) => {
  const diffs = diffLines(expectedContent, processedContent);
  const diffOutput = [];
  if (diffs.some(part => part.added || part.removed)) {
    diffOutput.push('\n=== DIFF (Expected vs Processed) ===');
    for (const part of diffs) {
      const prefix = part.added ? '+' : part.removed ? '-' : ' ';
      const lines = part.value.split('\n');
      for (const line of lines) {
        if (line) {
          diffOutput.push(`${prefix} ${JSON.stringify(line)}`);
        }
      }
    }
  }

  console.log(diffOutput.join('\n'));
};


describe('transcript-cleanup', () => {
  it('should clean up basic VTT transcript and match expected output', () => {
    // Load input fixture
    const inputPath = path.join(__dirname, 'fixtures', 'basic.vtt');
    const inputContent = fs.readFileSync(inputPath, 'utf8');
    
    // Load expected output fixture
    const expectedPath = path.join(__dirname, 'fixtures', 'basic-expected-output.vtt');
    const expectedContent = fs.readFileSync(expectedPath, 'utf8');
    
    // Process the input
    const processedContent = processContent(inputContent);
    
    // Show diff regardless of match status
    diffHelper(expectedContent, processedContent);
    
    expect(processedContent).toBe(expectedContent);
  });

  it('should clean up teams VTT transcript with speaker tags and match expected output', () => {
    // Load input fixture
    const inputPath = path.join(__dirname, 'fixtures', 'teams.vtt');
    const inputContent = fs.readFileSync(inputPath, 'utf8');
    
    // Load expected output fixture
    const expectedPath = path.join(__dirname, 'fixtures', 'teams-expected-output.vtt');
    const expectedContent = fs.readFileSync(expectedPath, 'utf8');
    
    // Process the input
    const processedContent = processContent(inputContent);
    
    // Show diff regardless of match status
    diffHelper(expectedContent, processedContent);
    
    expect(processedContent).toBe(expectedContent);
  });
});
