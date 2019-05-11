import React from "react";
import "./index.css";

export default ({
  visible,
  defaultClass = "",
  highlightClass = "",
  displayItemList = [],
  title
}) => {
  if (!visible) return null;
  return (
    <div className={`custom-popover ${defaultClass} ${highlightClass}`}>
      <div>
        {title && (
          <span className="title">
            {title}
            <hr />
          </span>
        )}
        {displayItemList.map(displayItem => {
          const { text, key } = displayItem;
          // if (text.length > 25) text = `${text.substr(0, 50)}..`;
          return <p key={key}>{text}</p>;
        })}
      </div>
    </div>
  );
};
