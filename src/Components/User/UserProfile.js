import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserProfile.css';

function UserProfile() {
    const [tweets, setTweets] = useState([]);
    const [user, setUser] = useState();
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setfollowingCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const userData = JSON.parse(localStorage.getItem('userData'));

    useEffect(() => {
        const fetchTweets = async () => {
            setLoading(true);
            try {
                const url = 'http://localhost:5000/tweet/list_tweets';
                const config = { headers: { 'Authorization': 'Bearer: ' + userData.token, 'Content-Type': 'application/json' } };
                const response = await axios.get(url, config);
                const userTweets = response.data.list.filter(tweet => tweet.user_id === userData.user.id);
                setTweets(userTweets);
            } catch (error) {
                console.error("Error loading tweets:", error);
            } finally {
                setLoading(false);
            }
        };
        const fetchUser = async () => {
            setLoading(true);
            try {
                const url = 'http://localhost:5000/user/get_user';
                const data = {id: userData.user.id}
                const config = { headers: { 'Authorization': 'Bearer: ' + userData.token, 'Content-Type': 'application/json' } };
                const response = await axios.post(url, data, config);
                const user = response.data.data;
                setUser(user);
                setFollowersCount(user.followers_count);
                setfollowingCount(user.following_count);
            } catch (error) {
                console.error("Error loading user:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
        fetchTweets();
    }, [userData.user.id, userData.token]);

    const handleTweetEdit = async (tweetId, content, media_url = null) => {
        try {
            const config = {
                headers: { 'Authorization': 'Bearer: ' + userData.token, 'Content-Type': 'application/json' }
            };
            const data = {
                user_id: userData.user.id,
                tweet_id: tweetId,
                content: content,
                media_url: media_url,
                status: 'active' // Active tweet
            };
            await axios.put('http://localhost:5000/tweet/update_tweet', data, config);
            // Refresh tweets or update UI accordingly
        } catch (error) {
            console.error("Error updating tweet:", error);
        }
    };

    const handleTweetDelete = async (tweet) => {
        try {
            const config = {
                headers: { 'Authorization': 'Bearer: ' + userData.token, 'Content-Type': 'application/json' }
            };
            const data = {
                user_id: userData.user.id,
                tweet_id: tweet.id,
                content: tweet.content, // Assuming content is not needed for deletion
                media_urls: tweet.media_urls, // Assuming media_url is not needed for deletion
                status: 'inactive' // Mark tweet as inactive for deletion
            };
            console.log(tweet);
            await axios.put('http://localhost:5000/tweet/update_tweet', data, config);

            setTweets(tweets.filter(t => t.id !== tweet.id));


            // Refresh tweets or update UI accordingly
        } catch (error) {
            console.error("Error deleting tweet:", error);
        }
    };
    const back = () => {
        window.history.back();
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="user-profile">
            <h2>User Profile</h2>
            <button onClick={(back)}>BACK</button>
            <div className="user-info">
                <img src={`https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/batman_hero_avatar_comics-512.png`} alt="User Avatar" />
                <div className='user-data'>
                    <h3>{userData.user.name}</h3>
                    <p>Email: {userData.user.email}</p>
                    <p>Followers: {followersCount}</p>
                    <p>Following: {followingCount}</p>
                </div>
            </div>
            <h3>My Tweets</h3>
            <ul className="tweets">
                {tweets.map((tweet) => (
                    <li key={tweet.id} className="tweet">
                        {tweet.content}
                        <button onClick={() => handleTweetEdit(tweet.id, tweet.content)}>Edit</button>
                        <button onClick={() => handleTweetDelete(tweet)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserProfile;