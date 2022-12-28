const createEl = (tag, classes = [], content) => {
	const node = document.createElement(tag);

	if (classes.length) node.classList.add(...classes);
	if (classes.length) node.textContent = content;
	return node;
};

const noop = () => {};

export class Upload {
	constructor(selector, options = {}) {
		this.input = selector;
		this.onUpload = options.onUpload ?? noop;
		this.options = options;
		this.files = [];
		this.init();
	}

	init() {
		const preview = createEl('div', ['preview']);
		const openBtn = createEl('button', ['btn-file'], 'Открыть');

		this.setMultiAttribute();
		this.setAcceptAttribute();

		this.input.insertAdjacentElement('afterend', preview);
		this.input.insertAdjacentElement('afterend', openBtn);

		openBtn.addEventListener('click', (e) => {
			e.preventDefault();
			this.input.click();
		});
		preview.addEventListener('click', (e) => {
			this.removeImage(e, preview);
		});
		this.input.addEventListener('change', (e) => {
			this.changeHandler(e, preview);
		});
	}

	clearEl(el) {
		el.style.bottom = '4px';
		el.innerHTML = '<div class="preview-info-progress"></div>';
	}

	clearLoaddedItem(preview) {
		preview.innerHTML = '';
	}

	removeImage(e, preview) {
		if (!e.target.dataset.name) return;
		const { name } = e.target.dataset;
		this.files = this.files.filter((file) => file.name !== name);

		//if (!this.files.length) btn.style.display = 'none';

		const block = preview.querySelector(`[data-name="${name}"]`).closest('.preview-image');
		block.classList.add('removing');
		setTimeout(() => block.remove(), 300);
	}

	changeHandler(e, preview) {
		if (!e.target.files.length) return;

		this.files = Array.from(e.target.files);

		preview.innerHTML = '';
		this.files.forEach((file) => {
			if (!file.type.match('image')) return;

			const reader = new FileReader();

			reader.onload = (e) => {
				const src = e.target.result;
				preview.insertAdjacentHTML(
					'afterbegin',
					`
					<div class="preview-image">
						<div class="preview-remove" data-name=${file.name}>&times;</div>
						<img src="${src}" alt="${file.name}" />
					</div>
				`
				);
			};

			reader.readAsDataURL(file);
		});
	}

	setMultiAttribute() {
		if (this.options.multi) {
			this.input.setAttribute('multiple', true);
		}
	}

	setAcceptAttribute() {
		if (this.options.acceptExtensions && Array.isArray(this.options.acceptExtensions)) {
			this.input.setAttribute('accept', this.options.acceptExtensions.join(','));
		}
	}
}
