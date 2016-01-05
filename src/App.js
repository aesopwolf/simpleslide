import React, { Component } from 'react';
import marked from 'marked'

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markdown: ''
    }
  }

  createMarkup() {
    return {__html: marked(this.state.markdown)};
  }

  handleMarkdown(event) {
    this.setState({
      markdown: event.target.value
    })
  }

  render() {
    var frameSrc = 'data:text/html;charset=UTF-8,<html><body>' + marked(this.state.markdown) + '</body></html>';
    return (
      <div>
        <textarea onChange={this.handleMarkdown.bind(this)} value={this.state.markdown}/>
        <iframe ref="myIframe" src={frameSrc}></iframe>
      </div>
    );
  }
}
