import React from 'react';

import { ipcRenderer, nativeImage, clipboard } from 'electron';
import {
  IMAGES_REQUEST,
  IMAGES_RESPONSE,
  DELETE_IMAGE,
  UPDATE_IMAGES,
  COPY_TO_CLIPBOARD
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
  deleteImage: function(image, event) {
    ipcRenderer.send(DELETE_IMAGE, image);
  },
  copyToClipboard: function(image, event) {
    ipcRenderer.send(COPY_TO_CLIPBOARD, image);
  },
  render: function() {
    return (
      <div className={`container-fluid ${style.container}`}>
        { this.state.images.length > 0 && (
            this.state.images.map((image, index) => {
              return (
                <div key={image}>
                  <div className="well well-lg text-center">
                    <div className={style.imageContainer}>
                      <img src={`file://${image}`} />
                    </div>
                    <div className={`btn-group ${style.controls}`} role="group" aria-label="...">
                      <button type="button" className="btn btn-default" onClick={this.deleteImage.bind(this, image)}>
                        <span className="glyphicon glyphicon-trash" aria-hidden="true"></span> Delete
                      </button>
                      <button type="button" className="btn btn-default" onClick={this.copyToClipboard.bind(this, image)}>
                        <span className="glyphicon glyphicon-share" aria-hidden="true"></span> Copy to Clipboard
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
