import { validatePhoneNumber } from '../helpers/phoneNumberValidate';
import { modal } from '../vendor/graph-modal';

const phoneInput = document.getElementById('sigin-in-phone');
const changeCodeBtn = document.querySelector('.auth__change-btn');
const authCodeEl = document.querySelector('.auth__code span');

if (changeCodeBtn) {
	changeCodeBtn.addEventListener('click', changePhoneNumber);
}

export function setPhoneToEl() {
	modal.close('sign-in');
	modal.open('confirm-phone');
	authCodeEl.textContent = phoneInput.value;
}

function changePhoneNumber(e) {
	e.preventDefault();
	modal.close('confirm-phone');
	modal.open('sign-in');
}
