function Card(props) {
  return (
    <div className="card" id={props.id}>
      <div className="card-image waves-effect waves-block waves-light">
        <img src="./cards/empty.jpg" alt="" />
      </div>
    </div>
  );
}

export { Card };
