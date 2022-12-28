export function showBtnOnSlideChange(slider, btn) {
	let realIndex = slider.realIndex;
	if (realIndex === 0) {
		btn.classList.remove('active');
	} else {
		btn.classList.add('active');
	}
}
