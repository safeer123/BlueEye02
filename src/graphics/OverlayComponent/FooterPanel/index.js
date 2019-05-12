import React from 'react';
import './index.css';

const FooterPanel = ({ contentItems }) => (
  <div className="footer-panel-wrapper">
    {
      contentItems.map(c => (
        <div className="footer-panel-item">{c}</div>
      ))
    }
  </div>
);

export default FooterPanel;
