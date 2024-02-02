const { TestInstance } = require("../../util/testutil")
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

test('Menu', async () => {
    render(<TestInstance structureKey='componentdemo' />);
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

test('Feature', async () => {
    render(<TestInstance structureKey='componentdemo' screenKey='feature' />);
});

test('Teaser', async () => {
    render(<TestInstance structureKey='componentdemo' screenKey='teaserDemo' />);
});

test('Composer', async () => {
    render(<TestInstance structureKey='componentdemo' screenKey='composer' />);
});
