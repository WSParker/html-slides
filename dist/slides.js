var styleSheetInit = document.createElement("style");
styleSheetInit.type = "text/css";
styleSheetInit.innerText = `
	html {visibility: hidden;}
	`;
document.head.appendChild(styleSheetInit);

var mj = document.createElement("script");
mj.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_CHTML-full");
mj.setAttribute("type", "text/javascript");
document.head.appendChild(mj);

var styles = `
	#title, #author, #date {
		text-align: center;
	}
	#title {
		padding-top: 100px;
	}
	.slide {
		margin: 60px;
	}
	.hide {
		display: none;
	}
`;

var styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

window.onload = function() {
	document.head.removeChild(styleSheetInit);

	var currentSlide = 0;
	var currentAnimation = [];

	var slides = document.getElementsByClassName("slide");
	for (var i = 0; i < slides.length; i++) {
		currentAnimation.push(0);
		slides[i].classList.add("hide");
		var slideNum = document.createElement("P");
		slideNum.innerHTML = String(i);
		slideNum.style = "position: absolute; bottom: 20px; right: 30px; font-size:20px;"
		slides[i].appendChild(slideNum);
	}

	if (!(localStorage.getItem("currentSlide") === null)) {
		currentSlide = parseInt(localStorage.getItem("currentSlide"));
	}
	if (!(localStorage.getItem("currentAnimation") === null)) {
		if (JSON.parse(localStorage.getItem("currentAnimation")).length === slides.length) {
			currentAnimation = JSON.parse(localStorage.getItem("currentAnimation"));
		}
		initializeNewSlide();
	}

	slides[currentSlide].classList.remove("hide");

	function lastSlide() {
		if (currentSlide + 1 < slides.length) {
			return (false);
		}
		return (true);
	}

	function firstSlide() {
		if (currentSlide > 0) {
			return (false);
		}
		return (true);
	}

	function hasAnimations() {
		if (slides[currentSlide].querySelectorAll(".animate-go, .animate-stay").length > 0) {
			return (true);
		} else {
			return (false);
		}
	}

	function lastAnimation() {
		var animations = slides[currentSlide].querySelectorAll(".animate-go, .animate-stay");
		for (var i = 0; i < animations.length; i++) {
			if (animations[i].classList.contains(String(currentAnimation[currentSlide] + 1))) {
				return (false);
			}
		}
		return (true);
	}

	function firstAnimation() {
		if (currentAnimation[currentSlide] > 0) {
			return (false);
		}
		return (true);
	}

	function increaseSlide() {
		slides[currentSlide].classList.add("hide");
		currentSlide += 1;
		slides[currentSlide].classList.remove("hide");
		initializeNewSlide();
	}

	function initializeNewSlide() {
		var goAnimations = slides[currentSlide].querySelectorAll(".animate-go");
		var stayAnimations = slides[currentSlide].querySelectorAll(".animate-stay");
		for (var i = 0; i < goAnimations.length; i++) {
			if (!goAnimations[i].classList.contains(String(currentAnimation[currentSlide]))) {
				goAnimations[i].classList.add("hide");
			}
		}
		for (var i = 0; i < stayAnimations.length; i++) {
			stayAnimations[i].classList.add("hide");
			for (var j = 0; j < currentAnimation[currentSlide] + 1; j++) {
				if (stayAnimations[i].classList.contains(String(j))) {
					stayAnimations[i].classList.remove("hide");
				}
			}
		}
	}

	function decreaseSlide() {
		slides[currentSlide].classList.add("hide");
		currentSlide -= 1;
		slides[currentSlide].classList.remove("hide");
	}

	function decreaseAnimation() {
		var animateGo = slides[currentSlide].getElementsByClassName("animate-go " + String(currentAnimation[currentSlide]));
		var animateStay = slides[currentSlide].getElementsByClassName("animate-stay " + String(currentAnimation[currentSlide]));
		for (var i = 0; i < animateGo.length; i++) {
			animateGo[i].classList.add("hide");
		}
		for (var i = 0; i < animateStay.length; i++) {
			animateStay[i].classList.add("hide");
		}
		currentAnimation[currentSlide] -= 1;
		animateGo = slides[currentSlide].getElementsByClassName("animate-go " + String(currentAnimation[currentSlide]));
		for (var i = 0; i < animateGo.length; i++) {
			animateGo[i].classList.remove("hide");
		}
	}

	function increaseAnimation() {
		var animateGo = slides[currentSlide].getElementsByClassName("animate-go " + String(currentAnimation[currentSlide]));
		for (var i = 0; i < animateGo.length; i++) {
			animateGo[i].classList.add("hide");
		}
		currentAnimation[currentSlide] += 1;
		animateGo = slides[currentSlide].getElementsByClassName("animate-go " + String(currentAnimation[currentSlide]));
		var animateStay = slides[currentSlide].getElementsByClassName("animate-stay " + String(currentAnimation[currentSlide]));
		for (var i = 0; i < animateGo.length; i++) {
			animateGo[i].classList.remove("hide");
		}
		for (var i = 0; i < animateStay.length; i++) {
			animateStay[i].classList.remove("hide");
		}
	}

	window.addEventListener("keydown", function(e) {
		if ((e.keyCode === 39) || (e.keyCode === 32)) {
			if (hasAnimations()) {
				if (!lastAnimation()) {
					increaseAnimation();
				} else if (!lastSlide()) {
					increaseSlide();
				}
			} else if (!lastSlide()) {
				increaseSlide();
			}
		} else if (e.keyCode === 37) {
			if (hasAnimations()) {
				if (!firstAnimation()) {
					decreaseAnimation();
				} else if (!firstSlide()) {
					decreaseSlide();
				}
			} else if (!firstSlide()) {
				decreaseSlide();
			}
		}
		localStorage.setItem("currentSlide", currentSlide);
		localStorage.setItem("currentAnimation", JSON.stringify(currentAnimation));
	})
}
