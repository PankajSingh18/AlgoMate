import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResponsiveControls } from '@/app/visualizer/components/ResponsiveControls';

describe('ResponsiveControls', () => {
  it('renders children and is expanded by default', () => {
    render(
      <ResponsiveControls defaultExpanded={true}>
        <div data-testid="child-content">Child Content</div>
      </ResponsiveControls>
    );
    
    // The child should be in the document
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    
    // The toggle button should show "Hide Controls" initially
    const toggleButton = screen.getByRole('button', { name: /hide controls/i });
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    
    // The controls container should not have "hidden" class (it has "block" when expanded)
    const controlsContainer = document.getElementById('mobile-visualizer-controls');
    expect(controlsContainer).toBeInTheDocument();
    expect(controlsContainer.className).toContain('block');
    expect(controlsContainer.className).not.toContain('hidden');
  });

  it('toggles visibility when the button is clicked', () => {
    render(
      <ResponsiveControls defaultExpanded={true}>
        <div data-testid="child-content">Child Content</div>
      </ResponsiveControls>
    );

    const toggleButton = screen.getByRole('button', { name: /hide controls/i });
    
    // Click to collapse
    fireEvent.click(toggleButton);
    
    // The button text should change to "Show Controls"
    const newToggleButton = screen.getByRole('button', { name: /show controls/i });
    expect(newToggleButton).toBeInTheDocument();
    expect(newToggleButton).toHaveAttribute('aria-expanded', 'false');
    
    // The controls container should now have "hidden" class
    const controlsContainer = document.getElementById('mobile-visualizer-controls');
    expect(controlsContainer.className).toContain('hidden');
    
    // Click again to expand
    fireEvent.click(newToggleButton);
    
    // Should revert back to Hide Controls
    const expandedButton = screen.getByRole('button', { name: /hide controls/i });
    expect(expandedButton).toBeInTheDocument();
    expect(expandedButton).toHaveAttribute('aria-expanded', 'true');
    expect(controlsContainer.className).toContain('block');
  });

  it('starts collapsed if defaultExpanded is false', () => {
    render(
      <ResponsiveControls defaultExpanded={false}>
        <div data-testid="child-content">Child Content</div>
      </ResponsiveControls>
    );

    const toggleButton = screen.getByRole('button', { name: /show controls/i });
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    
    const controlsContainer = document.getElementById('mobile-visualizer-controls');
    expect(controlsContainer.className).toContain('hidden');
  });
});
