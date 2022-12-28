import { getFromLS } from '../helpers/localStorageFunctions';
import { getNameFromFullName } from '../helpers/getNameFromFullName';

export class User {
	constructor() {
		this.nameEl = document.querySelector('.account__name');
		this.discountEl = document.querySelector('.account__discount-count span');
	}

	get currentUser() {
		if (getFromLS('currentUser')) {
			return JSON.parse(getFromLS('currentUser'));
		}
	}

	setUserName() {
		const { name } = this.currentUser;
		this.nameEl.textContent += `${getNameFromFullName(name)}!`;
	}

	setUserDiscount() {
		const { discount } = this.currentUser;
		this.discountEl.textContent = `${discount}%`;
	}
}
