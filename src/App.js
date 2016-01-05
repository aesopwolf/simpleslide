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
    return (
      <div>
        <textarea onChange={this.handleMarkdown.bind(this)} value={this.state.markdown}/>
        <div dangerouslySetInnerHTML={this.createMarkup()} />
      </div>
    );
  }
}
