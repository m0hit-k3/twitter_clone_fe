import React, { useEffect, useState } from "react";
import "../Tweet/Tweet.css";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from 'axios';


function AllUsers() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData'))
  const user_id = userData.user.id;
  const [users, setUsers] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userData = JSON.parse(localStorage.getItem('userData'))
        const config = {headers: {'Authorization': 'Bearer: '+userData.token, 'Content-Type': 'application/json'}}
        const usersResponse = await axios.get('http://127.0.0.1:5000/user/list_users', config);

        const usersList = usersResponse.data.list;

        setUsers(usersList);

        const data = {id: userData.user.id}
        const followersResponse = await axios.post('http://127.0.0.1:5000/user/get_user', data, config);


        setFollowers(followersResponse.data.data.followers || []);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user_id]);

  const isFollowing = (userId) => {
    return followers.some(follower => follower.followed_user_id === userId);
  };

  const handleFollow = async (userId) => {
    try {

      const data = {user_id: userData.user.id, followed_user_id: userId}

      const config = {headers: {'Authorization': 'Bearer: '+userData.token, 'Content-Type': 'application/json'}};

      const response = await axios.post('http://127.0.0.1:5000/follow/create_follow', data, config)

      // Assuming the API returns the follower object on success
      const newFollower = response.data;

      setFollowers(prev => [...prev, newFollower]);
    } catch (error) {
      console.error("Error following user:", error);
      setError(error); // Optionally update the UI to reflect this error
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      const data = {user_id: userData.user.id, followed_user_id: userId}; // Assuming your API needs an action field to differentiate
  
      const config = {headers: {'Authorization': 'Bearer: '+userData.token, 'Content-Type': 'application/json'}};
  
      await axios.post('http://127.0.0.1:5000/follow/delete_follow', data, config);
  
      // Assuming the API returns the updated followers list or the unfollowed user object
      // Update your followers state accordingly
      setFollowers(prev => prev.filter(follower => follower.followed_user_id !== userId));
    } catch (error) {
      console.error("Error unfollowing user:", error);
      setError(error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading users: {error.message}</p>;

  return (
    <div>
      <Button onClick={() => navigate('/tweet')}>Go Back</Button>
      <h1>Displaying All Users</h1>
      <div>
      {users.filter(user => user.id !== user_id).map(user => (
        <div key={user.id} className='tweet'>
          <div className='author'>
            <img src={`https://api.adorable.io/avatars/285/${user.username}.png`} alt='avatar' />
            <strong>{user.name}</strong>
            <div className='author'>
              Follow the user through the button below.
            </div>
            {isFollowing(user.id) ? (
              <Button
                variant="danger"
                onClick={() => handleUnfollow(user.id)}
              >
                Unfollow User
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => handleFollow(user.id)}
              >
                Follow User
              </Button>
            )}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}

export default AllUsers;