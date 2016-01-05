import React, { Component } from 'react';
import marked from 'marked'

export class App extends Component {
  constructor(props) {
    super(props);
    window.addEventListener('keydown', this.handleKeypress.bind(this));
    this.state = {
      markdown: '',
      slides: [''],
      slide: 0,
      fullscreen: false,
      editing: false,
      input: `SimpleSlide
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
`
    };
  }

  handleKeypress(event) {
    if(this.state.fullscreen || !this.state.editing) {
      var length = this.state.slides.length - 1;
      switch(event.keyCode) {
        case 37: // left arrow
          this.setState({
            slide: this.state.slide - 1 >= 0 ? this.state.slide - 1 : 0
          })
          break;
        case 39: // right arrow
          this.setState({
            slide: this.state.slide + 1 <= length ? this.state.slide + 1 : length
          })
          break;
        case 27: // esc
          this.setState({
            fullscreen: false
          })
          break;
      }
    }
  }

  createMarkup() {
    var html = marked(this.state.input)
    return {__html: html};
  }

  // show the same rendered slide that the user is currently editing
  handleCursorPosition(event) {
    var self = this;
    var cursor = event.target.selectionStart;

    // decide what counts as a page break
    var regexp = /\n\n( *[-*_]){3,}/gm;
    var pageBreak = event.target.value.match(regexp);

    if(pageBreak) {

      // save the starting index of each page break as in integer
      var fromIndex = 0, pageBreakPositions = [0];
      pageBreak.forEach(function(value, index, array) {
        var pageBreakPosition = self.state.input.indexOf(value, fromIndex);
        fromIndex = pageBreakPosition + 1;
        pageBreakPositions.push(pageBreakPosition + value.length);
      });

      // go to the slide where the user has their cursor within the editor
      pageBreakPositions.forEach(function(value, index, array) {
        if(cursor >= value) {
          self.setState({
            slide: index
          })
        }
      });
    }
  }

  editingMode() {
    this.setState({
      editing: true
    })
  }

  notEditing() {
    this.setState({
      editing: false
    })
  }

  componentDidMount() {
    var markdown = marked(this.state.input)
    var slides = markdown.split("<hr>");
    this.setState({
      input: this.state.input,
      slides: slides,
      slide: 0
    })
  }

  handleMarkdown(event) {
    var markdown = marked(event.target.value)
    var slides = markdown.split("<hr>");
    this.setState({
      input: event.target.value,
      slides: slides,
      slide: slides.length - 1
    })
  }

  changeSlide(event) {
    this.setState({
      slide: event.target.value
    })
  }

  fullscreenToggle() {
    this.setState({
      fullscreen: !this.state.fullscreen
    })
  }

  render() {
    var frameSrc = 'data:text/html;charset=UTF-8,<html><body class="slide-' + this.state.slide + '">' + (this.state.slides[this.state.slide] || '') + '</body></html>';
    return (
      <div className="container-fluid fullHeight">
        <If condition={this.state.fullscreen}>
          <div className="fullscreen">
            <iframe ref="myIframe" src={frameSrc} style={{width: '100%'}}></iframe>
          </div>
        </If>
        <div className="row fullHeight">
          <div className="col-xs-6 fullHeight">
            <textarea className="fullHeight" onFocus={this.editingMode.bind(this)} onBlur={this.notEditing.bind(this)} onChange={this.handleMarkdown.bind(this)} value={this.state.input} onClick={this.handleCursorPosition.bind(this)} onKeyUp={this.handleCursorPosition.bind(this)}/>
          </div>
          <div className="col-xs-6 fullHeight preview aligner">
            <span onClick={this.fullscreenToggle.bind(this)} className="fullscreenToggle glyphicon glyphicon-fullscreen" />
            <div className="alignerItem">
              <iframe ref="myIframe" src={frameSrc} style={{width: '100%'}}></iframe>
              <input type="range" name="points" min="0" max={this.state.slides.length - 1} onChange={this.changeSlide.bind(this)} value={this.state.slide}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
