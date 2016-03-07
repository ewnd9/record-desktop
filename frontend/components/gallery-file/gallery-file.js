import React from 'react';
import styles from './style.css';

export default React.createClass({
  getInitialState: () => ({ resolution: '' }),
  getResolution() {
    setTimeout(() => {
      this.setState({
        resolution: `${this.refs.img.naturalWidth}x${this.refs.img.naturalHeight}`
      });
    }, 100);
  },
  componentDidMount() {
    if (this.props.file.visible) {
      this.getResolution();
    }
  },
  componentWillReceiveProps(nextProps) {
    if (!this.state.resolution && nextProps.file.visible) {
      this.getResolution();
    }
  },
  render() {
    const {
      file,
      copyToClipboard,
      openFile,
      onClickDelete,
      upload
    } = this.props;

    const url = `file://${file.url}`;

    return (
      <div className={`imageBlock ${styles.imageBlock}`}>
        <img ref="img" src={file.visible ? file.url : ''} />
        <span className={styles.label}>

          <span>{file.filename}</span>
          <span className={`${styles.menuIcon}`}>
            <span className="glyphicon glyphicon-cog" aria-hidden="true"></span>

            <div className={styles.fileMenu}>
              <ul>
                <li><a onClick={upload}>Upload to imgur</a></li>
                <li><a onClick={copyToClipboard}>Copy to clipboard</a></li>
                <li><a onClick={openFile}>Open in image viewer</a></li>
                <li><a onClick={onClickDelete}>Delete</a></li>
                <li>{`${this.state.resolution} ${file.size}`}</li>
              </ul>
            </div>
          </span>

        </span>
      </div>
    );
  }
});
