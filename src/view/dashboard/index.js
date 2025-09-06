// Copy to clipboard functionality
function copyToClipboard(text) {
  const fullUrl = window.location.origin + text;
  navigator.clipboard.writeText(fullUrl).then(() => {
    showToast('Short URL copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Failed to copy URL', 'error');
  });
}

// Edit URL functionality
function editUrl(id, currentUrl) {
  document.getElementById('editUrlInput').value = currentUrl;
  document.getElementById('editForm').action = `/edit/${id}`;
  
  const editModal = new bootstrap.Modal(document.getElementById('editModal'));
  editModal.show();
}

// Delete URL functionality
function deleteUrl(id) {
  // Show confirmation with custom styling
  if (confirm('⚠️ Are you sure you want to delete this URL?\n\nThis action cannot be undone and all analytics data will be lost.')) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `/delete/${id}`;
    document.body.appendChild(form);
    form.submit();
  }
}

// Toast notification
function showToast(message, type = 'success') {
  const toastElement = document.getElementById('toast');
  const toastIcon = document.getElementById('toastIcon');
  const toastMessage = document.getElementById('toastMessage');
  
  toastMessage.textContent = message;
  
  // Update icon based on type
  if (type === 'error') {
    toastIcon.className = 'fas fa-exclamation-circle text-danger me-2';
    toastElement.classList.remove('toast-success');
    toastElement.classList.add('toast-error');
  } else {
    toastIcon.className = 'fas fa-check-circle text-success me-2';
    toastElement.classList.remove('toast-error');
    toastElement.classList.add('toast-success');
  }
  
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

// Initialize tooltips
document.addEventListener('DOMContentLoaded', function() {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});

// Add loading states to action buttons
document.querySelectorAll('.btn-action').forEach(button => {
  button.addEventListener('click', function() {
    const originalContent = this.innerHTML;
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    this.disabled = true;
    
    // Re-enable after 2 seconds (or when operation completes)
    setTimeout(() => {
      this.innerHTML = originalContent;
      this.disabled = false;
    }, 2000);
  });
});
