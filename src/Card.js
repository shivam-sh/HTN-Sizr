import React from "react";
import "./App.scss";
/*// Components
import Header from "./components/header";*/

function Card(props) {
  // genereate fake data
  /*const profile = { shoe_name: "Air Jrdan 34", img_url: "", size: "10" };*/
  return (
    <>
      <div class="cards">
        <div class="card">
          <img src={props.profile.img_url} />
          <div>
            <p class="name"> {props.profile.shoe_name} </p>
            <p class="size-button"> {"US " + props.profile.size} </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Card;
