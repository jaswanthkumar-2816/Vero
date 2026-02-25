const fs = require('fs');
let pdf = require('pdf-parse');
// Handle possible ESM interop issues
if (typeof pdf !== 'function' && pdf.default) pdf = pdf.default;

const mammoth = require('mammoth');
const path = require('path');

const extractTextFromFile = async (filePath) => {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.pdf') {
        try {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            return data.text;
        } catch (err) {
            console.error("PDF Parse Error:", err);
            return "Error extracting PDF text.";
        }
    } else if (ext === '.docx' || ext === '.doc') {
        try {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        } catch (err) {
            console.error("Docx Parse Error:", err);
            return "Error extracting DOCX text.";
        }
    } else if (ext === '.txt' || ext === '.md') {
        try {
            return fs.readFileSync(filePath, 'utf8');
        } catch (err) {
            console.error("Text Read Error:", err);
            return "Error reading text file.";
        }
    } else {
        // Fallback: try reading as text
        try {
            return fs.readFileSync(filePath, 'utf8');
        } catch (e) {
            throw new Error('Unsupported file format');
        }
    }
};

module.exports = { extractTextFromFile };
