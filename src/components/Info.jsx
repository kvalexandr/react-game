import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function Info(props) {
  const { viewInfo, viewInfoModal } = props;

  return (
    <Modal
      isOpen={viewInfo}
    >
      <div className="modal-close">
        <i className="material-icons" onClick={viewInfoModal}>close</i>
      </div>
      <div className="modal-title">Memory game</div>
      <p>Keep your mind young and vigorous by challenging it with games that require using your memory. </p>

      <div className="modal-title">Hot keys</div>
      <div className="hotkey-info">
        <span class="btn disabled">Shift + M</span> - mute music and sound
      </div>
      <div className="hotkey-info">
        <span class="btn disabled">Shift + N</span> - new game
      </div>
      <div className="hotkey-info">
        <span class="btn disabled">Shift + S</span> - change size field
      </div>
      <div className="hotkey-info">
        <span class="btn disabled">Shift + T</span> - change type cards
      </div>
      <div className="hotkey-info">
        <span class="btn disabled">Shift + X</span> - change speed
      </div>
    </Modal>
  );
}

export { Info };
