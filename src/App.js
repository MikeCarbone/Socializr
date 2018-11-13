import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    
    this.state = {
      followers: '',
      following: '',
      tweetCount: '',
      likeCount: ''
    };
    
    this.usernameEntered = this.usernameEntered.bind(this);
  }

  componentDidMount(){
    //Check local storage
  }

  usernameEntered(){
    let username = document.getElementById("twitter-user-js").value;

    const readyStateCallback = (req) => {
      console.log(req.readyState);
      if (req.readyState === 4) {
            var responseObject = JSON.parse(req.responseText);
            var finishStatus = responseObject.finishedAt;
            var resultsUrl = responseObject.resultsUrl;
            var requestId = responseObject._id;
            
            //Check if results are ready to be requested
            return (finishStatus == null) ? poller(requestId) : fetchResults(resultsUrl);
      } else {
        return console.log('Invalid ready state');
      }
    };

    const fetchResults = (theURL) => {
        var Httpreq = new XMLHttpRequest();
            Httpreq.open("GET",theURL,false);
            Httpreq.send(null);
        console.log(Httpreq.responseText);
        let dataPayload = JSON.parse(Httpreq.responseText);
                
        return this.setState({
            followers: dataPayload[0].pageFunctionResult[2],
            following: dataPayload[0].pageFunctionResult[1],
            tweetCount: dataPayload[0].pageFunctionResult[0],
            likeCount: dataPayload[0].pageFunctionResult[3]
          });
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
    return (
      <div>
        <h1 className="header">Socializr</h1>
        <input id="twitter-user-js" placeholder="Enter your Twitter user name here" type="text" />
        <button onClick={this.usernameEntered}>Submit</button>
        <div className="stats">
          <p>Followers: {this.state.followers}</p>
          <p>Following: {this.state.following}</p>
          <p>Total tweets: {this.state.tweetCount}</p>
          <p>Total likes: {this.state.likeCount}</p>
        </div>
      </div>
    );
  }
}

export default App;
