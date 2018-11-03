import React, { Component } from 'react';
import './App.css';

class App extends Component {

  usernameEntered(){
    let username = document.getElementById("twitter-user-js").value;
    if (username){
      console.log(username);

      var request = new XMLHttpRequest();

      request.open('POST', 'https://api.apify.com/v1/F6zg3S4YnudDgw5xe/crawlers/yxCYAw3hon6qnebkN/execute?token=xSCGuWqoaXFFmfzrvNH9zW43L');

      request.setRequestHeader('Content-Type', 'application/json');

      request.onreadystatechange = function () {
        if (this.readyState === 4) {
          var responseObject = JSON.parse(this.responseText);
          var finishStatus = responseObject.finishedAt;
          var resultsUrl = responseObject.resultsUrl;
          var requestId = responseObject._id;
          console.log('requestId: ', requestId);
          if (finishStatus == null) {
            poller(requestId);
          } else {
            console.log('Status:', this.status);
            console.log('Headers:', this.getAllResponseHeaders());
            console.log('Body:', this.responseText);
            console.log('Success! Finished at: ', finishStatus);
            Get(resultsUrl);
          }
        }
      };

      var body = {
        '_id': 'yxCYAw3hon6qnebkN',
        'startUrls':[{
            'key': 'START',
            'value': `https://twitter.com/${username}`
        }]
      };

      request.send(JSON.stringify(body));
      
      function poller(requestId){
        console.log('Original poll still runnning, executing long poller');
        setTimeout(function(){
          
          var request = new XMLHttpRequest();

          request.open('GET', `https://api.apify.com/v1/execs/${requestId}`);

          request.onreadystatechange = function () {
            if (this.readyState === 4) {
              
              var responseObject = JSON.parse(this.responseText);
              var finishStatus = responseObject.finishedAt;
              var resultsUrl = responseObject.resultsUrl;
              var requestId = responseObject._id;

              if (finishStatus == null) {
                poller(requestId);
              } else {
                console.log('Status:', this.status);
                console.log('Headers:', this.getAllResponseHeaders());
                console.log('Body:', this.responseText);
                console.log('Success! Finished at: ', finishStatus);
                Get(resultsUrl);
              }
            }
          };
          request.send();

          

        }, 1000);
      }

      function Get(theURL){
          var Httpreq = new XMLHttpRequest(); // a new request
          Httpreq.open("GET",theURL,false);
          Httpreq.send(null);
          var rawPayload = Httpreq.responseText;
          var dataPayload = JSON.parse(rawPayload);
          console.log('PAYLOAD: ', dataPayload);
          console.log(`This user has ${dataPayload[0].pageFunctionResult[2]} followers`);   
      }
      
         

    } else {
      console.log('nothin');
    }
    
  }



  render() {
    return (
      <div>
        <h1 className="header">Socializr</h1>
        <input id="twitter-user-js" placeholder="Enter your Twitter user name here" type="text" />
        <button onClick={this.usernameEntered}>Submit</button>
      </div>
    );
  }
}

export default App;
