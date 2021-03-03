function Card(props) {
  const { widthCard, id, imgId, hidden, clickable, onClick, cardType } = props;

  return (
    <div
      className="card"
      style={{ width: `${widthCard}%` }}
      onClick={onClick}
    >
      <img src="./cards/empty.jpg" alt="" data-id={id} className={`empty${hidden ? '' : ' hidden'}`} />
      <img
        src={`./cards/${cardType.directory}/${imgId}.jpg`}
        alt=""
        className={`real${hidden ? ' hidden' : ''}${!clickable ? ' found' : ''}`}
      />
    </div>
  );
}

export { Card };
