export class Tab {
	constructor(parent) {
		this.parentEl = document.querySelector(parent);
		this.tabsControls = document.querySelectorAll(`${parent} .tabs-control__item`);
		this.tabsContents = document.querySelectorAll(`${parent} .tabs-content__item`);
		this.initTab();
	}

	initTab() {
		if (this.parentEl) {
			this.parentEl.addEventListener('click', (e) => {
				if (e.target.classList.contains('tabs-control__item')) {
					const tabsPath = e.target.dataset.pathTab;
					this.removeClassControl();
					document.querySelector(`[data-path-tab="${tabsPath}"]`).classList.add('is-active');
					this.tabsHandler(tabsPath);
				}
			});
		}
	}

	removeClassControl() {
		this.tabsControls.forEach((el) => {
			el.classList.remove('is-active');
		});
	}

	removeClassContents() {
		this.tabsContents.forEach((el) => {
			el.classList.remove('tabs-content__item--active');
		});
	}

	tabsHandler(path) {
		this.removeClassContents();
		document.querySelector(`[data-target-tab="${path}"]`).classList.add('tabs-content__item--active');
	}
}
