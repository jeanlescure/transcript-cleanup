#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { multiReplaceSync } = require('@simplyhexagonal/multi-replace');

/**
 * Expands path shortcuts like ~ to full paths
 * @param {string} filePath - The input file path
 * @returns {string} - The expanded absolute path
 */
function expandPath(filePath) {
    // Handle tilde expansion
    if (filePath.startsWith('~/')) {
        return path.join(os.homedir(), filePath.slice(2));
    }
    
    // Handle relative paths
    if (!path.isAbsolute(filePath)) {
        return path.resolve(filePath);
    }
    
    return filePath;
}

/**
 * Process the text file by removing specified regex patterns using multi-replace
 * @param {string} content - The file content
 * @returns {string} - The processed content
 */
function processContent(content) {
    // Define the replace patterns array
    // Each pattern is [matcher, replacement] where replacement is empty string to remove
    const replacePatterns = [
        // Remove WEBVTT header with newlines
        [/WEBVTT\n/g, ''],
        
        // Remove timestamp lines (number followed by timestamp)
        [/\n\d+\n.+? --> .+\n/g, ''],
        
        // Remove vocal expressions with word boundaries
        [/(^|\s)([eEaAuU][hH]+|[eEaAuU]m+)[,.\?]{0,1}\s/g, '']
    ];
    
    // Use multiReplaceSync to apply all patterns in one operation
    let processedContent = multiReplaceSync(content, replacePatterns);
    
    // Clean up any multiple consecutive newlines
    processedContent = processedContent.replace(/\n{3,}/g, '\n\n');
    
    // Trim any leading/trailing whitespace
    processedContent = processedContent.trim();
    
    return processedContent;
}

/**
 * Generate output filename with -processed suffix
 * @param {string} inputPath - The input file path
 * @returns {string} - The output file path
 */
function generateOutputPath(inputPath) {
    const parsedPath = path.parse(inputPath);
    const outputFileName = `${parsedPath.name}-processed${parsedPath.ext}`;
    return path.join(parsedPath.dir, outputFileName);
}

/**
 * Check if multi-replace package is installed
 */
function checkDependencies() {
    try {
        require('@simplyhexagonal/multi-replace');
    } catch (error) {
        console.error('Error: @simplyhexagonal/multi-replace is not installed.');
        console.error('Please install it by running:');
        console.error('npm install @simplyhexagonal/multi-replace');
        process.exit(1);
    }
}

/**
 * Main function
 */
function main() {
    // Check dependencies first
    checkDependencies();
    
    // Check if file path argument is provided
    if (process.argv.length < 3) {
        console.error('Usage: npx transcript-cleanup <path-to-text-file>');
        console.error('');
        console.error('Examples:');
        console.error('  npx transcript-cleanup ~/Documents/transcript.txt');
        console.error('  npx transcript-cleanup ./relative/path/file.txt');
        console.error('  npx transcript-cleanup /absolute/path/to/file.txt');
        process.exit(1);
    }
    
    const inputPath = process.argv[2];
    
    try {
        // Expand the path
        const expandedPath = expandPath(inputPath);
        console.log(`Processing file: ${expandedPath}`);
        
        // Check if file exists
        if (!fs.existsSync(expandedPath)) {
            throw new Error(`File not found: ${expandedPath}`);
        }
        
        // Read the file
        const content = fs.readFileSync(expandedPath, 'utf8');
        console.log(`File read successfully. Original size: ${content.length} characters`);
        
        // Process the content using multi-replace
        const processedContent = processContent(content);
        console.log(`Content processed using multi-replace. New size: ${processedContent.length} characters`);
        
        // Generate output path
        const outputPath = generateOutputPath(expandedPath);
        
        // Write the processed content
        fs.writeFileSync(outputPath, processedContent, 'utf8');
        console.log(`Processed file saved as: ${outputPath}`);
        
        // Show statistics
        const removedChars = content.length - processedContent.length;
        const reductionPercentage = content.length > 0 ? ((removedChars / content.length) * 100).toFixed(1) : 0;
        console.log(`Removed ${removedChars} characters (${reductionPercentage}% reduction)`);
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

// Run the script
main();
