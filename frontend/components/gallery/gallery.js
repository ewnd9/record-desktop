import React from 'react';
import styles from './style.css';

import ComponentGallery from 'react-component-gallery';
import GalleryFile from '../gallery-file/gallery-file';

import remote from 'remote';
import _ from 'lodash';

import {
  COPY_TO_CLIPBOARD,
  OPEN_FILE,
  DELETE_FILE,
  UPLOAD
} from '../../../shared/constants';

import { ipcRenderer } from 'electron';

const { getFolder } = remote.require(process.env.APP_DIR + '/dist/config');
const { getFiles, deleteFile } = remote.require(process.env.APP_DIR + '/dist/utils');

import detectViewport from './detect-viewport';

export default React.createClass({
  getInitialState: () => ({ files: [] }),
  componentDidMount() {
    this.setState({
      files: getFiles(getFolder()).map((file, index) => ({
        ...file,
        visible: index < 10
      }))
    });

    const onPageScroll = () => {
      const visibility = detectViewport('.imageBlock');

      this.setState({
        files: this.state.files.map((file, index) => ({
          ...file,
          visible: visibility[index]
        }))
      });
    };

    window.onscroll = _.debounce(onPageScroll, 50, { trailing: true });
  },
  componentWillUnmount() {
    window.onscroll = null;
  },
  onClickDelete(index) {
    const file = this.state.files[index];
    ipcRenderer.send(DELETE_FILE, file.url);

    this.setState({
      files: [
        ...this.state.files.slice(0, index),
        ...this.state.files.slice(index + 1)
      ]
    });
  },
  render() {
    return (
      <div>
        <ComponentGallery
          margin={10}
          widthHeightRatio={3/5}
          targetWidth={350}>
          {
            this.state.files.map((file, index) => (
              <GalleryFile key={file.url}
                           file={file}
                           upload={() => ipcRenderer.send(UPLOAD, file.url)}
                           copyToClipboard={() => ipcRenderer.send(COPY_TO_CLIPBOARD, file.url)}
                           onClickDelete={() => this.onClickDelete(index)}
                           openFile={() => ipcRenderer.send(OPEN_FILE, file.url)} />
            ))
          }
        </ComponentGallery>
      </div>
    );
  }
});
