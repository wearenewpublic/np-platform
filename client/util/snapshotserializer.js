import { prettyDOM } from '@testing-library/react';

const stripClassNames = (element) => {
    if (element.nodeType === 1) { // Check if it's an element node
        element.removeAttribute('class'); // Remove the class attribute
        element.removeAttribute('style'); // Remove the style attribute 
    }
    // Recursively remove classNames from child nodes
    Array.from(element.childNodes).forEach(stripClassNames);
};

module.exports = {
    test: (val) => val && val.container, // Check if the value is a rendered component with a container
    print: (val, serialize) => {
        // Strip class names from the container
        stripClassNames(val.container);

        // Use prettyDOM to get a string representation of the modified DOM
        const formattedOutput = prettyDOM(val.container);

        // Return the formatted output for the snapshot
        return formattedOutput;
    }
};


export function test (val) {
    console.log('test', val);
    return val?.baseElement && val?.container;
    // return true;
    // console.log('test', val.$$typeof);
    // return val && val.$$typeof === Symbol.for('react.test.json');
}

export function print (val, serialize) {
    return serialize(prettyDOM(stripClassNames(val.container)));
}
