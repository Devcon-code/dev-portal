class DevPortal {
    constructor() {
        this.form = document.querySelector('form');
        this.submitBtn = document.querySelector('button[type="submit"]');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time form validation
        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });

        // Add loading state to navbar for polish
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) return;

        this.setLoading(true);

        try {
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);

            const response = await fetch('/api/queries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                this.showSuccess(result.message);
                this.form.reset();
            } else {
                this.showError('Submission failed. Please try again.');
            }
        } catch (error) {
            console.error('Submit error:', error);
            this.showError('Network error. Is the server running?');
        } finally {
            this.setLoading(false);
        }
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name || field.id;

        if (!value) {
            this.showFieldError(field, `${this.getFieldLabel(fieldName)} is required`);
            return false;
        }

        if (field.type === 'email' && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Please enter a valid email');
            return false;
        }

        this.clearFieldError(field);
        return true;
    }

    validateForm() {
        let isValid = true;
        this.form.querySelectorAll('input[required], textarea[required]').forEach(field => {
            if (!this.validateField(field)) isValid = false;
        });
        return isValid;
    }

    getFieldLabel(name) {
        const labels = {
            name: 'Name',
            email: 'Email',
            product: 'Product',
            details: 'Details'
        };
        return labels[name] || name;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showFieldError(field, message) {
        let errorEl = field.parentElement.querySelector('.error-message');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'error-message';
            field.parentElement.appendChild(errorEl);
        }
        errorEl.textContent = message;
        errorEl.style.color = '#f87171';
        field.classList.add('error');
    }

    clearFieldError(field) {
        const errorEl = field.parentElement.querySelector('.error-message');
        if (errorEl) errorEl.remove();
        field.classList.remove('error');
    }

    setLoading(loading) {
        this.submitBtn.disabled = loading;
        this.submitBtn.textContent = loading ? 'Sending...' : 'Send query';
        this.submitBtn.classList.toggle('loading', loading);
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

        // Auto remove after 4s
        setTimeout(() => notification.remove(), 4000);

        // Close button
        notification.querySelector('.notification-close').onclick = () => notification.remove();
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    new DevPortal();
});
