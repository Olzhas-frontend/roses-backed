export function validatePhoneNumber(value) {
	let phoneNumberRegex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

	if (!phoneNumberRegex.test(value)) {
		alert('Телефон введен в неправильное формате');
		return false;
	}

	return true;
}
