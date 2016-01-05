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

  render() {
    var frameSrc = 'data:text/html;charset=UTF-8,<html><body>' + (this.state.slides[this.state.slide] || '') + '</body></html>';
    return (
      <div>
        <textarea onChange={this.handleMarkdown.bind(this)} value={this.state.input}/>
        <iframe ref="myIframe" src={frameSrc}></iframe>
        <input type="range" name="points" min="0" max={this.state.slides.length - 1} onChange={this.changeSlide.bind(this)} value={this.state.slide}/>
      </div>
    );
  }
}
