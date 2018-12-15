import React, { Component } from 'react';
import Intro from './components/Intro';
import UserSelect from './components/UserSelect';
import Results from './components/Results';
import './App.css';

let options = document.getElementsByClassName("social-option");

class App extends Component {
  constructor(props){
    super(props);
    
    //Initialize state
    this.state = {
      user: '',
      isEmpty: true,
      isLoading: false,
      nameEntered: false,
      twitterData: [],
      socialStatus: '',
      isIntroActive: true,
      isSetUsersActive: false,
      isResultsActive: false,
      whichSocial: '',
      payloads: []
    };
    
    this.platformHandler = this.platformHandler.bind(this);
    this.usernamesEntered = this.usernamesEntered.bind(this);
    this.userHandler = this.userHandler.bind(this);
  }

  componentWillMount(){
    
    //Check local storage for past searches
    // let history = window.localStorage;
    // if (history.length <= 0){
    //   console.log('Empty history');
    // } else {
      
    //   //Set current state to local storage values if its not empty
    //   try{
    //     this.setState({
    //       user: history.user,
    //       followers: history.followers,
    //       following: history.following,
    //       tweetCount: history.tweetCount,
    //       likeCount: history.likeCount,
    //       avatar: history.avatar,
    //       isEmpty: JSON.parse(history.isEmpty),
    //       isLoading: JSON.parse(history.isLoading)
    //     });
    //   } catch(error) {
    //     console.log(error);
    //   }
    //}
  }

  userHandler(){    
    let user1 = document.getElementById("user1-js").value;
    let user2 = document.getElementById("user2-js").value;
    
    this.usernamesEntered(user1);
    this.usernamesEntered(user2);

    this.setState({
      isLoading: true
    });

    return;
  }
  
  //Function called when submit is hit
  usernamesEntered(username){
    var username = username;
    console.log(`Beginning parse of ${username}`);
    //Store entered username to local state
    //Trigger loading animations and other functions with isLoading
    // this.setState({
    //   isLoading: true,
    //   user: username
    // });
    
    //Called on HTTP request readystatechange event
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
    
    //Called when results are ready, fetches new API that has results
    const fetchResults = (theURL) => {
        var Httpreq = new XMLHttpRequest();
            Httpreq.open("GET",theURL,false);
            Httpreq.send(null);

        return endingProcesses(Httpreq.responseText);
    };
    
    //Long poller that is called if results arent immediately ready
    //This will usually be called b/c API has to download Twitter webpage
    const poller = (requestId) => {
        console.log('Original poll still runnning, executing long poller');
        
        //Intermittently check to see if requests' results are ready
        setTimeout(function(){
          var request = new XMLHttpRequest();
              request.open('GET', `https://api.apify.com/v1/execs/${requestId}`);
              request.onreadystatechange = function(){ readyStateCallback(this)};
              request.send();
      }, 5000);
    };
    
    //Updates state to reflect new response data
    const stateSetter = (data) => {
      return this.setState({
        followers: data[0].pageFunctionResult[3],
        following: data[0].pageFunctionResult[2],
        tweetCount: data[0].pageFunctionResult[1],
        likeCount: data[0].pageFunctionResult[4],
        avatar: data[0].pageFunctionResult[0],
        isEmpty: false,
        isLoading: false,
      });
    };
    
    //Resets local storage to match most recent search
    const editLocalHistory = (states) => {
      Object.keys(states).forEach((key) =>{
          localStorage.setItem(key, states[key]);
      });
    };

    const endingProcesses = (data) => {
      console.log(`Finished parsing ${username}`);
        let payloadArr = this.state.payloads || [];
            payloadArr.push(data);
        
        this.setState({
            payloads: payloadArr,
        });

        if (payloadArr.length >= 2){
          console.log('DONE!');
          console.log(JSON.parse(payloadArr[0]));
          this.setState({
            isSetUsersActive: false,
            isResultsActive: true
          });
        }
        
        //editLocalHistory(this.state);

        return;
    };

    //Validate field content isnt empty
    if (username){
      let searchURL = `https://${this.state.whichSocial}.com/${username}`;
      //Parameters to POST with request
      var body = {
        '_id': 'yxCYAw3hon6qnebkN',
        'startUrls':[{
            'key': 'START',
            'value': searchURL
        }]
      };

      console.log(`Hitting ${searchURL}`);
      
      //First request to the API
      var request = new XMLHttpRequest();
          request.open('POST', 'https://api.apify.com/v1/F6zg3S4YnudDgw5xe/crawlers/yxCYAw3hon6qnebkN/execute?token=xSCGuWqoaXFFmfzrvNH9zW43L');
          request.setRequestHeader('Content-Type', 'application/json');
          request.onreadystatechange = function(){ readyStateCallback(this);};
          request.send(JSON.stringify(body));
  
    } else {
      console.log('Please enter a valid username');
    }
  }

  platformHandler(value) {
    console.log(value);

    let icons = Array(document.getElementsByClassName("social-options__icon"));

    icons.forEach((el, index) => {
        el[index].style.animation = '';
    });

    this.setState({
        isSetUsersActive: true,
        whichSocial: value
    });
    
    //Wait for animation to finish then remove background
    setTimeout(() => {
      this.setState({
        isIntroActive: false
      });
    }, 4000);
    
  }

  render() {
    //Remove render heavy DOM content after no longer visible
    var introContent = (this.state.isIntroActive)
                  ? <Intro clickHandler={this.platformHandler} />
                  : null;
    
    console.log(`Render isLoading: ${this.state.isLoading}`);
    var enterUserScreen = (this.state.isSetUsersActive)
                  ? <UserSelect isLoading={this.state.isLoading} clickHandler={this.userHandler} whichSocial={this.state.whichSocial} isActive = {this.state.isSetUsersActive} />
                  : null;

    var resultsScreen = (this.state.isResultsActive)
                  ? <Results data={this.state.payloads} />
                  : null;
    
    return (
      <div>
        <div className="landscapeCheck">
            <h2>Please rotate to portrait</h2>
        </div>
        { resultsScreen }
        { introContent }
        { enterUserScreen }
      </div>
    );
  }
}

export default App;
