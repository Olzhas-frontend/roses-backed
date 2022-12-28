import { singleGoods } from './classes/single-product';
import { modal } from './vendor/graph-modal';
import { miniProduct as recentlyViewedProduct } from './classes/mini-product';
import { getFromSS, addToSS, removeFromSS } from './helpers/sessionStorageFunctions';
import { addToLS, getFromLS, removeFromLS } from './helpers/localStorageFunctions';

const singleProduct = new singleGoods('.single-product__wrapper');
const miniProduct = new recentlyViewedProduct('.watched-before .swiper-wrapper');
window.addEventListener('load', () => {
	singleProduct.init();
	miniProduct.init();
});

window.addEventListener('beforeunload', function (e) {
	const productVisitedId = getFromSS('product-visited-id');
	let arr = JSON.parse(localStorage.getItem('viewedProducts')) || [];
	let filteredArr = arr.filter((el) => el !== productVisitedId);
	filteredArr.push(productVisitedId);
	localStorage.setItem('viewedProducts', JSON.stringify(filteredArr));

	removeFromSS('product-visited-id');
});

const pageAccessedByReload =
	(window.performance.navigation && window.performance.navigation.type === 1) ||
	window.performance
		.getEntriesByType('navigation')
		.map((nav) => nav.type)
		.includes('reload');

if (pageAccessedByReload) {
	const productVisitedId = getFromLS('product-visited-id');
	addToSS('product-visited-id', productVisitedId);
	let arr = JSON.parse(localStorage.getItem('viewedProducts')) || [];
	let filteredArr = arr.filter((el) => el !== productVisitedId);
	localStorage.setItem('viewedProducts', JSON.stringify(filteredArr));
	removeFromLS('product-visited-id');
}

const allReviewsBtn = document.querySelector('.all-reviews-btn');

allReviewsBtn.addEventListener('click', (e) => {
	e.preventDefault();
	modal.open('reviews');
	singleProduct.loadReviewsToModal();
});
