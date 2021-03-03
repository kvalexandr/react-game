function Card(props) {
  const { widthCard, imgId, hidden, clickable, onClick, cardType } = props;

  return (
    <div
      className={`card${hidden ? '' : ' hover'}`}
      style={{ width: `calc(${widthCard}% - 8px)`, height: `100%` }}
      onClick={onClick}
    >
      {/* <img src="./cards/empty.jpg" alt="" className={`empty${hidden ? '' : ' hidden'}`} /> */}
      <div className={`card-front`}></div>
      <div className="card-back">
        <img
          src={`./cards/${cardType.directory}/${imgId}.jpg`}
          alt=""
          className={`${!clickable ? ' found' : ''}`}
        />
      </div>
    </div>
  );
}

export { Card };
