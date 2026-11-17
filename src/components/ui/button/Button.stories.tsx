import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: 'Continue', color: 'primary' },
};
export const Secondary: Story = {
  args: { children: 'Back', color: 'secondary' },
};
export const Disabled: Story = {
  args: { children: 'Continue', disabled: true },
};