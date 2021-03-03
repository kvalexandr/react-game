import React from 'react';
import Modal from 'react-modal';
import { sizeField, cardsType, speedType } from '../config/settings';
import InputRange from 'react-input-range';

function Settings(props) {
  const {
    sizeFieldIndex,
    onChangeSizeField,
    cardsTypeIndex,
    onChangeCardsType,
    speedIndex,
    onChangeSpeed,
    viewSettings,
    viewSettingsModal,
    sound,
    onChangeSoundVolume,
    music,
    onChangeMusicVolume
  } = props;

  const sizeSettings = [];
  for (let i = 0; i < sizeField.length; i += 1) {
    sizeSettings.push(
      <button
        key={i}
        className={`btn${i === sizeFieldIndex ? ' active' : ''}`}
        onClick={() => onChangeSizeField(i)}
      >
        {`${sizeField[i].cols}x${sizeField[i].rows}`}
      </button>
    );
  }

  const cardsTypeSettings = [];
  for (let i = 0; i < cardsType.length; i += 1) {
    cardsTypeSettings.push(
      <button
        key={i}
        className={`btn${i === cardsTypeIndex ? ' active' : ''}`}
        onClick={() => onChangeCardsType(i)}
      >
        {`${cardsType[i].name}`}
      </button>
    );
  }

  const speedSettings = [];
  for (let i = 0; i < speedType.length; i += 1) {
    speedSettings.push(
      <button
        key={i}
        className={`btn${i === speedIndex ? ' active' : ''}`}
        onClick={() => onChangeSpeed(i)}
      >
        {`${speedType[i].name}`}
      </button>
    );
  }

  return (
    <Modal
      isOpen={viewSettings}
    >
      <div className="modal-close">
        <i className="material-icons" onClick={viewSettingsModal}>close</i>
      </div>
      <div className="modal-title">Settings</div>

      <div className="settings">
        <div className="settings-section">
          <div className="settings-title">Sound</div>
          <InputRange
            maxValue={100}
            minValue={0}
            value={sound}
            onChange={sound => onChangeSoundVolume(sound)} />
        </div>
        <div className="settings-section">
          <div className="settings-title">Music</div>
          <InputRange
            maxValue={100}
            minValue={0}
            value={music}
            onChange={music => onChangeMusicVolume(music)} />
        </div>
        <div className="settings-section">
          <div className="settings-title">Size field</div>
          {sizeSettings.map(size => size)}
        </div>
        <div className="settings-section">
          <div className="settings-title">Cards type</div>
          {cardsTypeSettings.map(cardType => cardType)}
        </div>
        <div className="settings-section">
          <div className="settings-title">Speed</div>
          {speedSettings.map(speed => speed)}
        </div>
      </div>
    </Modal>
  );
}

export { Settings };
