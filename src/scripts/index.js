import "../styles/index.scss";
import intlTelInput from 'intl-tel-input';
import IMask from "imask";
import "vanilla-drawers";
import throttle from "lodash.throttle";
import Swiper from "swiper";
import { Autoplay, Navigation } from "swiper/modules";
import gsap from "gsap";
import "./select.js";
import "./range-slider.js";
import { ru } from "intl-tel-input/i18n"; // Russian

import { isMobile, addLeadingZero } from "./utils.js";
import initDisclosures from "./disclosure.js";
import Lenis from 'lenis';

window.app = window.app || {};
window.app.hoverMedia = window.matchMedia("(any-hover: hover)");
window.app.lenis =  new Lenis({
	autoRaf: true,
})

document.documentElement.classList.toggle("is-mobile", isMobile.any());
document.documentElement.style.setProperty("--scroll-width", `${window.innerWidth - document.documentElement.offsetWidth}px`);

matchMedia("(min-width: 1301px)").addEventListener("change", () => app.drawers.close("burger-panel"));

initDisclosures();
app.drawers.init();
if (!localStorage.getItem('cookiesAgreementShowed')) {
	
}
app.drawers.get("coockies-agreement")?.setOptions({ closeOnUnderlayClick: false });
app.drawers.get("coockies-agreement").on("close", () => {
	localStorage.setItem('cookiesAgreementShowed', 'true');
});
document.querySelector("#coockies-agreement-btn")?.addEventListener("click", () => {
	localStorage.setItem('cookiesAccepted', 'true');
});
if (!localStorage.getItem('cookiesAgreementShowed')) {
	app.drawers.open("coockies-agreement");
}

if (window.location.hash) {
	setTimeout(() => window.app.lenis.scrollTo(window.location.hash, { offset: -40, duration: 2 }), 500);
}
document.querySelectorAll(`[href*="#"], [href*="/#"]`).forEach(elem => {
	elem.addEventListener("click", (e) => {
		const href = elem.getAttribute("href");
		if (!href.includes(window.location.host + window.location.pathname)) return;
		e.preventDefault();
		const pattern = /.*?(\#.*)/;
		const match = href.match(pattern);
		const anchor = match ? match[1] : null;

		history.pushState(null, "", anchor);
		app.drawers.close("burger-panel");
		window.app.lenis.scrollTo(anchor, { offset: -40, duration: 2 });
	});
});


// Show secondary header
const secondaryHeader = document.querySelector(".header_second");
const goUpBtn = document.querySelector(`[data-component=":go-up-btn:"]`);
goUpBtn.addEventListener("click", () => window.app.lenis.scrollTo(0, {
	lerp: 0.08,
	easing: (x) => x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2,
	duration: 2
}));
goUpBtn.classList.add("_initialized");
document.addEventListener("scroll", throttle(() => {
	const show = window.scrollY > (window.innerHeight / 3);
	secondaryHeader.classList.toggle("header_show", show);
	goUpBtn.classList.toggle("_show", show);
}));

const intersectionObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.classList.add("_shown");
		}
	});
}, { rootMargin: "0% 0% -24% 0%" });

document.querySelectorAll(`[data-component*=":isn-observer:"]`).forEach(elem => {
	intersectionObserver.observe(elem);
});

