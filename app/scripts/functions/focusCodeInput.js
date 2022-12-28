export function focusCodeInput() {
	const codeInputs = document.querySelectorAll('.auth__field');

	codeInputs.forEach((input) => {
		input.addEventListener('keyup', (e) => {
			const { key } = e;
			if (key === 'Backspace' || key === 'Delete') {
				if (input.previousElementSibling) {
					input.previousElementSibling.focus();
					input.previousElementSibling.value = '';
				}
			}
			if (input.value !== '' && input.value.match(/\d/)) {
				if (input.nextElementSibling) input.nextElementSibling.focus();
			}
		});
	});
}
