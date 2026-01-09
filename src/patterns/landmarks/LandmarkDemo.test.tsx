import { render, screen, within } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { LandmarkDemo } from './LandmarkDemo';

describe('LandmarkDemo', () => {
  // 🔴 High Priority: Landmark Roles
  describe('APG: Landmark Roles', () => {
    it('has banner landmark (header)', () => {
      render(<LandmarkDemo />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('has navigation landmark (nav)', () => {
      render(<LandmarkDemo />);
      expect(screen.getAllByRole('navigation').length).toBeGreaterThanOrEqual(1);
    });

    it('has main landmark (main)', () => {
      render(<LandmarkDemo />);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('has contentinfo landmark (footer)', () => {
      render(<LandmarkDemo />);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('has complementary landmark (aside)', () => {
      render(<LandmarkDemo />);
      expect(screen.getByRole('complementary')).toBeInTheDocument();
    });

    it('has region landmark with label (section[aria-labelledby])', () => {
      render(<LandmarkDemo />);
      const region = screen.getByRole('region');
      expect(region).toBeInTheDocument();
      // Region must have accessible name
      expect(region).toHaveAccessibleName();
    });

    it('has search landmark (form[role="search"])', () => {
      render(<LandmarkDemo />);
      expect(screen.getByRole('search')).toBeInTheDocument();
    });

    it('has form landmark with label', () => {
      render(<LandmarkDemo />);
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
      // Form landmark must have accessible name
      expect(form).toHaveAccessibleName();
    });

    it('has exactly one main landmark', () => {
      render(<LandmarkDemo />);
      expect(screen.getAllByRole('main')).toHaveLength(1);
    });

    it('has exactly one banner landmark', () => {
      render(<LandmarkDemo />);
      expect(screen.getAllByRole('banner')).toHaveLength(1);
    });

    it('has exactly one contentinfo landmark', () => {
      render(<LandmarkDemo />);
      expect(screen.getAllByRole('contentinfo')).toHaveLength(1);
    });
  });

  // 🔴 High Priority: Landmark Labeling
  describe('APG: Landmark Labeling', () => {
    it('navigation landmarks have unique labels when multiple', () => {
      render(<LandmarkDemo />);
      const navs = screen.getAllByRole('navigation');
      if (navs.length > 1) {
        const labels = navs.map(
          (nav) => nav.getAttribute('aria-label') || nav.getAttribute('aria-labelledby')
        );
        const uniqueLabels = new Set(labels.filter(Boolean));
        expect(uniqueLabels.size).toBe(navs.length);
      }
    });

    it('region landmark has accessible name', () => {
      render(<LandmarkDemo />);
      const region = screen.getByRole('region');
      // Check for aria-label or aria-labelledby
      const hasLabel = region.hasAttribute('aria-label') || region.hasAttribute('aria-labelledby');
      expect(hasLabel).toBe(true);
    });

    it('form landmark has accessible name', () => {
      render(<LandmarkDemo />);
      const form = screen.getByRole('form');
      // Check for aria-label or aria-labelledby
      const hasLabel = form.hasAttribute('aria-label') || form.hasAttribute('aria-labelledby');
      expect(hasLabel).toBe(true);
    });

    it('search landmark has accessible name', () => {
      render(<LandmarkDemo />);
      const search = screen.getByRole('search');
      // Check for aria-label or aria-labelledby
      const hasLabel = search.hasAttribute('aria-label') || search.hasAttribute('aria-labelledby');
      expect(hasLabel).toBe(true);
    });

    it('complementary landmark has accessible name', () => {
      render(<LandmarkDemo />);
      const aside = screen.getByRole('complementary');
      // Check for aria-label or aria-labelledby
      const hasLabel = aside.hasAttribute('aria-label') || aside.hasAttribute('aria-labelledby');
      expect(hasLabel).toBe(true);
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe-core violations', async () => {
      const { container } = render(<LandmarkDemo />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟢 Low Priority: Props
  describe('Props', () => {
    it('applies className to container', () => {
      render(<LandmarkDemo className="custom-class" data-testid="landmark-demo" />);
      const container = screen.getByTestId('landmark-demo');
      expect(container).toHaveClass('custom-class');
    });

    it('shows landmark labels when showLabels is true', () => {
      render(<LandmarkDemo showLabels data-testid="landmark-demo" />);
      // When showLabels is true, landmark labels should be visible
      // Check for label overlay elements
      expect(screen.getByText('banner')).toBeInTheDocument();
      expect(screen.getByText('main')).toBeInTheDocument();
      expect(screen.getByText('contentinfo')).toBeInTheDocument();
    });
  });

  // 🟢 Low Priority: Semantic Structure
  describe('Semantic Structure', () => {
    it('uses semantic HTML elements', () => {
      const { container } = render(<LandmarkDemo />);
      expect(container.querySelector('header')).toBeInTheDocument();
      expect(container.querySelector('nav')).toBeInTheDocument();
      expect(container.querySelector('main')).toBeInTheDocument();
      expect(container.querySelector('footer')).toBeInTheDocument();
      expect(container.querySelector('aside')).toBeInTheDocument();
      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('main contains primary content area', () => {
      render(<LandmarkDemo />);
      const main = screen.getByRole('main');
      // Main should contain the region and complementary landmarks
      expect(within(main).getByRole('region')).toBeInTheDocument();
      expect(within(main).getByRole('complementary')).toBeInTheDocument();
    });
  });
});
