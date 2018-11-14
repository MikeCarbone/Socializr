import React, { Component } from 'react';
import Stats from './components/Stats';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    
    this.state = {
      user: '',
      followers: '',
      following: '',
      tweetCount: '',
      likeCount: '',
      isEmpty: true,
      isLoading: false,
      nameEntered: false
    };

    this.usernameEntered = this.usernameEntered.bind(this);
  }

  componentWillMount(){
    //Check local storage
    let history = window.localStorage;
    if (history.length <= 0){
      console.log('Empty history');
    } else {
      this.setState({
        user: history.user,
        followers: history.followers,
        following: history.following,
        tweetCount: history.tweetCount,
        likeCount: history.likeCount,
        avatar: history.avatar,
        isEmpty: JSON.parse(history.isEmpty),
        isLoading: JSON.parse(history.isLoading)
      });
    }
  }

  usernameEntered(){
    let username = document.getElementById("twitter-user-js").value;
    this.setState({
      isLoading: true,
      user: username
    });

    const readyStateCallback = (req) => {
      if (req.readyState === 4) {
            var responseObject = JSON.parse(req.responseText);
            var finishStatus = responseObject.finishedAt;
            var resultsUrl = responseObject.resultsUrl;
            var requestId = responseObject._id;
            
            //Check if results are ready to be requested
            return (finishStatus == null) ? poller(requestId) : fetchResults(resultsUrl);
      } else {
        //Response not ready
        return;
      }
    };

    const fetchResults = (theURL) => {
        var Httpreq = new XMLHttpRequest();
            Httpreq.open("GET",theURL,false);
            Httpreq.send(null);
        
        let dataPayload = JSON.parse(Httpreq.responseText);
        console.log(dataPayload);
        stateSetter(dataPayload);
        
        return editLocalHistory(this.state);
    };

    const poller = (requestId) => {
        console.log('Original poll still runnning, executing long poller');
        
        //Giving the API time to create response, keep checking
        setTimeout(function(){
          var request = new XMLHttpRequest();
              request.open('GET', `https://api.apify.com/v1/execs/${requestId}`);
              request.onreadystatechange = function(){ readyStateCallback(this)};
              request.send();
      }, 1000);
    };

    const stateSetter = (data) => {
      return this.setState({
        followers: data[0].pageFunctionResult[3],
        following: data[0].pageFunctionResult[2],
        tweetCount: data[0].pageFunctionResult[1],
        likeCount: data[0].pageFunctionResult[4],
        avatar: data[0].pageFunctionResult[0],
        isEmpty: false,
        isLoading: false
      });
    }

    const editLocalHistory = (states) => {
      Object.keys(states).forEach((key) =>{
          localStorage.setItem(key, states[key]);
      });
    }

    //Validate field content
    if (username){
      var body = {
        '_id': 'yxCYAw3hon6qnebkN',
        'startUrls':[{
            'key': 'START',
            'value': `https://twitter.com/${username}`
        }]
      };

      var request = new XMLHttpRequest();
          request.open('POST', 'https://api.apify.com/v1/F6zg3S4YnudDgw5xe/crawlers/yxCYAw3hon6qnebkN/execute?token=xSCGuWqoaXFFmfzrvNH9zW43L');
          request.setRequestHeader('Content-Type', 'application/json');
          request.onreadystatechange = function(){ readyStateCallback(this);};
          request.send(JSON.stringify(body));
  
    } else {
      //Please enter a username!
      console.log('nothin');
    }
  }

  render() {
    var content = (this.state.isEmpty)
                  ?  <div>
                        <h2 className="placeholder-text">Please enter your Twitter handle to get started!</h2>
                        <img className="placeholder-img" alt="Phone" src="./social-bg.png"/>
                    </div>
                  : <Stats  username={this.state.user} 
                            pic={this.state.avatar} 
                            followers={this.state.followers} 
                            following={this.state.following} 
                            tweetCount={this.state.tweetCount} 
                            likeCount={this.state.likeCount} />
    
    var loadingImg = (this.state.isLoading)
                  ?   <div>
                        <img className="loading-sign" alt="Loading sign" src="./loading-sign.svg"/>
                        <p>This can take up to 20 seconds</p>
                      </div>
                  : null;
    return (
      <div>
        <h1 className="header">Socializr</h1>
        
        {content}
        
        {loadingImg}

        <input id="twitter-user-js" placeholder="Enter your Twitter user name here" type="text" />
        <button onClick={this.usernameEntered}>Submit</button>
        
      </div>
    );
  }
}

export default App;
