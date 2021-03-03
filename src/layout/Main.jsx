import React, { Component } from 'react';
import { Card } from '../components/Card';
import { Stats } from '../components/Stats';
import { Settings } from '../components/Settings';
import { sizeField, cardsType, speedType } from '../config/settings';
import { shuffleArray, getStorage, addStorage, getTimeText, fullScreen, cancelFullscreen } from '../utils/utils';

class Main extends Component {
  state = {
    cards: [],
    lockBoard: false,
    firstCard: null,
    secondCard: null,
    isStarted: false,
    isFinished: false,
    isPause: false,
    sizeFieldIndex: 0,
    cardsTypeIndex: 0,
    speedIndex: 0,
    moves: 0,
    timer: 0,
    sound: 30,
    music: 0,
    viewStats: false,
    viewSettings: false,
    fullscreen: false
  };

  startGame = () => {
    this.setState({
      firstCard: null,
      secondCard: null,
      isStarted: true,
      isPause: false,
      moves: 0,
      timer: 0,
      cards: this.generateCard(this.state.sizeFieldIndex)
    });
    this.audioFon.play();
    this.audioFon.currentTime = 0;

    if (this.timerId) clearInterval(this.timerId);
    this.startTimer();
  }

  startTimer = () => {
    this.timerId = setInterval(() => {
      this.setState(prevState => ({ timer: prevState.timer + 1 }));
      //this.saveGame();
    }, 1000);
  }

  continueGame = () => {
    this.setState({
      isStarted: true,
      isPause: false,
    });

    this.audioFon.play();
    this.audioFon.currentTime = 0;

    if (this.timerId) clearInterval(this.timerId);
    this.startTimer();
  }

  pauseGame = () => {
    this.setState({
      isStarted: false,
      isPause: true,
    });
    clearInterval(this.timerId);
    this.audioFon.pause();
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
    addStorage(this.state, 'mg_save');
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
        widthCard: widthCard
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
      isPause: false,
      isFinished: false,
      moves: 0,
      timer: 0,
      cards: this.generateCard(sizeFieldIndex)
    });

    if (this.timerId) clearInterval(this.timerId);
    this.audioFon.pause();
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

  viewSettingsModal = () => {
    this.setState(prevState => ({ viewSettings: !prevState.viewSettings }));
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
      this.setState({ ...saveGame, isPause: true, isStarted: false });
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

    document.addEventListener('keydown', this.hotKeys);
    window.addEventListener('beforeunload', this.saveGame);
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

      if (firstCard.imgId === secondCard.imgId) {
        this.setCardIsClickable(firstCard.id, false);
        this.setCardIsClickable(secondCard.id, false);
      } else {
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

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.saveGame);
  }

  render() {
    const {
      sizeFieldIndex,
      cardsTypeIndex,
      speedIndex,
      cards,
      isStarted,
      isFinished,
      isPause,
      moves,
      timer,
      viewStats,
      viewSettings,
      fullscreen,
      sound,
      music
    } = this.state;

    return (
      <main className="content" id="game">

        <div className="game-content panel">
          <div className="stats">
            <div className="moves stats-block">{moves} moves</div>
            <div className="timer stats-block">{getTimeText(timer)}</div>
          </div>

          <div className="controls">
            <i className="material-icons" onClick={this.viewSettingsModal}>info_outline</i>
            <i className="material-icons" onClick={this.viewStatsModal}>view_list</i>
            <i className="material-icons" onClick={this.viewSettingsModal}>settings</i>
            <i className="material-icons" onClick={() => this.startGame()}>autorenew</i>
            <i className="material-icons" onClick={isPause ? this.continueGame : this.pauseGame}>
              {isPause ? 'play_circle_outline' : 'pause_circle_outline'}
            </i>

            {
              fullscreen
                ? <i className="material-icons" onClick={() => {
                  cancelFullscreen();
                  this.setState(prevState => ({ fullscreen: !prevState.fullscreen }));
                }}>fullscreen_exit</i>
                : <i className="material-icons" onClick={() => {
                  const game = document.body;
                  fullScreen(game);
                  this.setState(prevState => ({ fullscreen: !prevState.fullscreen }));
                }}>fullscreen</i>
            }
          </div>

        </div>

        <div className="game game-content">
          <div className={`overlay${isStarted ? ' hidden' : ''}`}></div>
          <div
            className={`start-btn${isStarted ? ' hidden' : ''}`}
            onClick={isPause ? this.continueGame : this.startGame}
          >
            {
              isPause
                ? 'Continue game'
                : isFinished
                  ?
                  <>
                    <div>End game</div>
                    <div className="start-btn__subtitle">Play again</div>
                  </>
                  : 'Start game'
            }
          </div>

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

        <Stats viewStats={viewStats} viewStatsModal={this.viewStatsModal} />
        <Settings
          sound={sound}
          onChangeSoundVolume={sound => this.setState({ sound })}
          music={music}
          onChangeMusicVolume={music => this.setState({ music })}
          viewSettings={viewSettings}
          viewSettingsModal={this.viewSettingsModal}
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
