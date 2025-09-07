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

  // Observe feature cards
  document.querySelectorAll('.feature-card').forEach(card => {
		card.style.opacity = '0';
		card.style.transform = 'translateY(20px)';
		card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
		observer.observe(card);
  });
});

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
		const response = await fetch('/api/v1/short-url/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ url: urlInput })
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.error || 'Something went wrong');
		}

		resultDisplayElement.href = data.shortUrl;
		resultDisplayElement.innerText = data.shortUrl;
		resultContainer.style.display = 'block';
	} catch (error) {
		errorDisplayElement.innerText = error.message;
		errorContainer.style.display = 'block';
	}
});
