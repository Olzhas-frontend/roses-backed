export function setError(element, message) {
	const inputControl = element.closest('.review-form__group');
	const errorDisplay = inputControl.querySelector('.error');

	errorDisplay.innerText = message;
	inputControl.classList.add('error');
	inputControl.classList.remove('success');
}

export function setSuccess(element) {
	const inputControl = element.closest('.review-form__group');
	const errorDisplay = inputControl.querySelector('.error');

	errorDisplay.innerText = '';
	inputControl.classList.add('success');
	inputControl.classList.remove('error');
}
