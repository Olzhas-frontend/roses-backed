import { modal } from '../vendor/graph-modal';
import Swiper from '../vendor/swiper';
import firebase from './firebase';
import { addZeroToNumber } from '../helpers/addZeroToNumber';

export class Reviews {
	constructor(container) {
		this.container = document.querySelector(container);
	}
	add(reviewItem) {
		firebase.setData(reviewItem, 'testimonials');
	}

	render(el) {
		let fragment = '';

		const product = Reviews.template(el);
		fragment += product;

		return fragment;
	}

	initSlider(container) {
		const reviewsSlider = new Swiper(container, {
			slidesPerView: 1,
			loop: true,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
		});
	}

	static template({ productId, reviewerName, message, reviewRating, image }) {
		return `
			<div class="swiper-slide">
				<div class="reviews__slider-item reviews-item">
					<div class="reviews-item__info">
						<div class="reviews-item__rating reviews-rating">
							<div id="${productId}">
								<ul class="big-stars list-reset">
									<li class="star-1">1</li>
									<li class="star-2">2</li>
									<li class="star-3">3</li>
									<li class="star-4">4</li>
									<li class="star-5">5</li>
								</ul>
							</div> 
							<span class="reviews-rating__count">${addZeroToNumber(reviewRating)}</span>
						</div>
						<h4 class="reviews-item__name">${reviewerName}</h4>
						<p class="reviews-item__text">${message}</p>
					</div>
					<div class="reviews-item__img">
						<img src="${image}" alt="">
					</div>
				</div>
			</div>
		`;
	}
}

export const userReview = new Reviews();
