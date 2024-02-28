import React from "react";
import MarkdownOutput from "../components/MarkdownOutput";

const HomePage = ({tiles}) => {
  return <div id="help-center">
    <div className="home-tiles">
      {tiles.map((tile) => <HomeTile {...tile} key={tile.title} />)}
    </div>
  </div>
}

const HomeTile = ({ title, body, iconName }) => {
  return <div className="home-tile">
    <i className={`icon fa-light fa-${iconName}`}></i>
    <h4 className="title">{title}</h4>
    <MarkdownOutput html={body} />
  </div>
};

export default HomePage;
