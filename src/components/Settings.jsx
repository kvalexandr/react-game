import { sizeField, cardsType } from '../config/settings';

function Settings(props) {
  const { sizeFieldIndex, onChangeSizeField, cardsTypeIndex, onChangeCardsType } = props;

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

  return (
    <div className="game-content">
      <div className="settings">
        {sizeSettings.map(size => size)}
        <br />
        <br />
        {cardsTypeSettings.map(cardType => cardType)}
      </div>
    </div>
  );
}

export { Settings };
