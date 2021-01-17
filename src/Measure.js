import React from "react";
import "./App.scss";
import { initXR } from "./xr-session";
//Components
import Header from "./components/header";

function Measure() {
  return (
    <>
      <div className="container">
        <h1 className="title" onClick={initXR()}>
          Measure
        </h1>

        <p>
          Through Sizr’s measure feature, we can accurately provide you with
          sizing recommendations on a variety of shoe models, so that you can
          buy with confidence.
        </p>
        <p>Click the button below to launch the AR measurement system!</p>
      </div>
    </>
  );
}

export default Measure;