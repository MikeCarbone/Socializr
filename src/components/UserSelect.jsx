import React from 'react';

export default class UserSelect extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    let whichSocial = this.props.whichSocial
                      .charAt(0).toUpperCase() + 
                      this.props.whichSocial.slice(1);
    var content = (this.props.isActive)
                ? <section className="cont shake-slow">
                    <div className="players">
                      <div className="player players__1">
                        <h3>Enter Player 1's {whichSocial}'s username</h3>
                        <input id="user1-js" className="players__input" type="text" name="" placeholder="Enter username" />
                      </div>
                      <div className="player players__2">
                        <h3>Enter Player 2's {whichSocial}'s username</h3>
                        <input id="user2-js" className="players__input" type="text" name="" placeholder="Enter username" />
                      </div>
                    </div>
                    <h1>VS</h1>
                    <div className="cont__button">
                      <button onClick={this.props.clickHandler}>FIGHT</button>
                    </div>
                  </section>
                : null;
    return(
      <div>
        { content }
      </div>
    )
  }
}