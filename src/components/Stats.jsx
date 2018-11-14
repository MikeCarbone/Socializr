import React from 'react';

export default class Stats extends React.Component {
  render(){
    return(
      <div className="stats">
          <div className="stats__stat">
              <h2>Followers</h2>
              <p>{this.props.followers}</p>
          </div>
          <div className="stats__stat">
              <h2>Following</h2>
              <p>{this.props.following}</p>
          </div>
          <div className="stats__stat">
              <h2>Total tweets</h2>
              <p>{this.props.tweetCount}</p>
          </div>
          <div className="stats__stat">
            <h2>Total likes</h2>
            <p>{this.props.likeCount}</p>
          </div>
      </div>
    )
  }
}
