
class BharatSupport {
  constructor() {
    this.form = document.querySelector('form');
    this.themeToggle = document.getElementById('theme-toggle');
    this.body = document.body;
    this.init();
  }

  init() {
    // Theme toggle
    this.loadTheme();
    this.themeToggle.addEventListener('click', () => this.toggleTheme());

    // Form handling (if you want it back later)
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    this.body.classList.toggle('theme-dark', savedTheme === 'dark');
    this.updateToggleIcon(savedTheme === 'dark');
  }

  toggleTheme() {
    const isDark = this.body.classList.contains('theme-dark');
    const newTheme = isDark ? 'light' : 'dark';
    
    this.body.classList.toggle('theme-dark');
    localStorage.setItem('theme', newTheme);
    this.updateToggleIcon(!isDark);
  }

  updateToggleIcon(isDark) {
    this.themeToggle.setAttribute('aria-label', 
      isDark ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }

async handleSubmit(e) {
  e.preventDefault();
  
  if (!this.validateForm()) return;
  this.setLoading(true);

  try {
    const formData = new FormData(this.form);
    
    // 1. Your backend (logs, validation)
    await fetch('/api/queries', {
      method: 'POST',
      body: formData
    });

    // 2. ALSO Netlify Forms (storage + email notifications)
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    });

    this.showSuccess('✅ Query sent! You’ll hear back soon.');
    this.form.reset();
  } catch (error) {
    this.showError('Submission failed. Please try again.');
  } finally {
    this.setLoading(false);
  }
}

}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  new BharatSupport();
});
