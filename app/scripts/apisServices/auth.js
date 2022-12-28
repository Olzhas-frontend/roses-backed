import { app } from '../vendor/firebase';
import firebase from '../classes/firebase';
import {
	getFirestore,
	doc,
	getDoc,
	addDoc,
	setDoc,
	query,
	collection,
	where,
	getDocs,
} from 'firebase/firestore';
import { getAutheErrorKey } from '../helpers/getAuthErrorKey';
import { getAuthError } from '../helpers/getAuthError';
import { setPhoneToEl } from '../functions/showAuthModal';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier, signOut } from 'firebase/auth';
import { addToLS, removeFromLS } from '../helpers/localStorageFunctions';

class Auth {
	constructor() {
		this.db = getFirestore();
		this.auth = getAuth();
		this.loggedUser = null;
		this.codeInputs = document.querySelectorAll('.auth__field');
	}

	get currentUser() {
		return this.auth.currentUser;
	}

	signOutUser() {
		if (this.auth.currentUser) {
			signOut(this.auth)
				.then(() => {
					removeFromLS('currentUser');
					window.location = 'index.html';
				})
				.catch((error) => {});
		}
	}

	initRecatchaVerifier() {
		if (!window.recaptchaVerifier) {
			window.recaptchaVerifier = new RecaptchaVerifier(
				'recaptcha-container',
				{
					size: 'invisible',
				},
				this.auth
			);
		}
	}

	get code() {
		return Array.from(this.codeInputs)
			.map((el) => Number(el.value))
			.join('');
	}

	checkCode() {
		confirmationResult
			.confirm(this.code)
			.then(() => {
				window.location = 'personal-account.html';
			})
			.catch((error) => {
				const err = getAutheErrorKey(error.message);
				alert(getAuthError(err));
			});
	}

	async authUser(phoneInput) {
		const docRef = doc(this.db, 'users', phoneInput.value);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			setPhoneToEl();
			const appVerifier = window.recaptchaVerifier;
			signInWithPhoneNumber(this.auth, phoneInput.value, appVerifier)
				.then((confirmationResult) => {
					window.confirmationResult = confirmationResult;
				})

				.then(() => {
					addToLS('currentUser', JSON.stringify(docSnap.data()));
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			console.log('No data available');
			return false;
		}
	}

	async createNewUser(phoneInput, nameInput) {
		const docRef = doc(this.db, 'users', phoneInput.value);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			alert('Уже');
		} else {
			await setDoc(doc(this.db, 'users', phoneInput.value), {
				name: nameInput.value,
				phone: phoneInput.value,
				discount: 15,
			});
		}
	}
}

const auth = new Auth();
export default auth;
