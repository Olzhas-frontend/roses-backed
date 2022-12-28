import { addToSS, getFromSS } from '../helpers/sessionStorageFunctions.js';

export function saveProdIdToStorage() {
	const productsWrapper = document.querySelector('.catalog__wrapper');

	if (productsWrapper) {
		productsWrapper.addEventListener('click', (e) => {
			if (e.target.classList.contains('js-product-link')) {
				e.preventDefault();
				const link = e.target;

				const parent = link.closest('.product');
				const { productId } = parent.dataset;

				addToSS('product-visited-id', productId);
				const productVisitedIdFromSS = getFromSS('product-visited-id');
				//let viewedProducts = new Set();
				localStorage.setItem('product-visited-id', productVisitedIdFromSS);
				//viewedProducts.add(productId);
				//console.log([...viewedProducts]);
				//localStorage.setItem('viewedItems', JSON.stringify([...viewedProducts]));

				const url = 'http://localhost:3000/single-product.html';
				window.open(url, '_blank');
			}
		});
	}
}
