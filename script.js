class BharatSupport {
  constructor() {
    this.form = document.querySelector('form');
    this.themeToggle = document.getElementById('theme-toggle');
    this.submitBtn = document.querySelector('button[type="submit"]');
    this.body = document.body;
    this.init();
  }

  init() {
    // Theme toggle
    this.loadTheme();
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Form handling
    if (this.form && this.submitBtn) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    this.body.classList.toggle('theme-dark', savedTheme === 'dark');
  }

  toggleTheme() {
    const isDark = this.body.classList.contains('theme-dark');
    const newTheme = isDark ? 'light' : 'dark';
    
    this.body.classList.toggle('theme-dark');
    localStorage.setItem('theme', newTheme);
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    // Simple validation
    if (!this.form.checkValidity()) {
      this.showError('Please fill all required fields.');
      return;
    }

    this.setLoading(true);

    try {
      const formData = new FormData(this.form);
      
      // 1. Your backend function (logs)
      await fetch('/api/queries', {
        method: 'POST',
        body: formData
      });

      // 2. Netlify Forms (emails + storage) 
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });

      this.showSuccess('✅ Thanks! We received your query and will reply soon.');
      this.form.reset();
    } catch (error) {
      console.error('Submit error:', error);
      this.showError('Submission failed. Please try again.');
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(loading) {
    if (this.submitBtn) {
      this.submitBtn.disabled = loading;
      this.submitBtn.textContent = loading ? 'Sending...' : 'Send to support';
    }
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type) {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 4000);
    notification.querySelector('.notification-close').onclick = () => notification.remove();
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new BharatSupport();
});
