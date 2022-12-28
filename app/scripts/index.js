//Import libs
import { v4 as uuidv4 } from 'uuid';

import './vendor/main.js';
//Import classes

import { Tab } from './classes/tabs.js';
import { Product } from './classes/product.js';
import firebase from './classes/firebase';
import validation from './classes/validation.js';
import { userReview } from './classes/review.js';

import { upload } from './components/upload.js';

//Import functions
import './functions/initRangeSlider';
import { focusCodeInput } from './functions/focusCodeInput';
import { toggleCatalogFilter } from './functions/toggleCatalogFilter';
import { saveProdIdToStorage } from './functions/saveProdIdToStorage.js';
//import { countStart } from './functions/star';
import { resetCountStar } from './functions/star';
import { debounce } from './helpers/debounce.js';
import { reviewAutocomplte } from './functions/initAutoComplete.js';
//import { sortselect } from './functions/initSelect.js';
import {
	signUpFormHandler,
	signInFormHandler,
	checkCode,
	showModalIsUserLogged,
	redirectToAccountPage,
} from './functions/signInAndUp';

focusCodeInput();
toggleCatalogFilter();
saveProdIdToStorage();
//countStart();
const signUpTab = new Tab('.auth__wrapper');

const signUpForm = document.getElementById('sing-up-form');
const signInForm = document.getElementById('sing-in-form');
const confirmPhoneForm = document.getElementById('confirm-phone');
const signInLink = document.querySelector('.sign-in-link');

signUpForm.addEventListener('submit', signUpFormHandler);
signInForm.addEventListener('submit', signInFormHandler);
confirmPhoneForm.addEventListener('submit', checkCode);
signInLink.addEventListener('click', (e) => {
	e.preventDefault();
	redirectToAccountPage(e.target, 'sign-in');
});

const catalogProduct = new Product('.catalog-content__items', '.wait-products__wrapper');
const loadMoreBtn = document.querySelector('.catalog-content__btn-more');

//window.addEventListener('load', () => {
//	catalogProduct.init();
//});
catalogProduct.init();
if (loadMoreBtn) {
	loadMoreBtn.addEventListener('click', (e) => {
		catalogProduct.loadMore();
		catalogProduct.initSlider();
	});
}

//const input0 = document.getElementById('input-0');
//const input1 = document.getElementById('input-1');
//const list = document.querySelectorAll('.custom-checkbox__field');
//let params = [];
//list.forEach((el) => {
//	el.addEventListener('click', (e) => {
//		const { filterName } = e.target.dataset;
//		const self = e.target;
//		if (self.checked) {
//			!params.includes(filterName) ? params.push(filterName) : params;
//		} else {
//			const deletedIdx = params.findIndex((el) => el === filterName);
//			params.splice(deletedIdx, 1);
//		}

//		catalogProduct.filter(+input0.value, +input1.value);
//	});
//});

const sortSelect = document.querySelector('#select-1');

if (sortSelect) {
	sortSelect.addEventListener('itc.select.change', (e) => {
		const btn = e.target.querySelector('.itc-select__toggle');
		const value = btn.textContent;

		if (value === 'По возрастанию цены') {
			catalogProduct.sort('currentPrice', 'desc');
		} else if (value === 'По убыванию цены') {
			catalogProduct.sort('currentPrice');
		} else if (value === 'По алфавиту') {
			catalogProduct.sort('title', 'desc');
		}
	});
}

const reviewerName = document.getElementById('reviewer-name');
const flowerName = document.getElementById('autocomplete-0-input');
const message = document.getElementById('review-message');
const reviewRating = document.querySelector('.form-rating__count');

const addReviewsForm = document.getElementById('add-review-form');
const addReviewsBtn = document.querySelector('.reviews__add-btn');
if (addReviewsBtn) {
	addReviewsBtn.addEventListener('click', () =>
		showModalIsUserLogged('add-review', 'Необходима регистрация')
	);
}

const starRatingsItem = document.querySelectorAll('input[name="hsr"]');
starRatingsItem.forEach((el) => {
	el.addEventListener('click', (e) => {
		reviewRating.textContent = e.target.value;
	});
});

import { Upload } from './classes/upload.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const storage = getStorage();
const reviewFile = document.getElementById('file');

const reviewFiles = new Upload(reviewFile, {
	multi: false,
	accept: ['.png', '.jpg', '.jpeg', '.gif'],
});

if (addReviewsForm) {
	addReviewsForm.addEventListener('submit', async (e) => {
		e.preventDefault();

		const preview = document.querySelector('.preview');

		const reviewerNameValue = reviewerName.value;
		const flowerNameValue = flowerName.value;
		const messageValue = message.value;
		const reviewRatingCount = reviewRating.textContent;
		const { productId } = flowerName.dataset;
		const image = reviewFiles.files[0];

		let review = {
			productId,
			reviewerName: reviewerNameValue,
			flowerName: flowerNameValue,
			message: messageValue,
			reviewRating: parseFloat(reviewRatingCount),
		};

		const defaultImage =
			'https://firebasestorage.googleapis.com/v0/b/roses-backend-f567d.appspot.com/o/images%2Freviews%2Fdefault-review.png?alt=media&token=2670f9c6-e844-4d5d-8223-546d7e055d46';

		reviewFiles.onUpload = async function (file) {
			if (file) {
				const storageRef = ref(storage, `images/reviews/${uuidv4()}.png`);
				await uploadBytesResumable(storageRef, file, file.type);

				return await getDownloadURL(storageRef);
			}
		};

		let isUsernameValid = validation.checkUsername(reviewerName);
		let isFlowerNameValid = validation.checkFlowerName(flowerName);
		let isMessageValid = validation.checkMessage(message);
		let isRatingValid = validation.checkRating(reviewRating);

		let isFormValid = isUsernameValid && isFlowerNameValid && isMessageValid && isRatingValid;

		if (isFormValid) {
			await reviewFiles.onUpload(image).then((url) => {
				review.image = url ?? defaultImage;
			});
			reviewFiles.clearLoaddedItem(preview);
			userReview.add(review);
			e.target.reset();
			validation.clearStatus();
			flowerName.value = '';
			reviewRating.textContent = '0';
		}
	});
}

if (addReviewsForm) {
	addReviewsForm.addEventListener(
		'input',
		debounce(function (e) {
			switch (e.target.id) {
				case 'reviewer-name':
					validation.checkUsername(reviewerName);
					break;
				case 'autocomplete-0-input':
					validation.checkFlowerName(flowerName);
					break;
				case 'review-message':
					validation.checkMessage(message);
					break;
			}
		})
	);
}
