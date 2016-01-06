export const css = `html, body {
  height: 100%
}
body {
  background: #fff;
  color: #333;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  min-height: 4em;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  font-size: 1.4em;
}

.slide {
  -webkit-box-flex: 0;
  -webkit-flex: none;
  -ms-flex: none;
  flex: none;
  max-width: 75%;
}

a {
  color: #333;
}`;

export const input = `SimpleSlide
-----------

*SimpleSlide* is pretty easy to use:

1. Enter markdown in the left pane
1. Separate slides by using 3 or more asterisks (one of these: *)
1. See the output as a slideshow in the right pane

***

Contact information
-------------------

If you have any questions you can email me at [aesopwolf@gmail.com](mailto:aesopwolf@gmail.com)

Or you can [file a bug report](https://github.com/aesopwolf/simpleslide/issues)
`;
