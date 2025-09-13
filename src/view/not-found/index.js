document.addEventListener('DOMContentLoaded', function () {
	// Animate floating elements
	const floatingElements = document.querySelectorAll('.floating-element');
	floatingElements.forEach((element, index) => {
		element.style.animationDelay = `${index * 0.5}s`;
	});

	// Add glitch effect to 404 number on hover
	const errorNumber = document.querySelector('.error-number');
	if (errorNumber) {
		errorNumber.addEventListener('mouseenter', function () {
			this.classList.add('glitch-effect');
			setTimeout(() => {
				this.classList.remove('glitch-effect');
			}, 1000);
		});
	}
});
