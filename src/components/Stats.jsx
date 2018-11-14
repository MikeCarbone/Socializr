import React from 'react';

export default class Stats extends React.Component {
  render(){
    return(
      <div>
        <img className="stats__pic" src={this.props.pic} alt="Avatar"/>
        <h1><a href={`https://twitter.com/${this.props.username}`} target="_blank" rel="noopener noreferrer"> @{this.props.username}</a></h1>
        <div className="stats">
            <div className="stats__stat">
                <p>{this.props.followers}</p>
                <h2>Followers</h2>
            </div>
            <div className="stats__stat">
                <p>{this.props.following}</p>
                <h2>Following</h2>
            </div>
            <div className="stats__stat">
                <p>{this.props.tweetCount}</p>
                <h2>Total tweets</h2>
            </div>
            <div className="stats__stat">
              <p>{this.props.likeCount}</p>
              <h2>Total likes</h2>
            </div>
        </div>
      </div>
    )
  }
}
