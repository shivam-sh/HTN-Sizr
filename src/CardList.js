import React, { useState } from "react";
import "./App.scss";
import Card from "./Card";

function CardList() {
  // genereate fake data
  const [profiles, setProfiles] = useState([
    { shoe_name: "Air Jrdan 34", img_url: "https://d3pnpe87i1fkwu.cloudfront.net/IMG/004089-air-jordan-34-ar3240-400_2048x2048.png", size: "10" },
    { shoe_name: "Kobe 4", img_url: "https://d3pnpe87i1fkwu.cloudfront.net/IMG/004215-nike-kobe-4-protro-av6339-100_2048x2048.png", size: "11" },
    { shoe_name: "Kyrie Flytrap 2", img_url: "https://d3pnpe87i1fkwu.cloudfront.net/IMG/004239-nike-kyrie-flytrap-2-ao4436-001_2048x2048.png", size: "11" },
  ]);
  return (
    <>
      {profiles.map((profile) => (
        <Card profile={profile} />
      ))}
    </>
  );
}

export default CardList;