document.querySelectorAll(`[data-component*=":tel-input:"]`).forEach(root => {
	let maskInstance;
	const iti = intlTelInput(root, {
		initialCountry: "ru",
		nationalMode: true,
		separateDialCode: true,
		i18n: ru,
		formatOnDisplay: false,
		loadUtils: () => import("intl-tel-input/utils"),
	});
	iti.promise.then(useMask);
	root.addEventListener("countrychange", useMask);
		// при фокусе включаем полный placeholder
	root.addEventListener('focus', () => {
		maskInstance.updateOptions({ lazy: false });
	});

	// при blur возвращаем в lazy-режим
	root.addEventListener('blur', () => {
		maskInstance.updateOptions({ lazy: true });
	});

	function useMask() {
		const { utils } = intlTelInput;
		if (!utils) return;
		const country = iti.getSelectedCountryData();
		const example = root.getAttribute("placeholder");//utils.getExampleNumber(country.iso2, true, utils.numberType.MOBILE);
		//const formatted = utils.formatNumber(example, country.iso2, utils.numberFormat.NATIONAL);
		const mask = example.replace(/^.*?\(/, "(").replace(/[0-9]/g, "0");
		//Inputmask({ mask, rightAlign: false }).mask(root);
		if (maskInstance) {
			maskInstance.updateOptions({ mask });
		} else {
			maskInstance = IMask(root, { mask,  placeholderChar: '_' });
		}
	}
});

document.querySelectorAll(`[data-component*=":hero-slider:"]`).forEach(root => {
	const autoplayDelay = Number(root.getAttribute("data-autoplay-delay") || 3000);
	const prev = root.querySelector("[data-elem='hero-slider.prev']");
	const next = root.querySelector("[data-elem='hero-slider.next']");

	const current = root.querySelector("[data-elem='hero-slider.current']");
	const total = root.querySelector("[data-elem='hero-slider.total']");
	const timerBar = root.querySelector("[data-elem='hero-slider.timer-bar']");

	const setCurrent = (next) => current.textContent = addLeadingZero(next);

	new Swiper(root, {
		wrapperClass: "hero-section__slider-wrap",
		slideClass: "hero-section__slide",
		loop: true,
		"modules": [Autoplay, Navigation],
		"autoplay": {
			"delay": autoplayDelay,
			disableOnInteraction: false,
		},
		navigation: {
			prevEl: prev,
			nextEl: next,
		},
		"slidesPerView": 1,
		on: {
			afterInit: function() {
				setCurrent(this.realIndex + 1);
				total.textContent = addLeadingZero(this.slides.length);
			},
			slideChange: function() {
				setCurrent(this.realIndex + 1);
			},
			autoplayTimeLeft: throttle(function(_,__, percentage) {
				timerBar.style.setProperty("--progress", `${(1 - percentage) * 100}%`);
			}, 200)
		}
	});
});

document.querySelectorAll(`[data-component*=":logos-slider:"]`).forEach(root => {
	new Swiper(root, {
		wrapperClass: "clients-section__logos-wrap",
		slideClass: "clients-section__logo",
		direction: "horizontal",
		loop: true,
		"modules": [Autoplay],
		speed: 5000,
		allowTouchMove: false,
		spaceBetween: 10,
		"autoplay": {
			"delay": 0,
			disableOnInteraction: false,
		},
		slidesPerView: 1.6,
		breakpoints: {
			"992": {
				direction: "vertical",
				slidesPerView: "auto",
			},
			"640": {
				direction: "horizontal",
				slidesPerView: 2.8,
			},
			"390": {
				direction: "horizontal",
				slidesPerView: 2,
			}
		}
	});
});

document.querySelectorAll(`[data-component*=":staff-slider:"]`).forEach(root => {
	new Swiper(root, {
		wrapperClass: "staff-slider__wrapper",
		slideClass: "staff-slider__slide",
		loop: true,
		"modules": [Autoplay],
		speed: 10000,
		allowTouchMove: false,
		"autoplay": {
			"delay": 0,
		},
		slidesPerView: 1.4,
		breakpoints: {
			992: {
				slidesPerView: "auto",
			},
			768: {
				slidesPerView: 2.4,
			},
			575: {
				slidesPerView: 1.8,
			}
		}
	});
});

document.querySelectorAll(`[data-component*=":news-slider:"]`).forEach(root => {
	const slider = root.querySelector(`[data-elem="news-slider.slider"]`);
	const prev = root.querySelector(`[data-elem="news-slider.prev"]`);
	const next = root.querySelector(`[data-elem="news-slider.next"]`);

	new Swiper(slider, {
		"modules": [Navigation],
		wrapperClass: "news-list-section__wrapper",
		slideClass: "news-list-section__slide",
		loop: true,
		slidesPerView: 1,
		navigation: {
			prevEl: prev,
			nextEl: next
		},
		breakpoints: {
			992: {
				slidesPerView: "auto",
			},
			768: {
				slidesPerView: 2.4,
			},
			575: {
				slidesPerView: 1.6,
			}
		}
	});
});

document.querySelectorAll(`[data-component*=":cases-slider:"]`).forEach(root => {
	const cursor = root.querySelector(".cases-slider-section__cursor");
	const slider = new Swiper(root, {
		wrapperClass: "cases-slider-section__wrapper",
		slideClass: "cases-slider-section__slide",
		direction: "horizontal",
		loop: true,
		spaceBetween: 20,
		slidesPerView: "auto",
	});

	const minTwin = gsap.fromTo(cursor, { scale: 1 }, { scale: 0, duration: 0.3 });

	root.addEventListener("pointerover", () => minTwin.reverse());
	root.addEventListener("pointerout", () => minTwin.play());
	

	let xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3" }),
			yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3" });

	document.addEventListener("pointermove", (e) => {
		xTo(e.clientX - cursor.offsetWidth / 2);
		yTo(e.clientY - cursor.offsetHeight / 2);
	});
});
document.documentElement.classList.add("_initialized");