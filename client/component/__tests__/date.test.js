import { formatDate, formatMiniDate } from "../date";

beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-02-02 12:30'));
});

test('formatDate', () => {
    expect(formatDate(new Date('2024-02-02 12:30'))).toBe('Just now');
    expect(formatDate(new Date('2024-02-02 12:29'))).toBe('1 minute ago');
    expect(formatDate(new Date('2024-02-02 12:00'))).toBe('30 minutes ago');
    expect(formatDate(new Date('2024-02-02 11:30'))).toBe('1 hour ago');
    expect(formatDate(new Date('2024-02-02 10:30'))).toBe('2 hours ago');
    expect(formatDate(new Date('2024-02-01 12:30'))).toBe('1 day ago');
    expect(formatDate(new Date('2024-01-30 12:30'))).toBe('3 days ago');
    expect(formatDate(new Date('2024-01-02 12:30'))).toBe('Jan 2');
    expect(formatDate(new Date('2023-01-02 12:30'))).toBe('Jan 2, 2023');
    expect(formatDate(new Date('not a date'))).toBe('');
});

test('formatMiniDate', () => {
    expect(formatMiniDate(new Date('2024-02-02 12:30'))).toBe('now');
    expect(formatMiniDate(new Date('2024-02-02 12:29'))).toBe('1m');
    expect(formatMiniDate(new Date('2024-02-02 12:00'))).toBe('30m');
    expect(formatMiniDate(new Date('2024-02-02 11:30'))).toBe('1h');
    expect(formatMiniDate(new Date('2024-02-02 10:30'))).toBe('2h');
    expect(formatMiniDate(new Date('2024-02-01 12:30'))).toBe('1d');
    expect(formatMiniDate(new Date('2024-01-30 12:30'))).toBe('3d');
    expect(formatMiniDate(new Date('2024-01-02 12:30'))).toBe('31d');
    expect(formatMiniDate(new Date('2023-01-02 12:30'))).toBe('1y');
    expect(formatDate(new Date('not a date'))).toBe('');
});

afterAll(() => {
    jest.useRealTimers();
});
  