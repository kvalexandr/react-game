import { sizeField, cardsType, speedType } from '../config/settings';

function Settings(props) {
  const {
    sizeFieldIndex,
    onChangeSizeField,
    cardsTypeIndex,
    onChangeCardsType,
    speed,
    onChangeSpeed
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
        className={`btn${speedType[i].value === speed ? ' active' : ''}`}
        onClick={() => onChangeSpeed(speedType[i].value)}
      >
        {`${speedType[i].name}`}
      </button>
    );
  }

  return (
    <div className="game-content">
      <div className="settings">
        {sizeSettings.map(size => size)}
        <br />
        <br />
        {cardsTypeSettings.map(cardType => cardType)}
        <br />
        <br />
        {speedSettings.map(speed => speed)}
      </div>
    </div>
  );
}

export { Settings };
