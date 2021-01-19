import React from "react";
import "./App.scss";
// Components
import CardList from "./CardList";

function About() {
  return (
    <>
      <div className="title" style={{ padding: "60px 0px 0px 30px" }}>
        <h1>Shoes</h1>
      </div>
      <div class="container">{mainBody()}</div>
    </>
  );
}

function mainBody() {
  if (localStorage.getItem("cards")) {
    return <CardList />;
  } else {
    return <p>Please head over to the measure tab first.</p>;
  }
}
export default About;
