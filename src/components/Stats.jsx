import React from 'react';
import Modal from 'react-modal';
import { getStorage, getTimeText } from '../utils/utils';

function Stats(props) {
  const { viewStats, viewStatsModal } = props;
  const stats = getStorage('mg_stats');

  return (
    <Modal
      isOpen={viewStats}
    >
      <button className="btn" onClick={viewStatsModal}>Close stats</button>

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
            stats.map(item => (
              <tr>
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
