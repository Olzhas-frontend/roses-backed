import firebase from './firebase';
import { normalPrice } from '../functions/normalPrice';
import Swiper from '../vendor/swiper';

export class Product {
	constructor(container, preOrderWrapper) {
		this.container = document.querySelector(container);
		this.preOrderProductsContainer = document.querySelector(preOrderWrapper);
		this.loadItems = 3;
		this.initalItems = 3;
		this.productsInStock = [];
		this.preOrderProducts = [];
	}

	async init() {
		firebase.getrev().then((data) => {
			console.log(data);
		});

		//getItems(itemsToGet, (items) => console.log(items));
		//firebase.get().then((data) => {
		//	this.productsInStock = Object.values(data).filter((product) => !product.preOrder);
		//	this.preOrderProducts = Object.values(data).filter((product) => product.preOrder);

		//	this.loadInitialItems();
		//	if (this.preOrderProducts.length > 0 && this.preOrderProductsContainer) {
		//		this.loadPreOrderProducts();
		//	}
		//	this.initSlider();
		//});
	}

	initSlider() {
		new Swiper('.product__images', {
			slidesPerView: 'auto',
			loop: true,
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
		});
	}

	clearContainer() {
		this.container.innerHTML = '';
	}

	getById(id) {
		firebase.getOne(id);
	}

	loadMore() {
		let counter = 0;
		const productsItem = document.querySelectorAll('.main-product').length;

		this.productsInStock.forEach((el) => {
			if (counter >= productsItem && counter < this.loadItems + productsItem) {
				this.container.insertAdjacentHTML('beforeend', this.renderSingleProduct(el));
			}
			counter++;
		});

		if (productsItem + this.loadItems === this.productsInStock.length) {
			document.querySelector('.catalog-content__btn-more').style.display = 'none';
		}
	}

	renderSingleProduct(el) {
		let fragment = '';

		const product = Product.template(el);
		fragment += product;

		return fragment;
	}

	loadInitialItems() {
		let counter = 0;
		this.productsInStock.forEach((el) => {
			if (counter < this.initalItems && this.container) {
				this.container.insertAdjacentHTML('afterbegin', this.renderSingleProduct(el));
			}
			counter++;
		});
	}

	loadPreOrderProducts() {
		this.preOrderProducts.forEach((el) => {
			this.preOrderProductsContainer.insertAdjacentHTML('afterbegin', this.renderSingleProduct(el));
		});
	}

	filter(params1, params2) {
		firebase.filter(params1, params2);
	}

	sort(field, type) {
		this.clearContainer();
		firebase.getStockIn(field, type).then((data) => {
			data.forEach((el) => {
				this.container.insertAdjacentHTML('afterbegin', this.renderSingleProduct(el));
			});
		});
	}

	static returnClasses(preOrder) {
		return {
			productClass: !preOrder ? 'main-product' : '',
			btnClass: !preOrder ? 'btn--primary' : 'btn--secondary',
			icon: !preOrder ? 'cart' : 'cursor',
		};
	}

	static template({ id, title, currentPrice, oldPrice, descr, options, images, preOrder }) {
		return `
			<article class="product ${
				Product.returnClasses(preOrder).productClass
			} product-hover" data-product-id="${id}">
				<div class="product__actions">
					<button class="product__actions-btn favorite-btn btn-reset">
						<svg class="icon icon--bright-grey">
							<use xlink:href="images/sprites/sprite-mono.svg#heart"></use>
						</svg>
					</button>
					<button class="product__actions-btn link-btn btn-reset">
						<svg class="icon icon--davy-grey">
							<use xlink:href="images/sprites/sprite-mono.svg#eye"></use>
						</svg>
					</button>
				</div>
				<div class="product__images">
					<div class="swiper-wrapper">
						<div class="swiper-slide">
							<div class="product__images-item">
								<img src="${images ? images.main : ''}" alt="">
								<div class="product__overview">
									<div class="product__numerals-size">
										<span>
											<svg class="">
												<use xlink:href="images/sprites/sprite-multi.svg#width"></use>
											</svg>
											${options.width} см
										</span>
										<span>
											<svg class="">
												<use xlink:href="images/sprites/sprite-multi.svg#height"></use>
											</svg>
											${options.height} см
										</span>
									</div>
									<p class="product__overview-text">${descr}</p>
								</div>
							</div>
						</div>
						${
							images
								? images.catalog
										.map(
											(el) =>
												`<div class="swiper-slide">
									<div class="product__images-item">
										<img src="${el}" alt="">
									</div>
								</div>`
										)
										.join('')
								: ''
						}
					</div>
					<div class="swiper-pagination"></div>
				</div>
				<div class="product__info">
					<h3 class="product__title">
						<a href="#" class="js-product-link">${title}</a>
					</h3>
					<div class="product__details">
						<div class="product__details-inner">
							<span class="product__details-item">
								<svg class="product__details-icon">
									<use xlink:href="images/sprites/sprite-multi.svg#star-fill"></use>
								</svg>
								<strong>4.0</strong> (15 отзывов)
							</span>
							<span class="product__details-item">
								<svg class="product__details-icon">
									<use xlink:href="images/sprites/sprite-mono.svg#truck"></use>
								</svg>
								<strong>150</strong> мин
							</span>
						</div>
						<div class="product__sizes">
							<span class="product__sizes-caption">Размеры:</span>
							<ul class="product__sizes-list list-reset">
								${options.sizes.map((el) => `<li class="product__sizes-item">${el}</li>`).join('')}
							</ul>
						</div>
					</div>
					<div class="product__bottom">
						<div class="product__price">
							<span class="product__price-current">${normalPrice(currentPrice)} ₽</span>
							<span class="product__price-old">${normalPrice(oldPrice)} ₽</span>
						</div>
						<button class="product__btn btn ${Product.returnClasses(preOrder).btnClass} btn-reset">
							<svg class="btn__icon">
								<use xlink:href="images/sprites/sprite-mono.svg#${Product.returnClasses(preOrder).icon}"></use>
							</svg>
							В корзину
						</button>
					</div>
				</div>
			</article>
		`;
	}
}
