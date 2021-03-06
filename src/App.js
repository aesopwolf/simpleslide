import React, { Component } from 'react';
import marked from 'marked'

import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/css';
import 'brace/theme/github';

import * as defaults from './defaults';

export class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      css: defaults.css,
      editing: false,
      fullscreen: false,
      input: defaults.input,
      markdown: '',
      mode: 'content',
      slides: [''],
      slide: 0
    };

    // enable keyboard shortcuts
    window.addEventListener('keydown', this.handleKeypress.bind(this));
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

  // keyboard shortcuts
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

  // used to dangerouslysetinnerhtml
  createMarkup() {
    var html = marked(this.state.input)
    return {__html: html};
  }

  // the preview panel should show the same slide that the user is editing
  handleCursorPosition(event) {
    var self = this;
    var cursor = event.target.selectionStart;

    // decide what counts as a page break
    var regexp = /\n\n( *[-*_]){3,}/gm;
    var pageBreak = event.target.value.match(regexp);

    // we only need to run this if there are multiple slides
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

  // turn the input into actual markdown
  handleMarkdown(event) {
    var markdown = marked(event.target.value)

    // we should split the slides based on <hr>'s
    var slides = markdown.split("<hr>");
    this.setState({
      input: event.target.value,
      slides: slides
    })
  }

  // change the slide using the input range element
  changeSlide(event) {
    this.setState({
      slide: parseInt(event.target.value, 10)
    })
  }

  // go back a slide
  previousSlide() {
    var length = this.state.slides.length - 1;
    this.setState({
      slide: this.state.slide - 1 >= 0 ? this.state.slide - 1 : 0
    })
  }

  // advance to the next slide
  nextSlide() {
    var length = this.state.slides.length - 1;
    this.setState({
      slide: this.state.slide + 1 <= length ? this.state.slide + 1 : length
    })
  }

  // make the preview panel full screen (or not)
  fullscreenToggle() {
    this.setState({
      fullscreen: !this.state.fullscreen
    })
  }

  // editing flag is set to disable/enable keyboard shortcuts
  editingMode(editing) {
    this.setState({
      editing: editing
    })
  }

  // take input from the ace editor and save it to react state
  handleCSS(css) {
    this.setState({
      css: css
    })
  }

  // is the user editing content or css?
  mode(mode) {
    this.setState({
      mode: mode
    })
  }

  render() {
    var frameSrc = 'data:text/html;charset=UTF-8,<html><body class="slide-' + this.state.slide + '"><div class="slide">' + (this.state.slides[this.state.slide] || '') + '</div><style>' + this.state.css + '</style></body></html>';
    return (
      <div className="container-fluid fullHeight">
        <If condition={this.state.fullscreen}>
          <div className="fullscreen">
            <iframe className="fullHeight" ref="myIframe" src={frameSrc} style={{width: '100%'}}></iframe>
          </div>
        </If>
        <div className="row fullHeight">
          <div className="col-xs-6 fullHeight">
            <ul className="nav nav-tabs">
              <li className={this.state.mode == 'content' ? 'active' : ''}><a className="hover" onClick={this.mode.bind(this, 'content')}>Content</a></li>
              <li className={this.state.mode == 'style' ? 'active' : ''}><a className="hover" onClick={this.mode.bind(this, 'style')}>Style</a></li>
            </ul>
            <If condition={this.state.mode === 'content'}>
              <textarea style={{height: "calc(100% - 42px)"}} value={this.state.input} onFocus={this.editingMode.bind(this, true)} onBlur={this.editingMode.bind(this, false)} onChange={this.handleMarkdown.bind(this)} onClick={this.handleCursorPosition.bind(this)} onKeyPress={this.handleCursorPosition.bind(this)}/>
            </If>
            <If condition={this.state.mode === 'style'}>
              <AceEditor
                mode="css"
                theme="github"
                name="styleEditor"
                height="calc(100% - 42px)"
                width="100%"
                onFocus={this.editingMode.bind(this)}
                onBlur={this.notEditing.bind(this)}
                onChange={this.handleCSS.bind(this)}
                value={this.state.css}
                editorProps={{$blockScrolling: true}}
              />
            </If>
          </div>
          <div className="col-xs-6 fullHeight preview aligner">
            <span onClick={this.fullscreenToggle.bind(this)} className="fullscreenToggle glyphicon glyphicon-fullscreen" />
            <div className="alignerItem">
              <iframe ref="myIframe" src={frameSrc} style={{width: '100%'}}></iframe>

              <div className="padding">
                <input type="range" name="points" min="0" max={this.state.slides.length - 1} onChange={this.changeSlide.bind(this)} value={this.state.slide}/>
                <div className="btn-group btn-group-justified">
                  <div className="btn-group btn-group-xs">
                    <button type="button" className="btn btn-default" onClick={this.previousSlide.bind(this)}><span className="glyphicon glyphicon-chevron-left" /></button>
                  </div>
                  <div className="btn-group btn-group-xs">
                    <button type="button" className="btn btn-default" onClick={this.nextSlide.bind(this)}><span className="glyphicon glyphicon-chevron-right" /></button>
                  </div>
                </div>
                <p className="text-center"><small>{(this.state.slide + 1)} / {this.state.slides.length}</small></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
