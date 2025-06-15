import React from 'react';
import { render, screen } from '@testing-library/react';
import { EditorApp } from './component';

describe('EditorApp', () => {
  it('renders the main editor application', () => {
    render(<EditorApp />);
    
    // Check if the main application container is rendered
    const editorContainer = screen.getByRole('application', { name: /react component editor/i });
    expect(editorContainer).toBeInTheDocument();
  });

  it('contains the toolbar', () => {
    render(<EditorApp />);
    
    // Check if toolbar is present
    const toolbar = screen.getByRole('toolbar', { name: /editor toolbar/i });
    expect(toolbar).toBeInTheDocument();
  });

  it('contains the canvas', () => {
    render(<EditorApp />);
    
    // Check if canvas is present (the actual canvas element)
    const canvas = screen.getByRole('img', { name: /design canvas/i });
    expect(canvas).toBeInTheDocument();
  });
});
