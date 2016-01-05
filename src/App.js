import React, { Component } from 'react';
import marked from 'marked'

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markdown: '',
      slides: [''],
      slide: 0
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
    var regexp = /^( *[-*_]){3,}\n\n/gm;
    var pageBreak = event.target.value.match(regexp);

    if(pageBreak) {

      // save the starting index of each page break as in integer
      var fromIndex = 0, pageBreakPositions = [0];
      pageBreak.forEach(function(value, index, array) {
        var pageBreakPosition = self.state.input.indexOf(value, fromIndex);
        fromIndex = pageBreakPosition + 1;
        pageBreakPositions.push(pageBreakPosition);
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

  handleMarkdown(event) {
    var markdown = marked(event.target.value)
    var slides = markdown.split("<hr>");
    this.setState({
      input: event.target.value,
      slides: slides
    })
  }

  changeSlide(event) {
    this.setState({
      slide: event.target.value
    })
  }

  render() {
    var frameSrc = 'data:text/html;charset=UTF-8,<html><body class="slide-' + this.state.slide + '">' + (this.state.slides[this.state.slide] || '') + '</body></html>';
    return (
      <div>
        <textarea onChange={this.handleMarkdown.bind(this)} value={this.state.input} onClick={this.handleCursorPosition.bind(this)} onKeyUp={this.handleCursorPosition.bind(this)}/>
        <iframe ref="myIframe" src={frameSrc}></iframe>
        <input type="range" name="points" min="0" max={this.state.slides.length - 1} onChange={this.changeSlide.bind(this)} value={this.state.slide}/>
      </div>
    );
  }
}
