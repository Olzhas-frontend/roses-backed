import firebase from './firebase';
import { normalPrice } from '../functions/normalPrice';
import { Product } from './product';
import { getFromLS } from '../helpers/localStorageFunctions';
import { showBtnOnSlideChange } from '../helpers/showBtnOnSliderChange';
import Swiper from '../vendor/swiper';

export class miniProduct extends Product {
	constructor(container) {
		super(container);
	}

	init() {
		if (getFromLS('viewedProducts')) {
			const data = JSON.parse(getFromLS('viewedProducts'));

			firebase.getContentById(data, 'products').then((data) => {
				Object.values(data).forEach((el) => {
					this.container.insertAdjacentHTML('afterbegin', this.renderSingleProduct(el));
				});
				this.initContainerSlider();
				super.initSlider();
			});
		}
	}

	initContainerSlider() {
		new Swiper('.watched-before__slider', {
			slidesPerView: 4,
			loop: false,
			spaceBetween: 20,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			simulateTouch: false,
			on: {
				slideChange: function () {
					showBtnOnSlideChange(
						this,
						document.querySelector('.watched-before__slider .swiper-button-prev')
					);
				},
			},
		});
	}

	renderSingleProduct(el) {
		let fragment = '';

		const product = miniProduct.template(el);
		fragment += product;

		return fragment;
	}

	static template({ id, title, currentPrice, options, oldPrice, images }) {
		return `
			<div class="swiper-slide">
				<article class="product recently-viewed" data-product-id="${id}">
					<div class="product__actions">
						<button class="product__actions-btn favorite-btn btn-reset">
							<svg class="icon icon--bright-grey">
								<use xlink:href="images/sprites/sprite-mono.svg#heart"></use>
							</svg>
						</button>
					</div>
					<div class="product__images">
						<div class="swiper-wrapper">
							<div class="swiper-slide">
								<div class="product__images-item">
									<img src="${images ? images.main : ''}" alt="">
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
						<div class="product__props">Высота: ${options.height} см, Ширина: ${options.width} см</div>
						<div class="product__bottom">
							<div class="product__price">
								<span class="product__price-current">${normalPrice(currentPrice)} ₽</span>
								<span class="product__price-old">${normalPrice(oldPrice)} ₽</span>
							</div>
							<button class="product__btn btn btn--primary btn-reset">
								<svg class="btn__icon">
									<use xlink:href="images/sprites/sprite-mono.svg#cart"></use>
								</svg>
								В корзину
							</button>
						</div>
					</div>
			</article>
		</div>
		`;
	}
}
