import { getChatErrorMessage } from './getChatErrorMessage';

test('returns a connection message when there is no status', () => {
  expect(getChatErrorMessage()).toContain("Couldn't reach the assistant");
});

test('returns a busy message for 429', () => {
  expect(getChatErrorMessage(429)).toContain('busy');
});

test('returns a generic message for 500', () => {
  expect(getChatErrorMessage(500)).toContain('Something went wrong');
});

test('returns the generic message for other client errors too', () => {
  expect(getChatErrorMessage(400)).toContain('Something went wrong');
});

test('returns a timeout message', () => {
  expect(getChatErrorMessage('timeout')).toContain('too long');
});

test('returns an empty-answer message', () => {
  expect(getChatErrorMessage('empty')).toContain("didn't return an answer");
});

test('returns a busy message for 503', () => {
  expect(getChatErrorMessage(503)).toContain('busy');
});