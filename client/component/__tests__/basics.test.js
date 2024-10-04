import { act, render, screen } from "@testing-library/react";
import { LoadingScreen } from "../basics";
import { Datastore } from "../../util/datastore";

jest.useFakeTimers();

test('LoadingScreen', async () => {
    await act(async () => {
        render(<Datastore><LoadingScreen /></Datastore>);
    });
    await act(async () => {
        jest.runAllTimers()
    });;
    screen.getByText('Loading...');
});