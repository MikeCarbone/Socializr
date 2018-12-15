import React from 'react';

export default class Results extends React.Component {
  constructor(props){
    super(props);
    let user1Data = this.props.data;
          user1Data = JSON.parse(user1Data[0]);
    let user2Data = this.props.data;
          user2Data = JSON.parse(user2Data[1]);

    console.log('User 1 data: ', user1Data);
    
    function toNum(numString){
        let lastChar = numString.slice(-1);
        let numsToAppend;
        
        if (lastChar === 'K'){
          numsToAppend = '000'
        } else if (lastChar === 'M'){
          numsToAppend = '000000'
        } else {
          return parseInt(numString.replace(',', ''));
        }
        return parseInt(numString.slice(0, (numString.length - 1)) + numsToAppend);
    }

    this.user1 = {
      "name": user1Data[0].url.slice(20),
      "pic": user1Data[0].pageFunctionResult[0],
      "tweetCount":  toNum(user1Data[0].pageFunctionResult[1].trim()),
      "following": toNum(user1Data[0].pageFunctionResult[2]),
      "followers": toNum(user1Data[0].pageFunctionResult[3]),
      "likes": toNum(user1Data[0].pageFunctionResult[4])
    };

    this.user2 = {
      "name": user2Data[0].url.slice(20),
      "pic": user2Data[0].pageFunctionResult[0],
      "tweetCount":  toNum(user2Data[0].pageFunctionResult[1].trim()),
      "following": toNum(user2Data[0].pageFunctionResult[2]),
      "followers": toNum(user2Data[0].pageFunctionResult[3]),
      "likes": toNum(user2Data[0].pageFunctionResult[4])
    }
  }

  componentDidMount(){
    function calcFollowersPer(user){
       return +(((user.followers) / (user.following)).toFixed(2));
    }

    function calcPower(user){
      return user.followers + user.following + user.likes;
    }

    function setWinners(user1, user2){
      if (user1.followers > user2.followers){
        document.getElementById("1-followers").classList.add("active-winner");
      } else {
        document.getElementById("2-followers").classList.add("active-winner");
      }

      if (user1.following > user2.following){
        document.getElementById("1-following").classList.add("active-winner");
      } else {
        document.getElementById("2-following").classList.add("active-winner");
      }

      if (user1.likes > user2.likes){
        document.getElementById("1-likes").classList.add("active-winner");
      } else {
        document.getElementById("2-likes").classList.add("active-winner");
      }

      if (calcPower(user1) > calcPower(user2)){
        document.getElementById("1-power").classList.add("active-winner");
      } else {
        document.getElementById("2-power").classList.add("active-winner");
      }

      if (calcFollowersPer(user1) > calcFollowersPer(user2)){
        document.getElementById("1-followersPer").classList.add("active-winner");
      } else {
        document.getElementById("2-followersPer").classList.add("active-winner");
      }

      if ((user1.followers - user1.following) > (user2.followers - user2.following)){
        document.getElementById("1-difference").classList.add("active-winner");
      } else {
        document.getElementById("2-difference").classList.add("active-winner");
      }
    }

    setWinners(this.user1, this.user2);
  }
  
  //Followers
  //Followers per following
  //followers per tweet
  //Likes
  //Difference
  //total power = all of those added

  render(){
    console.log('USER 1: ', this.user1);
    console.log('USER 2: ', this.user2);
    let winner;

    if (calcPower(this.user1) > calcPower(this.user2)){
      console.log('User1 wins');
      winner = this.user1;
    } else {
      console.log('User 2 wins');
      winner = this.user2;
    }
    let add = JSON.stringify(winner);
    localStorage.setItem('history', add);

    function calcFollowersPer(user){
       return +(((user.followers) / (user.following)).toFixed(2));
    }

    function calcPower(user){
      return user.followers + user.following + user.likes;
    }

    function numCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return(
        <section className="results-section">
        <div className="flash"></div>
        <div className="winner">
          <img className="winner__img" src={winner.pic} alt={winner.name} />
          <h1><a className="active-winner" rel="noopener noreferrer" target="_blank" href={'https://twitter.com/' + winner.name}>@{winner.name}</a></h1>
          <div className="row">
            <h2><a rel="noopener noreferrer" target="_blank" href={'https://twitter.com/' + this.user1.name}>@{this.user1.name}</a></h2>
            <h2><a rel="noopener noreferrer" target="_blank" href={'https://twitter.com/' + this.user2.name}>@{this.user2.name}</a></h2>
          </div>
          <div className="results">
            <div className="col">
              <p id="1-followers">{numCommas(this.user1.followers)}</p>
              <p id="1-following">{numCommas(this.user1.following)}</p>
              <p id="1-followersPer">{numCommas(calcFollowersPer(this.user1))}</p>
              <p id="1-difference">{numCommas((this.user1.followers) - (this.user1.following))}</p>
              <p id="1-likes">{numCommas(this.user1.likes)}</p>
              <p id="1-power">{numCommas(calcPower(this.user1))}</p>
            </div>
            <div className="col">
              <h4>Followers</h4>
              <h4>Following</h4>
              <h4>Followers per following</h4>
              <h4>Difference</h4>
              <h4>Likes</h4>
              <h4>TOTAL</h4>
            </div>
            <div className="col">
             <p id="2-followers">{numCommas(this.user2.followers)}</p>
              <p id="2-following">{numCommas(this.user2.following)}</p>
              <p id="2-followersPer">{numCommas(calcFollowersPer(this.user2))}</p>
              <p id="2-difference">{numCommas((this.user2.followers) - (this.user2.following))}</p>
              <p id="2-likes">{numCommas(this.user2.likes)}</p>
              <p id="2-power">{numCommas(calcPower(this.user2))}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }
}