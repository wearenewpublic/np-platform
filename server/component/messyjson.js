const JSON5 = require('json5');

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
            console.log('failed to parse', jsonMatch[0]);
            const fixedJson = fixUnescapedQuotes(jsonMatch[0]);
            console.log('Trying with fixed JSON', fixedJson);
            return JSON5.parse(fixedJson);
        }
    }
}
exports.extractAndParseJSON = extractAndParseJSON;

function fixUnescapedQuotes(badJson) {
    var goodJson = "";
    var inQuote = false;
    for (var i = 0; i < badJson.length; i++) {
        var char = badJson[i];
        if (char == '"') {
            if (inQuote) {
                const next = nextNonWhitespace(badJson, i+1);
                console.log('next', next);
                if ([':', '}', ']'].includes(next)) {
                    goodJson += '"';
                    inQuote = false;
                } else if (next == ',') {
                    const nextNonComma = nextNonWhitespaceNonComma(badJson, i+1);
                    console.log('noncomma', nextNonComma);
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
