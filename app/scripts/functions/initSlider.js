export const watchedBeforeSlider = new Swiper('.watched-before__slider', {
	slidesPerView: 4,
	loop: false,
	spaceBetween: 20,
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	simulateTouch: false,
	//on: {
	//	slideChange: function () {
	//		showBtnOnSlideChange(this, watchedBeforeSliderBtn);
	//	},
	//},
});
