import React from 'react';
import Modal from 'react-modal';
import { getStorage, getTimeText } from '../utils/utils';

Modal.setAppElement('#root');

function Stats(props) {
  const { viewStats, viewStatsModal } = props;
  const stats = getStorage('mg_stats');

  return (
    <Modal
      isOpen={viewStats}
    >
      <div className="modal-close">
        <i className="material-icons" onClick={viewStatsModal}>close</i>
      </div>
      <div className="modal-title">Statistics</div>

      <table className="striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Size</th>
            <th>Moves</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {
            stats.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.size}</td>
                <td>{item.moves}</td>
                <td>{getTimeText(item.timer)}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </Modal>
  );
}

export { Stats };
