import React, { useState } from "react";
import { useHistory } from "react-router";
import "./App.scss";
/*// Components
import Header from "./components/header";*/

function Form() {
  // genereate fake data
  /*const profile = { shoe_name: "Air Jrdan 34", img_url: "", size: "10" };*/

  const [formData, updateFormData] = React.useState({});

  const handleChange = (e) => {
    if (e.target.name !== "tight_fit" && e.target.name !== "loose_fit") {
      updateFormData({ ...formData, [e.target.name]: e.target.value });
    } else {
      updateFormData({ ...formData, [e.target.name]: true });
    }
    /* if (e.target.name === "tight_fit" || e.target.name === "loose_fit")*/
  };

  function handleSubmit(e) {
    /*let form = document.getElementsByClassName("info")[0];
        if (form) {
          let elements = form.children();
          console.log(elements[0].name)
        }*/
    // prevent the browser from autorefresh
    e.preventDefault();


    // check if either tight fit or loose ift are null and set them to false
    if (!formData["loose_fit"]) {
      formData["loose_fit"] = false;
    } else if (!formData["tight_fit"]) {
      formData["tight_fit"] = false;
    } /*else if (!getUserData("length")) {
          formData["length"] = 25;
      } else if (!getUserData("width")) {
          formData["width"] = 20;
      }*/

    console.log(formData);
    fetch("https://sizr-backend.azurewebsites.net/adduser", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData["name"],
        length: getUserData("length"),
        width: getUserData("width"),
        gender: formData["gender"],
        like_bigger_fitting_shoes: formData["loose_fit"],
        like_smaller_fitting_shoes: formData["tight_fit"],
        min_price: parseFloat(formData["min_price"]),
        max_price: parseFloat(formData["max_price"]),
      }),
    })
      .then((response) => {
        console.log("resp: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("Success: ", data);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });

    fetch("https://sizr-backend.azurewebsites.net/recommendshoes", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: formData["name"] }),
    })
      .then((response) => {
        let res = response.json();
        console.log(res);
        return res;
      })
      .then((json) => {
        console.log(json);
        let passArray = [];
        for (let index in myObj) {
          // check if the index is one of the needed indices
          if (
            index === "US Size" ||
            index === "name" ||
            index === "picture"
          ) {
            console.log(index);
            for (item in index[]) {
              passArray({ item:  });
            }
          }
        }



        let cardArray = [] 

        for (var k in obj) {
          key = k;
          
        }
      
        document.location.href = '/shoes'
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <div class="banner">
        <h1 class="title">Preferences</h1>
      </div>
      <div class="main">
        <form>
          <div class="radio-group">
            <input
              type="radio"
              name="gender"
              id="male"
              value="m"
              onChange={handleChange}
            />
            <label for="male"> Male </label>
            <input
              type="radio"
              name="gender"
              id="female"
              value="f"
              onChange={handleChange}
            />
            <label for="female" style={{ display: "inline" }}>
              Female
            </label>{" "}
          </div>
          <br />
          <br />
          <input
            type="checkbox"
            name="tight_fit"
            id="tight"
            value="tight"
            onChange={handleChange}
          />
          <label for="tight">Tight Fit</label>
          <input
            type="checkbox"
            name="loose_fit"
            id="loose"
            value="loose"
            onChange={handleChange}
          />
          <label for="loose">Loose Fit</label>
          <br />
          <br />
          <label for="max_price">Max Price:</label>
          <div class="form-group">
            <input
              type="text"
              id="max_price"
              name="max_price"
              class="form-field"
              onChange={handleChange}
            />
          </div>
          <br />
          <br />
          <label for="min_price">Min Price:</label>
          <div class="form-group">
            <input
              type="text"
              id="min_price"
              name="min_price"
              class="form-field"
              onChange={handleChange}
            />
          </div>
          <br />
          <br />
          <label for="name">Name:</label>
          <div class="form-group">
            <input
              type="text"
              id="name"
              name="name"
              class="form-field"
              onChange={handleChange}
            />
          </div>
          <br />
          <br />
        </form>

        <div class="buttons">
          <a
            class="btn effect04"
            data-sm-link-text="Submit"
            target="_blank"
            onClick={handleSubmit}
          >
            <span>Submit</span>
          </a>
        </div>
      </div>
    </>
  );
}

export default Form;

export function getUserData(key) {
  return JSON.parse(localStorage.getItem("userData"))[key];
}
