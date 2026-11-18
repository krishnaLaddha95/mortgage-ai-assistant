import { render, screen,waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import '@testing-library/jest-dom';
import ChatPanel from './chatPanel';

function okResponse(chunks: string[]) {
  return {
    ok: true,
    status: 200,
    body: {
      getReader: () => {
        let index = 0;
        return {
          read: async () => {
            if (index < chunks.length) {
              const value = new TextEncoder().encode(chunks[index]);
              index++;
              return { done: false, value };
            }
            return { done: true, value: undefined };
          },
        };
      },
    },
  };
}

async function openAndSend(text = 'Hi') {
  render(<ChatPanel currentStep={0} formData={{}} />);
  await userEvent.click(screen.getByRole('button', { name: 'Open AI assistant' }));
  await userEvent.type(screen.getByPlaceholderText('Ask a question...'), text);
  await userEvent.click(screen.getByRole('button', { name: 'Send' }));
}

test('has no accessibility violations when collapsed', async () => {
  const { container } = render(<ChatPanel currentStep={0} formData={{}} />);
  expect(await axe(container)).toHaveNoViolations();
});

test('has no accessibility violations when open', async () => {
  const { container } = render(<ChatPanel currentStep={0} formData={{}} />);
  await userEvent.click(screen.getByRole('button', { name: 'Open AI assistant' }));
  expect(await axe(container)).toHaveNoViolations();
});

test('streams the reply into the chat', async () => {
  global.fetch = jest.fn().mockResolvedValue(okResponse(['Hello', ' there', '!']));
  await openAndSend('Hi');
  expect(await screen.findByText('Hello there!')).toBeInTheDocument();
});

test('shows a connection error when the network request fails', async () => {
  global.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));
  await openAndSend();
  expect(await screen.findByRole('alert')).toHaveTextContent(/couldn't reach the assistant/i);
});

test('shows a busy message for 429', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 429, body: null });
  await openAndSend();
  expect(await screen.findByRole('alert')).toHaveTextContent(/busy/i);
});

test('shows a busy message for 503', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 503, body: null });
  await openAndSend();
  expect(await screen.findByRole('alert')).toHaveTextContent(/busy/i);
});

test('shows a generic message for 502', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 502, body: null });
  await openAndSend();
  expect(await screen.findByRole('alert')).toHaveTextContent(/something went wrong/i);
});

test('shows a message instead of a blank bubble when the answer is empty', async () => {
  global.fetch = jest.fn().mockResolvedValue(okResponse([]));
  await openAndSend();
  expect(await screen.findByRole('alert')).toHaveTextContent(/didn't return an answer/i);
});

test('keeps the partial text and shows an error when the stream breaks midway', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    body: {
      getReader: () => {
        let sent = false;
        return {
          read: async () => {
            if (!sent) {
              sent = true;
              return { done: false, value: new TextEncoder().encode('Partial answer') };
            }
            throw new Error('stream broke');
          },
        };
      },
    },
  });
  await openAndSend();
  expect(await screen.findByText(/Partial answer/)).toBeInTheDocument();
  expect(await screen.findByRole('alert')).toBeInTheDocument();
});

test('re-enables the input after a failure', async () => {
  global.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));
  await openAndSend();
  await screen.findByRole('alert');
  await waitFor(() =>
    expect(screen.getByPlaceholderText('Ask a question...')).toBeEnabled()
  );
});

test('Try again resends the last message and shows the reply', async () => {
  global.fetch = jest
    .fn()
    .mockRejectedValueOnce(new TypeError('Failed to fetch'))
    .mockResolvedValueOnce(okResponse(['Here', ' you go']));

  await openAndSend('Hello');
  await userEvent.click(await screen.findByRole('button', { name: 'Try again' }));

  expect(await screen.findByText(/Here you go/)).toBeInTheDocument();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledTimes(2);
});