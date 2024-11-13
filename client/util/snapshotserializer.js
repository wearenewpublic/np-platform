import { prettyDOM } from '@testing-library/react';

// Remove attributes that tend to change unpredictably between module builds
// This helps to keep the snapshots stable
const stripNoisyAttributes = (element) => {
    if (element.nodeType === 1) {
        element.removeAttribute('class'); 
        element.removeAttribute('style'); 
        element.removeAttribute('dir');
        element.removeAttribute('virtualkeyboardpolicy'); 
    }
    Array.from(element.childNodes).forEach(stripNoisyAttributes);
};

// Jest only supports CommonJS modules, so we can't use ES6 export syntax
module.exports = {
    test: (val) => val && val.container, // Is this is a rendered component?
    print: (val, serialize) => {
        stripNoisyAttributes(val.container);
        return prettyDOM(val.container, 1000000);
    }
};

