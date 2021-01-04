# html-slides

html-slides allows you to write html and have it present as a slideshow. I
basically wrote it for personal use, and only made it public so I can use it from
a CDN (via jsdelivr).

That said, if you ~~hate powerpoint with a passion~~ want to easily make slideshows in HTML and type equations in LaTeX, give it a try. Usage is
simple, functionality is minimal.

You can:

1. Display one slide at a time using right/left arrows and the spacebar.
2. Display elements within each slide one at a time and have them stay for the rest of the slide or disappear.
3. Use LaTeX via MathJax.

## Usage

Include html-slides by adding ```<script src="https://cdn.jsdelivr.net/gh/WSParker/html-slides@main/dist/slides.min.js" type='text/javascript'></script>``` to the head of your HTML.

html-slides uses three classes: ```.slide```, ```.as-n```, and ```.ag-n-m```.

1. ```class="slide"``` defines a slide. It will get its own slide number at the bottom right.
2. ```class="as-n"``` defines an element that will appear on the n<sup>th</sup> rightarrow (or spacebar) **after** its containing slide appears, and stay for the duration of the slide.
3. <code>class="ag-n<sub>1</sub>-n<sub>2</sub>-n<sub>3</sub>"</code> defines an element that will be visible for the n<sub>1</sub><sup>th</sup>, n<sub>2</sub><sup>th</sup>, and n<sub>3</sub><sup>th</sup> rightarrows **after** its containing slide appears, but will disappear after that.

Check out the demo [here](demo/demo.html).

## Gotchas

Anything not inside a ```.slide``` container won't be handled by html-slides. It will probably just be visible throughout the presentation.

If you skip a number in your animations, (i.e., you have 1 2 3 5), nothing after that skipped number will show up.
