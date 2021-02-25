import { Card } from '../components/Card';

function Cards(props) {
  const { size } = props;
  const countCard = size.rows * size.cols;
  const widthCard = 100 / size.rows;

  const cards = [];
  for (let i = 0; i < countCard; i += 1) {
    cards.push(<Card style={{ width: `${widthCard}%` }} />);
  }

  return (
    <div className="cards">
      {cards.map(card => card)}
    </div>
  );
}

export { Cards };
