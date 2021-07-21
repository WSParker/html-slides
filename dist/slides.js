var styleSheetInit = document.createElement("style");
styleSheetInit.type = "text/css";
styleSheetInit.innerText = `
	.slide * {
		visibility: hidden;
	}
	`;
document.head.appendChild(styleSheetInit);


/**
 * Element.requestFullScreen() polyfill
 * @author Chris Ferdinandi
 * @license MIT
 */
if (!Element.prototype.requestFullscreen) {
	Element.prototype.requestFullscreen = Element.prototype.mozRequestFullscreen || Element.prototype.webkitRequestFullscreen || Element.prototype.msRequestFullscreen;
}
/// End licensed material

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
		image-rendering: optimizeQuality;
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

var styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

window.onload = function() {
	function makeSlideNums(slides) {
		for (var i = 0; i < slides.length; i++) {
			currentAnimation.push(0);
			var slideNum = document.createElement("P");
			slideNum.innerHTML = String(i);
			slides[i].appendChild(slideNum);
			slideNum.classList.add("slide-number");
		}
	}

	function storeState(slideNum, animationNums) {
		if (sessionStorage) {
			sessionStorage.setItem("currentSlide", slideNum);
			sessionStorage.setItem("currentAnimation", JSON.stringify(animationNums));
		}
	}

	function loadState() {
		if (sessionStorage) {
			var oldCurrentSlide = parseInt(sessionStorage.getItem("currentSlide"));
			var oldCurrentAnimation = JSON.parse(sessionStorage.getItem("currentAnimation"));
			if (!(oldCurrentSlide === null) && !(oldCurrentAnimation === null)) {
				currentSlide = mergeSlides(oldCurrentSlide);
				currentAnimation = maxOutAnimations(currentSlide, oldCurrentAnimation);
			}
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

	function checkForForwardSlide(slideNum) {
		if ((slideNum + 1) < slides.length) {
			return (true);
		}
		return (false);
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

	/////////////////////////////////////////////////////////////////////////
	function selectAnimation(slideNum, animationNum) {
		var goAn = slides[slideNum].querySelectorAll(`[class*="ag-"]`);
		var stayAn = slides[slideNum].querySelectorAll(`[class*="as-"]`);
		for (var i = 0; i < goAn.length; i++) {
			if (agClassListContains(goAn[i].classList, animationNum)) {
				goAn[i].classList.remove('hide');
			} else {
				goAn[i].classList.add('hide');
			}
		}
		for (var i = 0; i < stayAn.length; i++) {
			stayAn[i].classList.add('hide');
			for (var j = 0; j < animationNum + 1; j++) {
				if (asClassListContains(stayAn[i].classList, j)) {
					stayAn[i].classList.remove('hide');
				}
			}
		}
		return new Promise((resolve, reject) => {
			resolve();
		})
	}

	function selectSlide(slideNum) {
		for (var i = 0; i < slides.length; i++) {
			slides[i].classList.add("hide");
		}
		slides[slideNum].classList.remove("hide");
		return new Promise((resolve, reject) => {
			resolve();
		})
	}

	function moveForwardOne(rkeydown) {
		var moreAnimations = checkForForwardAnimation(currentSlide, currentAnimation[currentSlide]);
		var moreSlides = checkForForwardSlide(currentSlide);
		if (moreAnimations) {
			currentAnimation[currentSlide] += 1;
			return decodeAnimationImages(currentSlide, currentAnimation[currentSlide]).then(() => {
				selectAnimation(currentSlide, currentAnimation[currentSlide]);
				storeState(currentSlide, currentAnimation);
			});
		} else if ((moreSlides)&&(!rkeydown)) {
			currentSlide += 1;
			return decodeNonAnimationImages(currentSlide).then(() => {
				decodeAnimationImages(currentSlide, currentAnimation[currentSlide]).then(() => {
					selectAnimation(currentSlide, currentAnimation[currentSlide]).then(() => {
						selectSlide(currentSlide);
						storeState(currentSlide, currentAnimation);
					});
				})
			});
		} else {
			return new Promise((res, rej) => {
				res();
			})
		}
	}

	function moveBackOne(lkeydown) {
		var moreAnimations = checkForBackAnimation(currentSlide, currentAnimation[currentSlide]);
		var moreSlides = checkForBackSlide(currentSlide);
		if (moreAnimations) {
			currentAnimation[currentSlide] -= 1;
			return decodeAnimationImages(currentSlide, currentAnimation[currentSlide]).then(() => {
				selectAnimation(currentSlide, currentAnimation[currentSlide]);
				storeState(currentSlide, currentAnimation);
			});
		} else if ((moreSlides)&&(!lkeydown)) {
			currentSlide -= 1;
			return decodeNonAnimationImages(currentSlide).then(() => {
				decodeAnimationImages(currentSlide, currentAnimation[currentSlide]).then(() => {
					selectAnimation(currentSlide, currentAnimation[currentSlide]).then(() => {
						selectSlide(currentSlide);
						storeState(currentSlide, currentAnimation);
					});
				})
			});
		} else {
			return new Promise((res, rej) => {
				res();
			})
		}
	}

	function decodeAnimationImages(slideNum, animationNum) {
		var goAn = slides[slideNum].querySelectorAll(`[class*="ag-"]`);
		var stayAn = slides[slideNum].querySelectorAll(`[class*="as-"]`);
		var promises = [];
		for (var i = 0; i < goAn.length; i++) {
			if (agClassListContains(goAn[i].classList, animationNum)) {
				var subImgs = goAn[i].getElementsByTagName("img");
				for (var j = 0; j < subImgs.length; j++) {
					promises.push(subImgs[j].decode());
				}
				if (goAn[i].tagName == "IMG") {
					console.log(goAn[i].complete);
					promises.push(goAn[i].decode());
				}
			}
		}
		for (var i = 0; i < stayAn.length; i++) {
			if (asClassListContains(stayAn[i].classList, animationNum)) {
				var subImgs = stayAn[i].getElementsByTagName("img");
				for (var j = 0; j < subImgs.length; j++) {
					promises.push(subImgs[j].decode());
				}
				if (stayAn[i].tagName == "IMG") {
					promises.push(stayAn[i].decode());
				}
			}
		}
		return Promise.all(promises);
	}

	function decodeNonAnimationImages(slideNum) {
		var imgs = slides[slideNum].querySelectorAll(`img:not([class*="ag-"]):not([class*="as-"])`);
		var promises = [];
		for (var i = 0; i < imgs.length; i++) {
			promises.push(imgs[i].decode());
		}
		return Promise.all(promises);
	}

	function showCurrentState() {
		selectAnimation(currentSlide, currentAnimation[currentSlide]).then(() => {
			selectSlide(currentSlide);
		})
	}

	var lkeydown = false;
	var rkeydown = false;

	var currentSlide = 0;
	var currentAnimation = [];
	var slides = document.getElementsByClassName("slide");

	var keyDownHandler = function(e) {
		switch(e.code) {
			case "ArrowRight":
				window.removeEventListener('keydown', keyDownHandler);
				moveForwardOne(rkeydown).then(() => {
					window.addEventListener('keydown', keyDownHandler);
				});
				if (!e.shiftKey) {
					rkeydown = true;
				};
				break;
			case "ArrowLeft":
				window.removeEventListener('keydown', keyDownHandler);
				moveBackOne(lkeydown).then(() => {
					window.addEventListener('keydown', keyDownHandler);
				});
				if (!e.shiftKey) {
					lkeydown = true;
				};
				break;
			case "KeyF":
				if (document.fullscreenElement) {
					document.exitFullscreen();
				} else {
					document.documentElement.requestFullscreen();
				}
				break;
		}
	}

	window.addEventListener("keydown", keyDownHandler);

	window.addEventListener("keyup", function(e) {
		if (e.keyCode == 39) {
			rkeydown = false;
		} else if (e.keyCode == 37) {
			lkeydown = false;
		}
	})

	makeSlideNums(slides);

	loadState();

	showCurrentState();

	styleSheetInit.remove();
}
