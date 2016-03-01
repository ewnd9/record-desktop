import React from 'react';
import styles from './style.css';

export default React.createClass({
  render() {
    const {
      file,
      copyToClipboard,
      openFile,
      onClickDelete
    } = this.props;

    const url = `file://${file.url}`;

    return (
      <div className={`imageBlock ${styles.imageBlock}`}>
        <img src={file.visible ? file.url : ''} />
        <span className={styles.label}>

          <span>{file.filename}</span>
          <span className={`${styles.menuIcon}`}>
            <span className="glyphicon glyphicon-cog" aria-hidden="true"></span>

            <div className={styles.fileMenu}>
              <ul>
                <li><a onClick={copyToClipboard}>Copy to a clipboard</a></li>
                <li><a onClick={openFile}>Open in file manager</a></li>
                <li><a onClick={onClickDelete}>Delete</a></li>
              </ul>
            </div>
          </span>

        </span>
      </div>
    );
  }
});
