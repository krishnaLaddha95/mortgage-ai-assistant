import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import '@testing-library/jest-dom';
import FileUpload from './FileUpload';

function makeFile(name: string, sizeInBytes: number, type = 'application/pdf') {
  const file = new File(['a'.repeat(sizeInBytes)], name, { type });
  return file;
}

function ControlledFileUpload({ value: initialValue, ...rest }: Partial<React.ComponentProps<typeof FileUpload>>) {
  const [files, setFiles] = useState<File[]>(initialValue ?? []);
  return <FileUpload label="Upload ID proof" {...rest} value={files} onChange={setFiles} />;
}

test('renders label and upload prompt', () => {
  render(<ControlledFileUpload />);
  expect(screen.getByText('Upload ID proof')).toBeInTheDocument();
  expect(screen.getByText(/Click to upload/)).toBeInTheDocument();
});

test('adds a file via the hidden input', async () => {
  render(<ControlledFileUpload />);
  const file = makeFile('passport.pdf', 1000);
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;

  await userEvent.upload(input, file);

  expect(screen.getByText(/passport\.pdf/)).toBeInTheDocument();
});

test('removes a file when Remove is clicked', async () => {
  render(<ControlledFileUpload />);
  const file = makeFile('passport.pdf', 1000);
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;

  await userEvent.upload(input, file);
  expect(screen.getByText(/passport\.pdf/)).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: /Remove passport.pdf/i }));
  expect(screen.queryByText(/passport\.pdf/)).not.toBeInTheDocument();
});

test('shows an error when file exceeds max size', async () => {
  render(<ControlledFileUpload maxSizeMB={1} />);
  const bigFile = makeFile('large.pdf', 2 * 1024 * 1024); // 2MB
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;

  await userEvent.upload(input, bigFile);

  expect(screen.getByRole('alert')).toHaveTextContent(/exceeds the 1MB limit/);
  expect(screen.queryByRole('button', { name: /Remove large.pdf/i })).not.toBeInTheDocument();
});

test('shows required asterisk', () => {
  render(<ControlledFileUpload required />);
  expect(screen.getByText('*')).toBeInTheDocument();
});

test('shows helper text when there is no error', () => {
  render(<ControlledFileUpload helperText="PDF only, max 10MB" />);
  expect(screen.getByText('PDF only, max 10MB')).toBeInTheDocument();
});

test('does not open file dialog when disabled', () => {
  render(<ControlledFileUpload disabled />);
  const dropzone = screen.getByRole('button');
  expect(dropzone).toHaveAttribute('tabIndex', '-1');
});

test('supports multiple files when multiple is true', async () => {
  render(<ControlledFileUpload multiple />);
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;

  await userEvent.upload(input, makeFile('doc1.pdf', 500));
  await userEvent.upload(input, makeFile('doc2.pdf', 500));

  expect(screen.getByText(/doc1\.pdf/)).toBeInTheDocument();
  expect(screen.getByText(/doc2\.pdf/)).toBeInTheDocument();
});

test('handles drag and drop', () => {
  render(<ControlledFileUpload />);
  const dropzone = screen.getByRole('button');
  const file = makeFile('dropped.pdf', 500);

  fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

  expect(screen.getByText(/dropped\.pdf/)).toBeInTheDocument();
});