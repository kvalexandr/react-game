import React, { Component } from 'react';
import { Card } from '../components/Card';
import { Stats } from '../components/Stats';
import { Settings } from '../components/Settings';
import { sizeField, cardsType } from '../config/settings';
import { shuffleArray, getStorage, addStorage, getTimeText } from '../utils/utils';
import InputRange from 'react-input-range';

class Main extends Component {
  state = {
    cards: [],
    firstCard: null,
    secondCard: null,
    isStarted: false,
    isFinished: false,
    sizeFieldIndex: 0,
    cardsTypeIndex: 0,
    speed: 1000,
    moves: 0,
    timer: 0,
    sound: 30,
    music: 0,
    viewStats: false
  };

  startGame = () => {
    this.generateCard(this.state.sizeFieldIndex);
    this.setState({
      firstCard: null,
      secondCard: null,
      isStarted: true,
      moves: 0,
      timer: 0
    });
    this.audioFon.play();
    this.audioFon.currentTime = 0;

    this.timerId = setInterval(() => {
      this.setState(prevState => ({ timer: prevState.timer + 1 }));
    }, 1000);
  }

  endGame = () => {
    this.setState({
      isStarted: false,
      isFinished: true
    });
    this.audioFon.pause();
    clearInterval(this.timerId);

    const stats = getStorage('mg_stats');
    const size = sizeField[this.state.sizeFieldIndex];
    stats.unshift({
      timer: this.state.timer,
      moves: this.state.moves,
      date: new Date().toLocaleString(),
      size: `${size.rows}x${size.cols}`
    });
    addStorage(stats.slice(0, 10), 'mg_stats');
  }

  generateCard = (sizeFieldIndex) => {
    const size = sizeField[sizeFieldIndex];
    const countCard = size.rows * size.cols;
    const widthCard = 100 / size.cols;

    const cards = [];
    for (let i = 0; i < countCard; i += 1) {
      cards.push({
        id: i,
        imgId: i < countCard / 2 ? i : i - countCard / 2,
        hidden: true,
        clickable: true,
        widthCard: widthCard,
        lockBoard: false
      });
    }
    const shuffleCards = shuffleArray(cards);

    this.setState({ cards: shuffleCards });
  }

  onChangeSizeField = (sizeFieldIndex) => {
    this.setState({ sizeFieldIndex });
    this.generateCard(sizeFieldIndex);
  }

  onChangeCardsType = (cardsTypeIndex) => {
    this.setState({ cardsTypeIndex });
    const { sizeFieldIndex } = this.state;
    this.generateCard(sizeFieldIndex);
  }

  setCardIsHidden = (cardId, hidden) => {
    this.setState((prevState) => {
      const stateCards = prevState.cards;
      const changeCards = stateCards.map(card => {
        if (cardId === card.id) {
          return { ...card, hidden }
        }
        return card;
      });

      return { cards: changeCards };
    });
  }

  setCardIsClickable = (cardId, clickable) => {
    this.setState((prevState) => {
      const stateCards = prevState.cards;
      const changeCards = stateCards.map(card => {
        if (cardId === card.id) {
          return { ...card, clickable };
        }
        return card;
      });

      return { cards: changeCards };
    });
  }

  onViewCard = (card) => {
    const { firstCard, secondCard, lockBoard, isStarted } = this.state;

    if (!isStarted) return;
    if (lockBoard) return;
    if (!card.clickable) return;
    if ((firstCard && firstCard.id === card.id) || (secondCard && secondCard.id === card.id)) return;

    this.audioBtn.play();

    if (!firstCard) {
      this.setState({ firstCard: card });
    } else {
      this.setState({ secondCard: card });
    }

    console.log(this.state);

    this.setCardIsHidden(card.id, false);
  }

  viewStatsModal = () => {
    this.setState(prevState => ({ viewStats: !prevState.viewStats }));
  }

  componentDidMount() {
    const { sizeFieldIndex, cardsTypeIndex, sound, music } = this.state;
    this.generateCard(sizeFieldIndex, cardsTypeIndex);

    this.audioBtn = new Audio('./sound/btn.wav')
    this.audioBtn.load();
    this.audioBtn.volume = sound / 100;

    this.audioFon = new Audio('./sound/music.mp3')
    this.audioFon.load();
    this.audioFon.volume = music / 100;
    this.audioFon.loop = true;
  }

  componentDidUpdate() {
    const { firstCard, secondCard, speed, cards, isStarted, sound, music } = this.state;

    this.audioBtn.volume = sound / 100;
    this.audioFon.volume = music / 100;
    //this.audioFon.play();

    let finished = true;
    for (const card of cards) {
      if (card.clickable) finished = false;
    }
    if (isStarted && finished) {
      this.endGame();
      console.log('end');
    }

    if (firstCard && secondCard) {

      //console.log(firstCard, secondCard);

      if (firstCard.imgId === secondCard.imgId) {
        console.log('+++');
        this.setCardIsClickable(firstCard.id, false);
        this.setCardIsClickable(secondCard.id, false);
      } else {
        console.log('---');

        this.setState({ lockBoard: true });

        setTimeout(() => {
          this.setCardIsHidden(firstCard.id, true);
          this.setCardIsHidden(secondCard.id, true);
          this.setState({ lockBoard: false });
        }, speed);
      }

      //this.setState({ firstCard: null, secondCard: null });
      this.setState(prevState => ({
        moves: prevState.moves + 1,
        firstCard: null,
        secondCard: null
      }));
    }
  }

  componentWillUnmount() {
    console.log('unmount');
  }

  render() {
    const { sizeFieldIndex, cardsTypeIndex, cards, isStarted, isFinished, moves, timer, viewStats } = this.state;

    return (
      <main className="content">

        <div className="stats game-content">
          <div className="moves stats-block">{moves} moves</div>
          <div className="timer stats-block">{getTimeText(timer)}</div>
          <div className="sound">
            <InputRange
              maxValue={100}
              minValue={0}
              value={this.state.sound}
              onChange={sound => this.setState({ sound })} />
          </div>
          <div className="sound">
            <InputRange
              maxValue={100}
              minValue={0}
              value={this.state.music}
              onChange={music => this.setState({ music })} />
          </div>
          <button className="btn" onClick={this.viewStatsModal}>Stats</button>
        </div>

        <div className="game game-content">
          <div className={`overlay${isStarted ? ' hidden' : ''}`}></div>
          <div
            className={`start-btn${isStarted ? ' hidden' : ''}`}
            onClick={this.startGame}
          >
            {
              isFinished
                ?
                <>
                  <div>End game</div>
                  <div className="start-btn__subtitle">Play again</div>
                </>
                : 'Start game'
            }
          </div>

          <div className={`table-stats${!viewStats ? ' hidden' : ''}`}>
            Stats
          </div>
          <Stats viewStats={viewStats} viewStatsModal={this.viewStatsModal} />
          <div className="cards">
            {cards.map(card =>
              <Card
                key={card.id}
                cardType={cardsType[cardsTypeIndex]}
                onClick={() => this.onViewCard(card)}
                {...card}
              />)}
          </div>
        </div>
        <Settings
          sizeFieldIndex={sizeFieldIndex}
          onChangeSizeField={this.onChangeSizeField}
          cardsTypeIndex={cardsTypeIndex}
          onChangeCardsType={this.onChangeCardsType}
        />
      </main>
    );
  }
}

export { Main };
