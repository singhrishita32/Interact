import React from "react";
import Posts from '../post/Posts'

const Home = () => (
    <div className="jumbotron">
        <h2>Timeline</h2>
        <div className="container">
            <Posts />
        </div>
         
   </div>
);

export default Home;