import React, { useEffect, useState } from 'react';
import Fade from '@material-ui/core/Fade';

import SampleViewList from '../../../SampleViews/config';
import RouteSwitcher from '../../utilities/RouteSwitcher';
import './index.css';

export default ({ Navigate, history }) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    RouteSwitcher.setHistory(history);
    setTimeout(() => {
      setChecked(true);
    }, 0);
  }, []);

  return (
    <div className="home-wrapper">
      <div className="title-area">
        <div className="blue-eye-title">
          <img src="/icon512.png" alt="logo" />
          <span>BlueEYE v2</span>
        </div>
      </div>
      <div className="home-thumbnails">
        {SampleViewList.map((sampleView, i) => (
          <Fade in={checked} key={sampleView.name}>
            <div
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
          </Fade>
        ))}
      </div>
    </div>
  );
};
