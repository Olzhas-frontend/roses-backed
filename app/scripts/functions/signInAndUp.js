import { usernameValidate } from '../helpers/usernameValidate';
import { validatePhoneNumber } from '../helpers/phoneNumberValidate';
import { checkValueIsEmpty } from '../helpers/checkValueIsEmpty';
import { modal } from '../vendor/graph-modal';

import auth from '../apisServices/auth';

const signUpName = document.getElementById('sing-up-name');
const signUpPhone = document.getElementById('sigin-up-phone');
const signInPhone = document.getElementById('sigin-in-phone');

function signUpFormHandler(e) {
	e.preventDefault();

	if (checkValueIsEmpty(signUpName.value) || checkValueIsEmpty(signUpPhone.value)) {
		alert('Поле не может быть пустым');
		return false;
	}
	if (usernameValidate(signUpName.value) && validatePhoneNumber(signUpPhone.value)) {
		auth.createNewUser(signUpPhone, signUpName);
	}
}

function signInFormHandler(e) {
	e.preventDefault();

	if (checkValueIsEmpty(signInPhone.value)) {
		alert('Поле не может быть пустым');
		return false;
	}
	if (validatePhoneNumber(signInPhone.value)) {
		auth.initRecatchaVerifier();
		auth.authUser(signInPhone);
	}
}

function checkCode(e) {
	e.preventDefault();
	auth.checkCode();
}

function signOut() {
	auth.signOutUser();
}

function redirectToAccountPage(link, name) {
	if (auth.currentUser !== null) {
		link.setAttribute('href', 'personal-account.html');
		window.location = 'personal-account.html';
	} else {
		modal.open(name);
	}
}

function showModalIsUserLogged(name, message) {
	if (auth.currentUser !== null) {
		modal.open(name);
	} else {
		alert(message);
	}

	return false;
}

export {
	signUpFormHandler,
	signInFormHandler,
	checkCode,
	signOut,
	showModalIsUserLogged,
	redirectToAccountPage,
};
