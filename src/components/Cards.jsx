import { Card } from '../components/Card';


function Cards(props) {
  const { cards, cardType, onViewCard } = props;
  // const cards = [];
  // for (let i = 0; i < countCard; i += 1) {
  //   cards.push(
  //     <Card
  //       key={i}
  //       widthCard={widthCard}
  //       onClick={() => onViewCard()}
  //       cardId={i}
  //     />
  //   );
  // }

  return (
    <div className="cards">
      {cards.map(card => <Card key={card.id} cardType={cardType} onClick={() => onViewCard(card)} {...card} />)}
    </div>
  );
}

export { Cards };
