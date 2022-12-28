export function usernameValidate(value) {
	let usernameRegex = /[a-zA-Z\s]+/;
	if (!usernameRegex.test(value)) {
		alert('Имя должно состоять только из букв');
		return false;
	}
	return true;
}
