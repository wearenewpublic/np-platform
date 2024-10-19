import JSON5 from 'json5';

// We need this function to extract JSON from LLM responses that are not well-formed JSON
// GPT shouldn't need this any more since they added JSON mode, but other LLMs often do.

function extractAndParseJSON(text) {
    // Find JSON pattern using regular expression
    const jsonPattern = /{[^{}]*}|(\[[^\[\]]*\])/g;

    // Extract JSON from the text
    const jsonMatch = text.match(jsonPattern);
    
    // If no match found, return null
    if (!jsonMatch) {
        return null;
    } else {
        try {
            return JSON5.parse(jsonMatch[0]);
        } catch (e) {
            const fixedJson = fixUnescapedQuotes(jsonMatch[0]);
            return JSON5.parse(fixedJson);
        }
    }
}
export {extractAndParseJSON};

// LLMs often return JSON with unescaped quotes, which is not valid JSON
// We fix it by looking if the next tokens what you'd expect if this was 
// the end of a string in a dictonary. If not, we escape the quote.
function fixUnescapedQuotes(badJson) {
    var goodJson = "";
    var inQuote = false;
    for (var i = 0; i < badJson.length; i++) {
        var char = badJson[i];
        if (char == '"') {
            if (inQuote) {
                const next = nextNonWhitespace(badJson, i+1);
                if ([':', '}', ']'].includes(next)) {
                    goodJson += '"';
                    inQuote = false;
                } else if (next == ',') {
                    const nextNonComma = nextNonWhitespaceNonComma(badJson, i+1);
                    if (['"', '}', ']'].includes(nextNonComma)) {
                        goodJson += '"';
                        inQuote = false;
                    } else {
                        goodJson += '\\"';
                    }
                } else {
                    goodJson += '\\"';
                }
            } else {
                goodJson += '"';
                inQuote = true;
            }
        } else {
            goodJson += char;
        }
    }
    return goodJson;
}

function nextNonWhitespace(str, i) {
    while (i < str.length && (str[i] == ' ' || str[i] == '\n')) {
        i++;
    }
    return str[i];
}

function nextNonWhitespaceNonComma(str, i) {
    while (i < str.length && (str[i] == ' ' || str[i] == '\n' || str[i] == ',')) {
        i++;
    }
    return str[i];
}
