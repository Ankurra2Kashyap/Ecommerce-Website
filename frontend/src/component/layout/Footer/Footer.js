import React from 'react'
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css"
const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
      <h4>Download Our APP</h4>
      <p>Download App for Android And IOS mobile Phone</p>
      <img src={playStore} alt="playstore"/>
      <img src={appStore} alt="Appstore"/>
      </div>
      <div className="midFooter">
        <h1>Ecommerce</h1>
        <p>High Quality is our first Priority</p>
        <p>COpyrights 2021 &copy; MeAbhiSingh</p>
      </div>
      <div className="rightFooter">
        <h4>Follow Us</h4>
      </div>
    </footer>
  )
}

export default Footer
