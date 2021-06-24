var styleSheetInit = document.createElement("style");
styleSheetInit.type = "text/css";
styleSheetInit.innerText = `
	html {
		visibility: hidden;
	}
	`;
document.head.appendChild(styleSheetInit);

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

window.onload = function() {
	function preDecodeImages() {
		var imgs = document.getElementsByTagName("img");
		for (var i = 0; i < imgs.length; i++) {
			imgs[i].decode();
		}
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
			if (agClassListContains(goAn[i].classList,animationNum)) {
				goAn[i].classList.remove("hide");
			} else {
				goAn[i].classList.add("hide");
			}
		}

		var stayAn = slides[slideNum].querySelectorAll(`[class*="as-"]`);
		for (var i = 0; i < stayAn.length; i++) {
			stayAn[i].classList.add("hide");
			for (var j = 0; j < animationNum + 1; j++) {
				if (asClassListContains(stayAn[i].classList, j)) {
					stayAn[i].classList.remove("hide");
				}
			}
		}
	}

	function agClassListContains(classList, number) {
		var expr = new RegExp(`^ag(-[0-9]+)*-${number}((-[0-9]*)|$)+`);
		for (var i = 0; i < classList.length; i++) {
			if (expr.test(classList[i])) {
				return true;
			}
		}
		return false;
	}

	function asClassListContains(classList, number) {
		var expr = new RegExp(`^as-${ number }$`);
		for (var i = 0; i < classList.length; i++) {
			if (expr.test(classList[i])) {
				return true;
			}
		}
		return false;
	}

	function moveForwardOne(rkeydown) {
		var moreAnimations = checkForForwardAnimation(currentSlide, currentAnimation[currentSlide]);
		var moreSlides = checkForForwardSlide(currentSlide);
		if (moreAnimations) {
			currentAnimation[currentSlide] += 1;
			showCurrentState(currentSlide, currentAnimation[currentSlide]);
		} else if ((moreSlides)&&(!rkeydown)) {
			currentSlide += 1;
			showCurrentState(currentSlide, currentAnimation[currentSlide]);
		}
	}

	function checkForForwardAnimation(slideNum, animationNum) {
		var goAn = slides[slideNum].querySelectorAll(`[class*="ag-"]`);
		var stayAn = slides[slideNum].querySelectorAll(`[class*="as-"]`);
		for (var i = 0; i < goAn.length; i++) {
			if (agClassListContains(goAn[i].classList, animationNum + 1)) {
				return (true);
			}
		}
		for (var i = 0; i < stayAn.length; i++) {
			if (asClassListContains(stayAn[i].classList,animationNum + 1)) {
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

	function moveBackOne(lkeydown) {
		var moreAnimations = checkForBackAnimation(currentSlide, currentAnimation[currentSlide]);
		var moreSlides = checkForBackSlide(currentSlide);
		if (moreAnimations) {
			currentAnimation[currentSlide] -= 1;
			showCurrentState(currentSlide, currentAnimation[currentSlide]);
		} else if ((moreSlides)&&(!lkeydown)) {
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

	function setStyles() {
		var styleSheet = document.createElement("style");
		styleSheet.type = "text/css";
		styleSheet.innerText = styles;
		document.head.appendChild(styleSheet);

		document.body.style.visibility = 'visible';
	}

	function makeSlideNums() {
		for (var i = 0; i < slides.length; i++) {
			currentAnimation.push(0);
			var slideNum = document.createElement("P");
			slideNum.innerHTML = String(i);
			slides[i].appendChild(slideNum);
			slideNum.classList.add("slide-number");
		}
	}

	var lkeydown = false;
	var rkeydown = false;

	var currentSlide = 0;
	var currentAnimation = [];
	var slides = document.getElementsByClassName("slide");

	window.addEventListener("keydown", function(e) {
		if (e.keyCode == 39) {
			moveForwardOne(rkeydown);
			if (!e.shiftKey) {
				rkeydown = true;
			}
		} else if (e.keyCode === 37) {
			moveBackOne(lkeydown);
			if (!e.shiftKey) {
				lkeydown = true
			}
		}
	})

	window.addEventListener("keyup", function(e) {
		if (e.keyCode == 39) {
			rkeydown = false;
		} else if (e.keyCode == 37) {
			lkeydown = false;
		}
	})

	preDecodeImages();

	makeSlideNums();

	setStyles();

	loadState();

	showCurrentState();
}
