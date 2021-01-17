import React from "react";
import "./App.scss";
// Components
import CardList from "./CardList";

function About() {
  return (
    <>
        <div className="title" style={{padding: "60px 0px 0px 30px"}}>
              <h1>Shoes</h1>
          <CardList />
        </div>
    </>
  );
}

export default About;
