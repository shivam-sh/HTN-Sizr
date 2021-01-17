import React from "react";
import "./App.scss";

// Pages
import Home from "./Home";
import Measure from "./Measure";
import Shoes from "./Shoes";
import About from "./About";
import Form from "./Form";
import { Route, Link } from "react-router-dom"

// Components
import Header from "./components/header";

function App() {
  return (
    <>
      <Header />
      <Route exact path="/" component={Home} />
      <Route exact path="/measure" component={Measure} />
      <Route exact path="/shoes" component={Shoes} />
      <Route exact path="/about" component={About} />
      <Route exact path="/form" component={Form} />
    </>
  );
}

export default App;
