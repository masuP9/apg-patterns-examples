<script lang="ts">
  /**
   * LandmarkDemo - Demonstrates the 8 ARIA landmark roles
   *
   * This component visualizes proper landmark structure for educational purposes.
   *
   * @see https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/
   */

  /** Show landmark labels overlay */
  export let showLabels: boolean = false;
  let className: string = '';
  export { className as class };
</script>

<div class="apg-landmark-demo {className}" {...$$restProps}>
  <!-- Banner Landmark -->
  <header class="apg-landmark-banner">
    <span class="apg-landmark-label" class:hidden={!showLabels} aria-hidden="true">banner</span>
    <div class="apg-landmark-content">
      <span class="apg-landmark-logo">Site Logo</span>
      <!-- Navigation Landmark (Main) -->
      <nav aria-label="Main" class="apg-landmark-navigation">
        <span class="apg-landmark-label" class:hidden={!showLabels} aria-hidden="true"
          >navigation</span
        >
        <ul class="apg-landmark-nav-list">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <!-- Main Landmark -->
  <main class="apg-landmark-main">
    <span class="apg-landmark-label" class:hidden={!showLabels} aria-hidden="true">main</span>
    <div class="apg-landmark-main-content">
      <!-- Region Landmark -->
      <section aria-labelledby="content-heading" class="apg-landmark-region">
        <span class="apg-landmark-label" class:hidden={!showLabels} aria-hidden="true">region</span>
        <h2 id="content-heading" class="apg-landmark-heading">Main Content</h2>
        <p>
          This section demonstrates the <code>region</code> landmark. A section element only becomes
          a region landmark when it has an accessible name via
          <code>aria-labelledby</code> or <code>aria-label</code>.
        </p>

        <!-- Search Landmark -->
        <form role="search" aria-label="Site search" class="apg-landmark-search">
          <span class="apg-landmark-label" class:hidden={!showLabels} aria-hidden="true"
            >search</span
          >
          <label for="search-input" class="apg-landmark-search-label">Search</label>
          <input
            type="search"
            id="search-input"
            class="apg-landmark-search-input"
            placeholder="Search..."
          />
          <button type="submit" class="apg-landmark-search-button">Search</button>
        </form>

        <!-- Form Landmark -->
        <form aria-label="Contact form" class="apg-landmark-form">
          <span class="apg-landmark-label" class:hidden={!showLabels} aria-hidden="true">form</span>
          <div class="apg-landmark-form-field">
            <label for="name-input">Name</label>
            <input type="text" id="name-input" class="apg-landmark-input" />
          </div>
          <div class="apg-landmark-form-field">
            <label for="email-input">Email</label>
            <input type="email" id="email-input" class="apg-landmark-input" />
          </div>
          <button type="submit" class="apg-landmark-submit">Submit</button>
        </form>
      </section>

      <!-- Complementary Landmark -->
      <aside aria-label="Related content" class="apg-landmark-complementary">
        <span class="apg-landmark-label" class:hidden={!showLabels} aria-hidden="true"
          >complementary</span
        >
        <h2 class="apg-landmark-heading">Related</h2>
        <ul>
          <li><a href="#related1">Related Link 1</a></li>
          <li><a href="#related2">Related Link 2</a></li>
        </ul>
      </aside>
    </div>
  </main>

  <!-- Contentinfo Landmark -->
  <footer class="apg-landmark-contentinfo">
    <span class="apg-landmark-label" class:hidden={!showLabels} aria-hidden="true">contentinfo</span
    >
    <div class="apg-landmark-content">
      <!-- Navigation Landmark (Footer) -->
      <nav aria-label="Footer" class="apg-landmark-navigation">
        <span class="apg-landmark-label" class:hidden={!showLabels} aria-hidden="true"
          >navigation</span
        >
        <ul class="apg-landmark-nav-list">
          <li><a href="#privacy">Privacy</a></li>
          <li><a href="#terms">Terms</a></li>
          <li><a href="#sitemap">Sitemap</a></li>
        </ul>
      </nav>
      <p class="apg-landmark-copyright">&copy; 2024 Example Site</p>
    </div>
  </footer>
</div>
