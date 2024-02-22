import React, { useEffect } from "react";
import { render } from "react-dom";

const HomeTile = ({ title, body, iconName }) => <div className="home-tile">
  <i className={`icon fa-light fa-${iconName}`}></i>
  <h4 className="title">{title}</h4>
  <div className="body" dangerouslySetInnerHTML={{ __html: body }} />
</div>

const StartTour = (text) => <a
  href="#"
  className="btn btn-default"
>
  {text || "Start Tour"}
</a>

const HomePage = ({tiles}) => {
  useEffect(() => {
    const previewPane = document.getElementById("preview-pane").contentDocument
    previewPane.querySelectorAll("start-tour").forEach((el) => {
      render(StartTour(el.textContent), el)
    });
  });

  return <div id="help-center">
    <div className="home-tiles">
      {tiles.map((tile) => <HomeTile {...tile} key={tile.title} />)}
    </div>
  </div>
}

export default HomePage;
