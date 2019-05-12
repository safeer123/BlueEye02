import React, { useEffect } from 'react';

import SampleViewList from '../../../SampleViews/config';
import RouteSwitcher from '../../utilities/RouteSwitcher';
import './index.css';

export default ({ Navigate, history }) => {
  useEffect(() => {
    RouteSwitcher.setHistory(history);
  }, []);
  return (
    <div className="home-wrapper">
      <div className="home-thumbnails">
        {SampleViewList.map((sampleView, i) => (
          <div
            key={sampleView.name}
            role="button"
            tabIndex={0}
            onKeyDown={null}
            className="home-thumbnail"
            onClick={() => {
            if (Navigate.toPage) {
              Navigate.toPage(i);
            }
          }}
          >
            <h3>{sampleView.name}</h3>
            <p>{sampleView.description}</p>
          </div>
      ))}
      </div>
    </div>
  );
};

