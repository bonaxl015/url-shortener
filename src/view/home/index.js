const CREATE_API_URL = '/api/v1/short-url/create';

// Fetch data from server
async function fetchDBRequest(url, method, body = null) {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

function attachFormListener() {
	document.getElementById('shorten-url-form').addEventListener('submit', async function(e) {
		e.preventDefault();
	
		const urlInput = document.getElementById('shorten-url-input').value;
		const resultContainer = document.getElementById('shorten-url-result-container');
		const resultDisplayElement = document.getElementById('shorten-url-result');
		const errorContainer = document.getElementById('shorten-url-error-container');
		const errorDisplayElement = document.getElementById('shorten-url-error-message');
	
		resultContainer.style.display = 'none'
		errorContainer.style.display = 'none'
	
		try {
			const data = await fetchDBRequest(CREATE_API_URL, 'POST', { url: urlInput });
	
			if (data) {
				resultDisplayElement.href = data.shortUrl;
				resultDisplayElement.innerText = data.shortUrl;
		
				const copyButton = createCopyButton(data.shortUrl);
				resultContainer.appendChild(copyButton);
		
				resultContainer.style.display = 'block';
			}

			attachFormListener();
		} catch (error) {
			errorDisplayElement.innerText = error.message;
			errorContainer.style.display = 'block';
		}
	}, { once: true });
}


// Create copy button element
function createCopyButton(shortUrl) {
	const copyButtonWrapper = document.createElement('div');

	copyButtonWrapper.innerHTML = `
		<button type="button" onclick="copyToClipboard('${shortUrl}')" class="copy-btn">
			<i class="fas fa-copy me-1"></i>
			Copy
		</button>
	`;

	return copyButtonWrapper;
}

// Copy to clipboard functionality
function copyToClipboard(text) {
	navigator.clipboard.writeText(text).then(() => {
		showToast('Short URL copied to clipboard!', 'success');
	}).catch(() => {
		showToast('Failed to copy URL', 'error');
	});
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

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function (e) {
			e.preventDefault();
			document.querySelector(this.getAttribute('href')).scrollIntoView({
				behavior: 'smooth'
			});
		});
  });

  // Add animation on scroll
  const observerOptions = {
		threshold: 0.1,
		rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.style.opacity = '1';
				entry.target.style.transform = 'translateY(0)';
			}
		});
  }, observerOptions);

	attachFormListener();

  // Observe feature cards
  document.querySelectorAll('.feature-card').forEach(card => {
		card.style.opacity = '0';
		card.style.transform = 'translateY(20px)';
		card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
		observer.observe(card);
  });
});
