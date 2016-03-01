import React from 'react';
import styles from './style.css';

import ComponentGallery from 'react-component-gallery';
import GalleryFile from '../gallery-file/gallery-file';

import remote from 'remote';
import _ from 'lodash';

import { COPY_TO_CLIPBOARD, OPEN_FILE } from '../../../shared/constants';

import { ipcRenderer } from 'electron';

const { getFolder } = remote.require(process.env.APP_DIR + '/dist/config');
const { getFiles } = remote.require(process.env.APP_DIR + '/dist/utils');

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
                           copyToClipboard={() => ipcRenderer.send(COPY_TO_CLIPBOARD, file.url)}
                           openFile={() => ipcRenderer.send(OPEN_FILE, file.url)} />
            ))
          }
        </ComponentGallery>
      </div>
    );
  }
});
