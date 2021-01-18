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
	body {
		font-size: calc(.25 * min(16vh, 9vw));
		overflow: hidden;
		padding: 0px;
		margin: 0px;
		height: 100vh;
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: black;
	}
	#title, #author, #date {
		text-align: center;
	}
	.slide {
		position: relative;
		padding: 0em 2em;
		box-sizing: border-box;
		width: calc(1600vh / 9);
		height: calc(900vw / 16);
		max-height: 100vh;
		max-width: 100vw;
		background-color: white;
	}
	img {
		width: 20em;
	}
	.hide {
		display: none;
	}
	.slide-number {
		position: absolute;
		bottom: 0;
		right: 1.5em;
		text-align: right;
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
		slides[i].appendChild(slideNum);
		slideNum.classList.add("slide-number");
	}

	function storeState() {
		sessionStorage.setItem("currentSlide", currentSlide);
		sessionStorage.setItem("currentAnimation", JSON.stringify(currentAnimation));
	}

	function loadState() {
		var oldCurrentSlide = parseInt(sessionStorage.getItem("currentSlide"));
		var oldCurrentAnimation = JSON.parse(sessionStorage.getItem("currentAnimation"));
		if (!(oldCurrentSlide === null) && !(oldCurrentAnimation === null)) {
			currentSlide = mergeSlides(oldCurrentSlide);
			currentAnimation = maxOutAnimations(currentSlide, oldCurrentAnimation);
		}
	}

	function mergeSlides(oldCurrentSlide) {
		var outval = 0;
		if (oldCurrentSlide + 1 > slides.length) {
			return (slides.length - 1)
		}
		return (oldCurrentSlide);
	}

	function maxOutAnimations(slideNum, oldCurrentAnimation) {
		var test = currentAnimation;
		for (var i = 0; i < slideNum; i++) {
			test[i] = findMaxAnimations(i);
		}
		if (!(oldCurrentAnimation[slideNum] === undefined)) {
			test[slideNum] = Math.min(oldCurrentAnimation[slideNum], findMaxAnimations(slideNum));
		}
		return (test)
	}

	function findMaxAnimations(slideNum) {
		var maxAnimation = 0;
		while (checkForForwardAnimation(slideNum, maxAnimation)) {
			maxAnimation += 1;
		}
		return (maxAnimation);
	}

	/////////////////////////////////////////////////////////////////////////
	function showCurrentState() {
		selectSlide(currentSlide);
		selectAnimation(currentSlide, currentAnimation[currentSlide]);
		storeState();
	}

	function selectSlide(slideNum) {
		for (var i = 0; i < slides.length; i++) {
			slides[i].classList.add("hide");
		}
		slides[slideNum].classList.remove("hide");
	}

	function selectAnimation(slideNum, animationNum) {
		var goAn = slides[slideNum].querySelectorAll(`[class*="ag-"]`);
		for (var i = 0; i < goAn.length; i++) {
			if (goAnClassListContains(goAn[i],animationNum)) {
				goAn[i].classList.remove("hide");
			} else {
				goAn[i].classList.add("hide");
			}
		}

		var stayAn = slides[slideNum].querySelectorAll(`[class*="as-"]`);
		for (var i = 0; i < stayAn.length; i++) {
			stayAn[i].classList.add("hide");
			for (var j = 0; j < animationNum + 1; j++) {
				if (stayAn[i].classList.contains("as-"+String(j))) {
					stayAn[i].classList.remove("hide");
				}
			}
		}
	}

	function moveForwardOne() {
		var moreAnimations = checkForForwardAnimation(currentSlide, currentAnimation[currentSlide]);
		var moreSlides = checkForForwardSlide(currentSlide);
		if (moreAnimations) {
			currentAnimation[currentSlide] += 1;
			showCurrentState(currentSlide, currentAnimation[currentSlide]);
		} else if (moreSlides) {
			currentSlide += 1;
			showCurrentState(currentSlide, currentAnimation[currentSlide]);
		}
	}

	function goAnClassListContains(goAn, animationNum) {
		var cl = goAn.classList;
		for (var i = 0; i < cl.length; i++) {
			if (cl[i].slice(0,2) == 'ag') {
				if (cl[i].includes('-'+String(animationNum))) {
					return(true);
				}
			}
		}
		return(false);
	}

	function checkForForwardAnimation(slideNum, animationNum) {
		var goAn = slides[slideNum].querySelectorAll(`[class*="ag-"]`);
		var stayAn = slides[slideNum].querySelectorAll(`[class*="as-"]`);
		for (var i = 0; i < goAn.length; i++) {
			if (goAnClassListContains(goAn[i], animationNum + 1)) {
				return (true);
			}
		}
		for (var i = 0; i < stayAn.length; i++) {
			if (stayAn[i].classList.contains('as-'+String(animationNum + 1))) {
				return (true);
			}
		}
		return (false);
	}

	function checkForForwardSlide(slideNum) {
		if ((slideNum + 1) < slides.length) {
			return (true);
		}
		return (false);
	}

	function moveBackOne() {
		var moreAnimations = checkForBackAnimation(currentSlide, currentAnimation[currentSlide]);
		var moreSlides = checkForBackSlide(currentSlide);
		if (moreAnimations) {
			currentAnimation[currentSlide] -= 1;
			showCurrentState(currentSlide, currentAnimation[currentSlide]);
		} else if (moreSlides) {
			currentSlide -= 1;
			showCurrentState(currentSlide, currentAnimation[currentSlide]);
		}
	}

	function checkForBackAnimation(slideNum, animationNum) {
		if ((animationNum) > 0) {
			return (true);
		}
		return (false);
	}

	function checkForBackSlide(slideNum) {
		if ((slideNum) > 0) {
			return (true);
		}
		return (false);
	}

	window.addEventListener("keydown", function(e) {
		if (e.keyCode === 39) {
			moveForwardOne();
		} else if (e.keyCode === 37) {
			moveBackOne();
		}
	})

	loadState();

	showCurrentState();
}
