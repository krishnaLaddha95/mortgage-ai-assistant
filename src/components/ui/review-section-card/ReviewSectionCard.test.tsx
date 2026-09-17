import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ReviewSectionCard from './ReviewSectionCard';

test('renders the section title', () => {
  render(
    <ReviewSectionCard
      title="Personal information"
      onEdit={() => {}}
      fields={[]}
    />
  );
  expect(screen.getByText('Personal information')).toBeInTheDocument();
});

test('renders each field label and value', () => {
  render(
    <ReviewSectionCard
      title="Personal information"
      onEdit={() => {}}
      fields={[{ label: 'Full name', value: 'Krishna Laddha' }]}
    />
  );
  expect(screen.getByText('Full name')).toBeInTheDocument();
  expect(screen.getByText('Krishna Laddha')).toBeInTheDocument();
});

test('shows an em dash for an empty field value', () => {
  render(
    <ReviewSectionCard
      title="Employment"
      onEdit={() => {}}
      fields={[{ label: 'Employer', value: '' }]}
    />
  );
  expect(screen.getByText('—')).toBeInTheDocument();
});

test('calls onEdit when the Edit button is clicked', async () => {
  const handleEdit = jest.fn();
  render(
    <ReviewSectionCard
      title="Personal information"
      onEdit={handleEdit}
      fields={[]}
    />
  );
  await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
  expect(handleEdit).toHaveBeenCalledTimes(1);
});

test('renders children instead of a grid when fields is not provided', () => {
  render(
    <ReviewSectionCard title="Documents" onEdit={() => {}}>
      <div>ID proof: Uploaded</div>
    </ReviewSectionCard>
  );
  expect(screen.getByText('ID proof: Uploaded')).toBeInTheDocument();
});
