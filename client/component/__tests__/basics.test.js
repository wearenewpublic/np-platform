const { render, screen, fireEvent } = require("@testing-library/react");
const { HoverView, Center } = require("../basics");
const { UtilityText } = require("../text");

test('Hoveriew Accessibility Label', () => {
    render(<HoverView ariaLabel='test' onPress={()=>{}}><UtilityText label='Label'/></HoverView>);
    screen.getByLabelText('test');
})

test('Center', () => {
    render(<Center><UtilityText label='Label'/></Center>);  
})



