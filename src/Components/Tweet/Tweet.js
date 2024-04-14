import React, { useState, useEffect } from "react";
import "../Tweet/Tweet.css";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import FileUploader from '../FileUploader/FileUploader';


function Tweet() {
    const [tweets, setTweets] = useState([]);
    const [tweetText, setTweetText] = useState("");
    const [loading, setLoading] = useState(true);
    const [creatingTweet, setCreatingTweet] = useState(false);
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('userData'))
    const user_id = userData.user.id;
    const [urls, setUrls] = useState([]);


    useEffect(() => {
        const fetchTimeline = async () => {
            setLoading(true);
            try {
                const url = 'http://localhost:5000/tweet/list_tweets'
                const config = {headers: {'Authorization': 'Bearer: ' +userData.token, 'Content-Type': 'application/json'}}
                const response = await axios.get(url, config)
                const data = response.data.list;
                setTweets(data);
            } catch (error) {
                console.error("Error loading timeline:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTimeline();
    }, [user_id]);

    const handleCreateTweet = async () => {
        if (!tweetText.trim()) return; // Prevent creating empty tweets
        setCreatingTweet(true);
        const config = {
            headers: {'Authorization': 'Bearer: ' + userData.token, 'Content-Type': 'application/json'},
        };
        const data = {
            user_id: userData.user.id,
            content: tweetText,
            media_urls: urls,
        };
        const url = 'http://localhost:5000/tweet/create_tweet';
        try {
            const response = await axios.post(url, data, config);
            setTweetText(""); // Clear the textarea after submitting
            // Append the new tweet to the local state to update the timeline without re-rendering
            const newTweet = {user_id: userData.user.id, content: response.data.data.content, created_at: response.data.data.created_at, user_name: userData.user.name } // Assuming the response contains the new tweet
            setTweets([newTweet, ...tweets]);
        } catch (error) {
            console.error("Error creating tweet:", error);
        } finally {
            setCreatingTweet(false);
        }
    };

    const handleLogout = async() => {
        try{
            const url = 'http://127.0.0.1:5000/session/delete_session';
            const config = {headers: {'Authorization': 'Bearer: ' +userData.token, 'Content-Type': 'application/json'}}

            const res = await axios.post(url, {token: userData.token}, config);
            if(res.status === 200){
                localStorage.removeItem('userData')
                navigate("/login")
            }else{
                alert("Error: ", res.data.message);
            };
        }catch(error){
            if(error.response){
                console.error("Error during logout", error);
            }

        }
    };

    const viewUsers = () => {
        navigate("/users");
    };
    const userProfile = () => {
        navigate("/profile");
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className='tweets'>
            <h1>Hello, {(userData.user.name).toUpperCase()}</h1>
            <Button variant="primary" onClick={viewUsers}>View Other Users</Button>
            <Button variant="secondary" onClick={userProfile}>View User Profile</Button>
            <Button variant="tertiary" onClick={handleLogout}>Logout</Button>

            <div className='tweet'>
                <div className='author'>
                    <img src="https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/batman_hero_avatar_comics-512.png" alt='user-avatar' />
                    <strong>{userData.user.name} - Create A Tweet</strong>
                </div>
                <div className='content'>
                    <div className = 'fileUploader'><FileUploader onUploadSuccess={(urls) => {setUrls(urls)}} /></div>
                    <div className = 'texArea' ><textarea autoFocus className='editTextarea' value={tweetText} onChange={e => setTweetText(e.target.value)} placeholder="Write your Post"  /></div>
                    <div><Button size="sm" onClick={handleCreateTweet} disabled={creatingTweet}>
                        {creatingTweet ? 'Posting...' : 'Create Tweet'}
                    </Button>
                    </div>
                </div>
            </div>
            <h1>Timeline</h1>
            <div>
                {tweets.map(({ id, content, user_name, created_at, media_urls  }) => (
                    <div key={id} className='tweet'>
                        <div className='author'>
                            <img src={`https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/batman_hero_avatar_comics-512.png`} alt='avatar' />
                            <strong>{user_name}</strong>
                        </div>
                        <div className='content'>
                            {content}
                            {media_urls && media_urls.map((url, index) => (
                                <img key={index} src={url} alt="media" style={{ maxWidth: '100%', marginTop: '10px' }} />
                            ))}
                        </div>
                        <div>{new Date(parseInt(created_at) * 1000).toString()}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Tweet;