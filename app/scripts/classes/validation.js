import { setSuccess, setError } from '../helpers/setInputStatus';

export class validateForm {
	isRequired(value) {
		return value === '' ? false : true;
	}
	isBetween(length, min, max) {
		return length < min || length > max ? false : true;
	}
	checkUsername(usernameEl) {
		let isValid = false;
		const min = 3,
			max = 25;

		const username = usernameEl.value.trim();

		if (!this.isRequired(username)) {
			setError(usernameEl, 'Имя не можут быть пустым.');
		} else if (!this.isBetween(username.length, min, max)) {
			setError(usernameEl, `Имя пользователя должно содержать от ${min} до ${max} символов.`);
		} else {
			setSuccess(usernameEl);
			isValid = true;
		}
		return isValid;
	}

	checkFlowerName(el) {
		let isValid = false;

		const flowerName = el.value.trim();

		if (!this.isRequired(flowerName)) {
			setError(el, 'Выберите букет');
		} else {
			setSuccess(el);
			isValid = true;
		}
		return isValid;
	}

	checkMessage(el) {
		let isValid = false;

		const message = el.value.trim();
		const requiredCharater = 20;

		if (!this.isRequired(message)) {
			setError(el, 'Введите сообщение');
		} else if (el.value.length < requiredCharater) {
			setError(el, `Длина не менее ${requiredCharater} символов`);
		} else {
			setSuccess(el);
			isValid = true;
		}
		return isValid;
	}

	checkRating(el) {
		let isValid = false;

		if (parseInt(el.textContent) === 0) {
			setError(el, 'Выберите рейтинг');
		} else {
			setSuccess(el);
			isValid = true;
		}
		return isValid;
	}

	clearStatus() {
		const inputControls = document.querySelectorAll('.review-form__group');
		inputControls.forEach((el) => el.classList.remove('success'));
	}

	//isEmpty(field) {
	//	if (field.value.trim() === '') {
	//		setError(field, 'Поле обязательно для заполнения');

	//	} else {
	//		setSuccess(field);
	//	}
	//}

	//user(field) {
	//	let usernameRegex = /[a-zA-Z\s]+/;

	//	if (field.value.trim() === '') {
	//		setError(field, 'Поле обязательно для заполнения');

	//	} else if (!usernameRegex.test(field.value)) {
	//		setError(field, 'Имя должно состоять только из букв');

	//	} else {
	//		setSuccess(field);
	//	}

	//}

	//checkLength(field, length) {
	//	if (field.value.trim() === '') {
	//		setError(field, 'Поле обязательно для заполнения');

	//	} else if (field.value.length < length) {
	//		setError(field, `Длина не менее ${length} символов`);

	//	} else {
	//		setSuccess(field);
	//	}

	//}

	//checkRating(field) {
	//	if (parseInt(field.textContent) === 0) {
	//		setError(field, 'Выберите рейтинг');

	//	} else {
	//		setSuccess(field);
	//	}

	//}

	//clearStatus() {
	//	const inputControls = document.querySelectorAll('.review-form__group');
	//	inputControls.forEach((el) => el.classList.remove('success'));
	//}
}

//const isValidEmail = (email) => {
//	const re =
//		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//	return re.test(String(email).toLowerCase());
//};

const validation = new validateForm();
export default validation;
