import React, { Component } from 'react';
import { Card } from '../components/Card';
import { Stats } from '../components/Stats';
import { Settings } from '../components/Settings';
import { sizeField, cardsType, speedType } from '../config/settings';
import { shuffleArray, getStorage, addStorage, getTimeText, fullScreen, cancelFullscreen } from '../utils/utils';
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
    speedIndex: 0,
    moves: 0,
    timer: 0,
    sound: 30,
    music: 0,
    viewStats: false,
    fullscreen: false
  };

  startGame = () => {
    this.setState({
      firstCard: null,
      secondCard: null,
      isStarted: true,
      moves: 0,
      timer: 0,
      cards: this.generateCard(this.state.sizeFieldIndex)
    });
    //this.audioFon.play();
    this.audioFon.currentTime = 0;

    if (this.timerId) clearInterval(this.timerId);

    this.startTimer();
  }

  startTimer = () => {
    this.timerId = setInterval(() => {
      this.setState(prevState => ({ timer: prevState.timer + 1 }));
      this.saveGame();
    }, 1000);
  }

  endGame = () => {
    this.setState({
      isStarted: false,
      isFinished: true
    });
    this.audioFon.pause();
    clearInterval(this.timerId);

    addStorage(null, 'mg_save');

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

  saveGame = () => {
    //addStorage(this.state, 'mg_save');
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

    return shuffleArray(cards);
  }

  onChangeSizeField = (sizeFieldIndex) => {
    this.setState({
      sizeFieldIndex,
      firstCard: null,
      secondCard: null,
      isStarted: false,
      isFinished: false,
      moves: 0,
      timer: 0,
      cards: this.generateCard(sizeFieldIndex)
    });

    if (this.timerId) clearInterval(this.timerId);
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

    this.setCardIsHidden(card.id, false);
  }

  viewStatsModal = () => {
    this.setState(prevState => ({ viewStats: !prevState.viewStats }));
  }

  hotKeys = (event) => {
    if (event.shiftKey || event.metaKey) {
      switch (event.code) {
        case 'KeyM':
          this.setState({ sound: 0 });
          break;
        case 'KeyN':
          this.startGame();
          break;
        case 'KeyS':
          const sizeFieldLen = sizeField.length - 1;
          let newSize = this.state.sizeFieldIndex + 1;
          newSize = newSize > sizeFieldLen ? newSize % sizeFieldLen - 1 : newSize;
          this.onChangeSizeField(newSize);
          break;
        case 'KeyT':
          this.setState(prevState => {
            const cardsTypeLen = cardsType.length - 1;
            let newType = prevState.cardsTypeIndex + 1;
            newType = newType > cardsTypeLen ? newType % cardsTypeLen : newType;
            return { cardsTypeIndex: newType };
          });
          break;
        case 'KeyX':
          this.setState(prevState => {
            const speedTypeLen = speedType.length - 1;
            let newSpeed = prevState.speedIndex + 1;
            newSpeed = newSpeed > speedTypeLen ? newSpeed % speedTypeLen - 1 : newSpeed;
            return { speedIndex: newSpeed };
          });
          break;
        default:
          break;
      }

    }
  }

  componentDidMount() {
    const saveGame = getStorage('mg_save');
    if (saveGame && saveGame.cards && saveGame.cards.length > 0) {
      //this.setState(saveGame);
      this.startTimer();
    } else {
      this.setState({
        cards: this.generateCard(this.state.sizeFieldIndex)
      });
    }

    const { sound, music } = this.state;

    this.audioBtn = new Audio('./sound/btn.wav')
    this.audioBtn.load();
    this.audioBtn.volume = sound / 100;

    this.audioFon = new Audio('./sound/music.mp3')
    this.audioFon.volume = music / 100;
    this.audioFon.loop = true;

    // setTimeout(() => {
    //   this.audioFon.play();
    // }, 2500);

    document.addEventListener('keydown', this.hotKeys);
  }

  componentDidUpdate() {
    const { firstCard, secondCard, speedIndex, cards, isStarted, sound, music } = this.state;

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
        }, speedType[speedIndex].value);
      }

      //this.setState({ firstCard: null, secondCard: null });
      this.setState(prevState => ({
        moves: prevState.moves + 1,
        firstCard: null,
        secondCard: null
      }));
    }
  }

  render() {
    const { sizeFieldIndex, cardsTypeIndex, speedIndex, cards, isStarted, isFinished, moves, timer, viewStats, fullscreen } = this.state;

    return (
      <main className="content" id="game">

        <div className="stats game-content">
          <div className="moves stats-block">{moves} moves</div>
          <div className="timer stats-block">{getTimeText(timer)}</div>

          <button className="btn" onClick={this.viewStatsModal}>Stats</button>
          <button className="btn" onClick={() => this.startGame()}>New game</button>

          {
            fullscreen
              ? <button className="btn" onClick={() => {
                cancelFullscreen();
                this.setState(prevState => ({ fullscreen: !prevState.fullscreen }));
              }}>Window</button>
              : <button className="btn" onClick={() => {
                var canvas = document.getElementById('game');
                fullScreen(canvas);
                this.setState(prevState => ({ fullscreen: !prevState.fullscreen }));
              }}>Fullscreen</button>
          }

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

        <div className="stats game-content">
          <br /><br /><br />
          <div className="sound">
            Sound: <InputRange
              maxValue={100}
              minValue={0}
              value={this.state.sound}
              onChange={sound => this.setState({ sound })} />
          </div>
          <div className="sound">
            Music: <InputRange
              maxValue={100}
              minValue={0}
              value={this.state.music}
              onChange={music => this.setState({ music })} />
          </div>
          <br />
        </div>

        <Settings
          sizeFieldIndex={sizeFieldIndex}
          onChangeSizeField={this.onChangeSizeField}
          cardsTypeIndex={cardsTypeIndex}
          onChangeCardsType={(cardsTypeIndex) => this.setState({ cardsTypeIndex })}
          speedIndex={speedIndex}
          onChangeSpeed={(speedIndex) => this.setState({ speedIndex })}
        />
      </main>
    );
  }
}

export { Main };
