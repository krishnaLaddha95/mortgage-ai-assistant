import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { children: 'Continue', variant: 'primary' } };
export const Secondary: Story = { args: { children: 'Back', variant: 'secondary' } };
export const Disabled: Story = { args: { children: 'Continue', disabled: true } };