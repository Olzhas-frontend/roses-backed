import firebase from './firebase';

import { getStorage, ref, getDownloadURL } from 'firebase/storage';

// Create a reference with an initial file path and name
const storage = getStorage();

import { normalPrice } from '../functions/normalPrice';
import { Product } from './product';
import { Reviews } from './review';
import { getFromSS } from '../helpers/sessionStorageFunctions';
import Swiper from '../vendor/swiper';
import { declOfNum } from '../helpers/declOfNum';
import { calcRating } from '../helpers/calcRating';
import { addZeroToNumber } from '../helpers/addZeroToNumber';

export class singleGoods extends Product {
	constructor(container) {
		super(container);
	}

	init() {
		const productId = getFromSS('product-visited-id');
		firebase.getOne(productId).then(async (data) => {
			const relatedReviews = await firebase.getWithQuery2('testimonials', 'productId', '==', productId);
			const singleItem = Object.assign({}, ...data, { reviews: relatedReviews });

			this.loadReviews(relatedReviews);
			this.container.insertAdjacentHTML('afterbegin', this.renderSingleProduct(singleItem));
			this.idToParent = productId;
			singleGoods.initSlider();
		});
	}

	loadReviews(arr, count = 2) {
		const reviews = new Reviews('.reviews__slider .swiper-wrapper');

		const slicedReviews = arr.slice(0, count);

		slicedReviews.forEach((el) => {
			reviews.container.insertAdjacentHTML('afterbegin', reviews.render(el));

			this.populateStars('.big-stars', el.reviewRating);
		});

		reviews.initSlider('.reviews__slider');
	}

	async loadReviewsToModal() {
		const productId = getFromSS('product-visited-id');
		const relatedReviews = await firebase.getWithQuery2('testimonials', 'productId', '==', productId);

		const modalReviews = new Reviews('.reviews-modal__wrapper');
		modalReviews.container.innerHTML = '';
		relatedReviews.forEach((el) => {
			modalReviews.container.insertAdjacentHTML('afterbegin', modalReviews.render(el));

			this.populateStars('.reviews-modal__wrapper .big-stars', el.reviewRating);
		});
	}

	populateStars(stars, score) {
		score = Math.round(score * 2) / 2;
		let scoreParts = score.toString().split('.');

		const starsEl = document.querySelector(stars);
		const els = starsEl.querySelectorAll('li');
		els.forEach((el, idx) => {
			if (idx < scoreParts[0]) {
				el.classList.add('full');
			}
		});
		if (scoreParts[1]) {
			els.forEach((el, idx) => {
				if (idx == +scoreParts[0]) {
					el.classList.add('half');
				}
			});
		}
	}

	/**
	 * @param {any}
	 * @param {any} id
	 */
	set idToParent(id) {
		const parent = document.querySelector('.single-product');
		parent.dataset.dataProductId = id;
	}

	renderSingleProduct(el) {
		let fragment = '';

		const product = singleGoods.template(el);
		fragment += product;

		return fragment;
	}
	static initSlider() {
		const productSliderThumbnail = new Swiper('.single-product__thumbnail', {
			spaceBetween: 14,
			slidesPerView: 4,
			freeMode: true,
			watchSlidesProgress: true,
		});

		const productSliderMain = new Swiper('.single-product__slider', {
			thumbs: {
				swiper: productSliderThumbnail,
			},
		});
	}

