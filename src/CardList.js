import React, { useState } from "react";
import "./App.scss";
import Card from "./Card";

function CardList() {
  // genereate fake data
  const [profiles, setProfiles] = useState([
      /*{ shoe_name: "Air Jordan 34", img_url: "https://d3pnpe87i1fkwu.cloudfront.net/IMG/004089-air-jordan-34-ar3240-400_2048x2048.png", size: "10" },
      { shoe_name: "Li-Ning Way of Wade 7", img_url: "https://cdn.shopify.com/s/files/1/1592/8069/products/solestage_Li-Ning-Way-Of-Wade-Comlexcon-Pack-1_7-0-G8QSMC_767x.png?v=1596818175", size: "11" },
      { shoe_name: "Kyrie 6 Nike", img_url: "https://d3pnpe87i1fkwu.cloudfront.net/IMG/004089-air-jordan-34-ar3240-400_2048x2048.png", size: "9.5" },*/
      { shoe_name: "Nike Lebron 15 Low", img_url: "https://d3pnpe87i1fkwu.cloudfront.net/IMG/004367-nike-lebron-15-low-ao1755-002_2048x2048.png", size: "10.5" },
      { shoe_name: "Under Armour Curry 8", img_url: "https://2app.kicksonfire.com/kofapp/upload/events_images/ipad_curry-brand-curry-flow-8-0.png", size: "9.5" },
      { shoe_name: "Air Jordan 32 Low", img_url: "https://d3pnpe87i1fkwu.cloudfront.net/IMG/004390-air-jordan-32-low-aa1256-002_2048x2048.png", size: "10" }
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
