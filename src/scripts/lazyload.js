class LazyLoadAgent {
	constructor() {
		this.paramsMap = new WeakMap();
		this.intersectionObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach(({ isIntersecting, target }) => {
				if (isIntersecting) {
					this.load(target);
					observer.unobserve(target);
				}
			});
		}, { threshold: 0, rootMargin: "30%" });
		this.mutationObserver = new MutationObserver((mutations, observer) => {
				console.log("observer: ", observer);
			mutations.forEach((mutation) => {
				const { type, target, attributeName } = mutation;
				const params = this.paramsMap.get(target);
				if (!params) return;
				if (attributeName !== params.triggerAttribute) return;
				if (attributeName === "class") {
					if (!params.values.some(item => target.classList.contains(item))) return;
				} else {
					if (!params.values.some(item => target.getAttribute(attributeName).includes(item))) return;
				}
				this.load(params.elem);
			});
		});
	}
	watch(elem) {
		const triggerElem = elem.hasAttribute("data-lazyload-trigger-target") ? elem.closest(elem.getAttribute("data-lazyload-trigger-target")) : elem;
		if (elem.hasAttribute("data-lazyload-trigger")) {
			const [triggerAttribute, rawValues] = elem.getAttribute("data-lazyload-trigger").split(":").map(part => part.trim());
			const values = rawValues.split(",").map(part => part.trim());
			this.paramsMap.set(triggerElem, { elem, triggerAttribute, values });
			this.mutationObserver.observe(triggerElem, { attributes: true, attributeFilter: [triggerAttribute] });
		} else {
			this.intersectionObserver.observe(triggerElem);
		}
	}
	load(target) {
		target.hasAttribute("data-srcset") && target.setAttribute("srcset", target.getAttribute("data-srcset"));
		target.hasAttribute("data-src") && target.setAttribute("src", target.getAttribute("data-src"));
	}
}