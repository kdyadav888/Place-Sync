import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../utils/api';
import '../styles/Jobs.css';

const JobFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  
  const { user, token } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAll('page=1&limit=20');
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    try {
      const response = await postsAPI.create(
        {
          content: newPost,
          visibility: 'Public',
        },
        { Authorization: `Bearer ${token}` }
      );

      const data = await response.json();
      if (data.success) {
        setPosts([data.post, ...posts]);
        setNewPost('');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await postsAPI.likePost(postId, { Authorization: `Bearer ${token}` });
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading feed...</div>;
  }

  return (
    <div className="job-feed-container">
      <div className="feed-header">
        <h1>Job Feed</h1>
        <p>Stay updated with latest industry news</p>
      </div>

      <div className="create-post-section">
        <form onSubmit={handleCreatePost}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share something with the community..."
            required
          />
          <button type="submit" className="btn-apply">Post</button>
        </form>
      </div>

      <div className="posts-feed">
        {posts.length === 0 ? (
          <p>No posts yet</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-item">
              <div className="post-header">
                <div className="post-author">
                  <img src={post.author?.avatar} alt={post.author?.name} />
                  <div>
                    <h4>{post.author?.name}</h4>
                    <p>{post.author?.company}</p>
                  </div>
                </div>
                <span className="post-date">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="post-content">{post.content}</div>

              {post.image && (
                <img src={post.image} alt="Post" className="post-image" />
              )}

              <div className="post-actions">
                <button
                  className="post-action-btn"
                  onClick={() => handleLike(post._id)}
                >
                   {post.likes.length}
                </button>
                <button className="post-action-btn">
                  {post.comments.length} Comments
                </button>
                <button className="post-action-btn">
                   {post.shares}
                </button>
              </div>

              {post.comments.length > 0 && (
                <div className="post-comments">
                  {post.comments.slice(0, 3).map((comment, i) => (
                    <div key={i} className="comment">
                      <strong>{comment.user?.name}:</strong> {comment.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobFeed;


