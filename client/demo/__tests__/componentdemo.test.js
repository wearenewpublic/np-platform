const { TestInstance, WithFeatures } = require("../../util/testutil")
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { pushSubscreen } from '../../util/navigate';

jest.mock("../../util/navigate");

test('Menu', async () => {
    render(<TestInstance structureKey='componentdemo' />);
    fireEvent.click(screen.getByRole('button', {name: 'Text'}));
    fireEvent.click(screen.getByRole('button', {name: 'Profile'}));

    expect(pushSubscreen).toHaveBeenCalledWith('text');
    expect(pushSubscreen).toHaveBeenNthCalledWith(2, 'profile');
});

test('Text', async () => {
    render(<TestInstance structureKey='componentdemo' screenKey='text' />);
});

test('Profile', async () => {
    render(<TestInstance structureKey='componentdemo' screenKey='profile' />);
});

test('Button', async () => {
    render(<TestInstance structureKey='componentdemo' screenKey='button' />);
});

test('Comment', async () => {
    render(<TestInstance structureKey='componentdemo' screenKey='comment' />);
});

test('Banner', async () => {
    render(<TestInstance structureKey='componentdemo' screenKey='banner' />);
});

test('Teaser', async () => {
    render(<TestInstance structureKey='componentdemo' screenKey='teaserDemo' />);
});

test('Composer', async () => {
    render(<TestInstance structureKey='componentdemo' screenKey='composer' />);
});
