import { cn } from '@/lib/utils';

export interface LandmarkDemoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show landmark labels overlay */
  showLabels?: boolean;
}

/**
 * LandmarkDemo - Demonstrates the 8 ARIA landmark roles
 *
 * This component visualizes proper landmark structure for educational purposes.
 * It demonstrates:
 * - banner (header)
 * - navigation (nav)
 * - main
 * - contentinfo (footer)
 * - complementary (aside)
 * - region (section with label)
 * - search (form with role="search")
 * - form (form with label)
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/
 */
export const LandmarkDemo: React.FC<LandmarkDemoProps> = ({
  showLabels = false,
  className,
  ...props
}) => {
  return (
    <div className={cn('apg-landmark-demo', className)} {...props}>
      {/* Banner Landmark */}
      <header className="apg-landmark-banner">
        <LandmarkLabel label="banner" visible={showLabels} />
        <div className="apg-landmark-content">
          <span className="apg-landmark-logo">Site Logo</span>
          {/* Navigation Landmark (Main) */}
          <nav aria-label="Main" className="apg-landmark-navigation">
            <LandmarkLabel label="navigation" visible={showLabels} />
            <ul className="apg-landmark-nav-list">
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Landmark */}
      <main className="apg-landmark-main">
        <LandmarkLabel label="main" visible={showLabels} />
        <div className="apg-landmark-main-content">
          {/* Region Landmark */}
          <section aria-labelledby="content-heading" className="apg-landmark-region">
            <LandmarkLabel label="region" visible={showLabels} />
            <h2 id="content-heading" className="apg-landmark-heading">
              Main Content
            </h2>
            <p>
              This section demonstrates the <code>region</code> landmark. A section element only
              becomes a region landmark when it has an accessible name via{' '}
              <code>aria-labelledby</code> or <code>aria-label</code>.
            </p>

            {/* Search Landmark */}
            <form role="search" aria-label="Site search" className="apg-landmark-search">
              <LandmarkLabel label="search" visible={showLabels} />
              <label htmlFor="search-input" className="apg-landmark-search-label">
                Search
              </label>
              <input
                type="search"
                id="search-input"
                className="apg-landmark-search-input"
                placeholder="Search..."
              />
              <button type="submit" className="apg-landmark-search-button">
                Search
              </button>
            </form>

            {/* Form Landmark */}
            <form aria-label="Contact form" className="apg-landmark-form">
              <LandmarkLabel label="form" visible={showLabels} />
              <div className="apg-landmark-form-field">
                <label htmlFor="name-input">Name</label>
                <input type="text" id="name-input" className="apg-landmark-input" />
              </div>
              <div className="apg-landmark-form-field">
                <label htmlFor="email-input">Email</label>
                <input type="email" id="email-input" className="apg-landmark-input" />
              </div>
              <button type="submit" className="apg-landmark-submit">
                Submit
              </button>
            </form>
          </section>

          {/* Complementary Landmark */}
          <aside aria-label="Related content" className="apg-landmark-complementary">
            <LandmarkLabel label="complementary" visible={showLabels} />
            <h2 className="apg-landmark-heading">Related</h2>
            <ul>
              <li>
                <a href="#related1">Related Link 1</a>
              </li>
              <li>
                <a href="#related2">Related Link 2</a>
              </li>
            </ul>
          </aside>
        </div>
      </main>

      {/* Contentinfo Landmark */}
      <footer className="apg-landmark-contentinfo">
        <LandmarkLabel label="contentinfo" visible={showLabels} />
        <div className="apg-landmark-content">
          {/* Navigation Landmark (Footer) */}
          <nav aria-label="Footer" className="apg-landmark-navigation">
            <LandmarkLabel label="navigation" visible={showLabels} />
            <ul className="apg-landmark-nav-list">
              <li>
                <a href="#privacy">Privacy</a>
              </li>
              <li>
                <a href="#terms">Terms</a>
              </li>
              <li>
                <a href="#sitemap">Sitemap</a>
              </li>
            </ul>
          </nav>
          <p className="apg-landmark-copyright">&copy; 2024 Example Site</p>
        </div>
      </footer>
    </div>
  );
};

/** Landmark label overlay component */
const LandmarkLabel: React.FC<{ label: string; visible: boolean }> = ({ label, visible }) => {
  return (
    <span className={cn('apg-landmark-label', !visible && 'hidden')} aria-hidden="true">
      {label}
    </span>
  );
};

export default LandmarkDemo;