	static template({ title, options, currentPrice, oldPrice, composition, descr, images, reviews }) {
		const length = reviews.length;

		return `
		<div class="single-product__gallery">
				<div class="single-product__slider gallery-slider">
					<div class="swiper-wrapper">
					${images.gallery
						.map(
							(el) => `
						<div class="swiper-slide">
							<div class="gallery-slider__item">
								<img loading="lazy" src="${el}" class="gallery-slider__image"
										alt="">
							</div>
						</div>
					`
						)
						.join('')}
					</div>
				</div>
				<div class="single-product__thumbnail thumbnail-slider">
					<div class="swiper-wrapper">
					${images.thumbnails
						.map(
							(el) => `
							<div class="swiper-slide">
								<div class="thumbnail-slider__item"> 
									<img loading="lazy" src="${el}" class="thumbnail-slider__image"
										alt="">
								</div>
						</div>`
						)
						.join('')}
					</div>
				</div>
				<div class="single-product__overviews">
					${descr}
				</div>
			</div>
			<div class="single-product__info">
				<h2 class="single-product__title">${title}</h2>
				<div class="single-product__rating">
					<svg class="single-product__rating-icon">
						<use xlink:href="images/sprites/sprite-mono.svg#rating-star"></use>
					</svg>
					<span class="single-product__rating-count">${addZeroToNumber(calcRating(reviews))}</span>
					<span class="single-product__rating-reviews">(<span>${length} ${declOfNum(length, [
			'отзыв',
			'отзыва',
			'отзывов',
		])}</span>)</span>
				</div>
				<ul class="single-product__details list-reset">
					<li class="single-product__details-item">
						Высота: <span>${options.height} см</span>
					</li>
					<li class="single-product__details-item">
						Ширина: <span>${options.width} см</span>
					</li>
					<li class="single-product__details-item">
						Диаметр: <span>${options.diameter}</span>
					</li>
					<li class="single-product__details-item">
						Цвет: <span>Красный</span>
					</li>
				</ul>
				<div class="single-product__props product-props">
					<span class="product-props__caption">Размер</span>
					${options.sizes
						.map(
							(el) => `
						<div class="product-props__item">
							<input checked type="radio" id="${el}" class="product-props__input" name="product-length" value="40">
							<label class="product-props__label" for="${el}">
								${el}
							</label>
						</div>
					`
						)
						.join('')}
				</div>
				<div class="single-product__props product-props">
					<span class="product-props__caption">Упаковка</span>
					<div class="product-props__item">
						<input type="radio" id="ribbon" class="product-props__input" name="product-package" value="ribbon">
						<label class="product-props__label" for="ribbon">
							Ленточка
						</label>
					</div>
					<div class="product-props__item">
						<input type="radio" id="craft" class="product-props__input" name="product-package" value="craft"
							checked>
						<label class="product-props__label" for="craft">
							Крафт (+290₽)
						</label>
					</div>
					<div class="product-props__item">
						<input type="radio" id="korean" class="product-props__input" name="product-package" value="korean">
						<label class="product-props__label" for="korean">
							Корейская (+390₽)
						</label>
					</div>
					<div class="product-props__item">
						<input type="radio" id="premium" class="product-props__input" name="product-package" value="premium">
						<label class="product-props__label" for="premium">
							Премиум (+490₽)
						</label>
					</div>
					<div class="product-props__item">
						<input type="radio" id="backet" class="product-props__input" name="product-package" value="backet">
						<label class="product-props__label" for="backet">
							Корзинка (+1000₽)
						</label>
					</div>
				</div>
				<div class="single-product__props product-props">
					<span class="product-props__caption">Зелень</span>
					<div class="product-props__item">
						<input type="radio" id="none" class="product-props__input" name="green" value="">
						<label class="product-props__label" for="none">
							Нет
						</label>
					</div>
					<div class="product-props__item">
						<input type="radio" id="green-150" class="product-props__input" name="green" value="green-150"
							checked>
						<label class="product-props__label" for="green-150">
							Немного (+150₽)
						</label>
					</div>
					<div class="product-props__item">
						<input type="radio" id="green-300" class="product-props__input" name="green" value="green-300">
						<label class="product-props__label" for="green-300">
							Побольше (+300₽)
						</label>
					</div>
				</div>
				<div class="single-product__price">
					<div class="single-product__price-info">
						<span class="single-product__price-current">${normalPrice(currentPrice)} ₽</span>
						<span class="single-product__price-old">${normalPrice(oldPrice)} ₽</span>
					</div>
					<div class="single-product__tooltip tooltip">
						<button class="tooltip__caption btn-reset" aria-labelledby="seller">
							скидка от кол-ва
							<svg class="">
								<use xlink:href="images/sprites/sprite-mono.svg#tooltip"></use>
							</svg>
						</button>
						<div class="tooltip__text" role="tooltip" id="seller">
							Скидка от количества
						</div>
					</div>
				</div>
				<div class="single-product__actions">
					<div class="single-product__stepper stepper">
						<button class="stepper__btn stepper__btn--up stepper__btn--disabled btn-reset">-</button>
						<div class="stepper__field">
							<input type="text" value="1" maxlength="3" class="stepper__input">
						</div>
						<button class="stepper__btn stepper__btn--down btn-reset">+</button>
					</div>
					<div class="single-product__buy">
						<button class="single-product__btn btn btn--primary btn-reset">
							<svg class="btn__icon">
								<use xlink:href="images/sprites/sprite-mono.svg#cart"></use>
							</svg>
							Купить
						</button>
						<button class="single-product__buy-click btn-reset" data-graph-path="buy-one-click">Купить в 1
							клик</button>
					</div>
					<button class="single-product__favorite-btn btn-reset">
						<svg class="icon icon--bright-grey">
							<use xlink:href="images/sprites/sprite-mono.svg#heart"></use>
						</svg>
					</button>
				</div>
				<div class="single-product__compos product-compos">
					<span class="product-compos__caption">Состав:</span>
					<ul class="product-compos__list list-reset">
					${Object.entries(composition)
						.map(
							(el) => `
							<li class="product-compos__item">
							<span class="product-compos__title">${el[0]}</span>
							<span class="product-compos__count">-${el[1]} шт</span>
						</li>
					`
						)
						.join('')}
					</ul>
				</div>
			</div>
		`;
	}
}
