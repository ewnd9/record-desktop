import React from 'react';

import { ipcRenderer, nativeImage, clipboard } from 'electron';
import {
  IMAGES_REQUEST,
  IMAGES_RESPONSE,
  DELETE_IMAGE,
  UPDATE_IMAGES,
  COPY_TO_CLIPBOARD,
  OPEN_FILE
} from './../../../shared/constants';

import style from './image-list.css';

export default React.createClass({
  getInitialState: () => ({ images: [] }),
  componentDidMount: function() {
    ipcRenderer.on(IMAGES_RESPONSE, (event, images) => {
      images.sort().reverse();
      this.setState({ images: images });
    });
    ipcRenderer.on(UPDATE_IMAGES, (event, images) => {
      this.loadImages();
    });
    this.loadImages();
  },
  loadImages: function() {
    ipcRenderer.send(IMAGES_REQUEST);
  },
  sendMessage: function (event, image) {
    ipcRenderer.send(event, image); // consistency
  },
  render: function() {
    return (
      <div className={`container-fluid ${style.container}`}>
        { this.state.images.length > 0 && (
            this.state.images.map((image, index) => {
              const isGif = /\.gif$/.test(image);
              return (
                <div key={image}>
                  <div className="well well-lg text-center">
                    <div className={style.imageContainer}>
                      <img src={`file://${image}`} />
                    </div>
                    <div className={`btn-group ${style.controls}`} role="group" aria-label="...">
                      <button type="button" className="btn btn-default" onClick={this.sendMessage.bind(this, OPEN_FILE, image)}>
                        <span className="glyphicon glyphicon-open" aria-hidden="true"></span> Open File
                      </button>
                      {
                        !isGif && (
                          <button type="button" className="btn btn-default" onClick={this.sendMessage.bind(this, COPY_TO_CLIPBOARD, image)}>
                            <span className="glyphicon glyphicon-share" aria-hidden="true"></span> Copy to Clipboard
                          </button>
                        )
                      }
                      <button type="button" className="btn btn-default" onClick={this.sendMessage.bind(this, DELETE_IMAGE, image)}>
                        <span className="glyphicon glyphicon-trash" aria-hidden="true"></span> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
        ) || (
          <div className="well well-lg text-center">
            Try to create a new one
          </div>
        )}
      </div>
    );
  }
});
