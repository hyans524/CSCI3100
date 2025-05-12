import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { userApi, groupApi, postApi, authApi, tripApi } from "../utils/api";
import Trip from "../../components/Trips/Trip";
import Travel_animation from "../assets/travel_animation.jpg";
import constantCheckLoggedIn from "../../components/CheckLoggedIn/CheckLoggedIn";

const TripDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [username, setUsername] = useState("?");
  const [trip, setTrip] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinStatus, setJoinStatus] = useState("not-joined"); // "not-joined", "joining", "joined", "error", "leaving"
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [commentUsers, setCommentUsers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  constantCheckLoggedIn()

  // Get current user ID
  const currentUserId = authApi.getCurrentUserId();

  useEffect(() => {

    const fetchTripAndUserDetails = async () => {
      try {
        setLoading(true);

        if (currentUserId) {
          const usernameResponse = await userApi.getById(currentUserId);
          if (usernameResponse.data && usernameResponse.data.username) {
            setUsername(usernameResponse.data.username);
          }
        }

        let tripData;

        try {
          const response = await postApi.getById(id);
          tripData = response.data;
        } catch (fetchError) {
          console.error("Error fetching trip:", fetchError);
        }
        
        setTrip(tripData);
        
        // Set comments from the trip data
        if (tripData.comments && Array.isArray(tripData.comments)) {
          setComments(tripData.comments);
          
          // Fetch user details for each comment if not already populated
          const userIds = [...new Set(tripData.comments
            .filter(comment => comment.user_id && typeof comment.user_id === 'string')
            .map(comment => comment.user_id))];
            
          if (userIds.length > 0) {
            try {
              const userResponse = await userApi.getByIds(userIds);
              const userMap = {};
              userResponse.data.forEach(user => {
                userMap[user._id] = user;
              });
              setCommentUsers(userMap);
            } catch (error) {
              console.error("Failed to fetch comment users:", error);
            }
          }
        }
        
        // Set likes from the trip data
        if (tripData.likes && Array.isArray(tripData.likes)) {
          setLikes(tripData.likes);

          const userHasLiked = currentUserId && tripData.likes.some(userId => 
            userId === currentUserId || userId?._id === currentUserId
          );
          
          setIsLiked(userHasLiked);
        }

        if (tripData.user_id) {

          setOrganizer({
            _id: tripData.user_id._id || 'unknown',
            name: tripData.user_id.username || "Trip Organizer",
            initials: getInitials(tripData.user_id.username || "Trip Organizer")
          });
        } else {
          setOrganizer({
              _id: tripData.user_id || 'unknown',
              name: "Trip Organizer",
              initials: "TO"
          });
        }

        try {
          if (currentUserId) {
            const trip_detail = await tripApi.getById(tripData.trip_oid);
            const groupId = trip_detail.data.group_id;
            const groupResponse = await groupApi.getByGroupId(groupId);
            
            const isMember = groupResponse.data.members.some(member => {
              const memberId = typeof member === 'object' ? member._id : member;
              return memberId === currentUserId || memberId?.toString() === currentUserId?.toString();
            });
            
            if (isMember) {
              setJoinStatus("joined");
            }
          }

        } catch (error) {
          console.error("Error checking group membership:", error);
        }
        
        
        setError(null);
      } catch (err) {
        console.error("Error fetching trip details:", err);
        setError("Failed to load trip details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTripAndUserDetails();
  }, [id, location.state, currentUserId]);

  useEffect(() => {
    if (!trip || !trip._id) return;
    
    const pollInterval = 5000;
    const fetchUpdatedComments = async () => {
      try {
        const response = await postApi.getById(trip._id);
        
        if (response.data && response.data.comments) {
          // Update comments only if there are changes (to avoid unnecessary rerenders)
          if (JSON.stringify(response.data.comments) !== JSON.stringify(comments)) {
            console.log("New comments detected, updating state");
            setComments(response.data.comments);
            
            // Update user info for any new commenters
            const userIds = [...new Set(response.data.comments
              .filter(comment => comment.user_id && typeof comment.user_id === 'string')
              .map(comment => comment.user_id))];
              
            if (userIds.length > 0) {
              const userResponse = await userApi.getByIds(userIds);
              const userMap = {...commentUsers};
              userResponse.data.forEach(user => {
                if (!userMap[user._id]) {
                  userMap[user._id] = user;
                }
              });
              setCommentUsers(userMap);
            }
          }
        }
      } catch (error) {
        console.error("Error polling for comments:", error);
      }
    };
    
    const intervalId = setInterval(fetchUpdatedComments, pollInterval);
    
    return () => {
      console.log("Cleaning up comment polling interval");
      clearInterval(intervalId);
    };
  }, [trip, comments, commentUsers]);

  const getInitials = (name) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().substring(0, 2);
  };

  // Handle joining a trip
  const handleJoinTrip = async () => {

    if (!trip || !trip._id) {
      alert("Cannot join trip: trip information is missing");
      return;
    }

    if (!currentUserId) {
      alert("You need to be logged in to join trips");
      return;
    }
    
    try {
      setJoinStatus("joining");

      if (joinStatus === "joined") {
        setJoinStatus("leaving");
        
        const trip_detail = await tripApi.getById(trip.trip_oid);
        const groupId = trip_detail.data.group_id;
        const groupResponse = await groupApi.getByGroupId(groupId);
        const response = await groupApi.leaveGroup(groupResponse.data._id);
        
        setJoinStatus("not-joined");
        
        alert("You've successfully left this trip!");
        
      } else if (joinStatus === "not-joined") {
        setJoinStatus("joining");
        
        const trip_detail = await tripApi.getById(trip.trip_oid);
        const groupId = trip_detail.data.group_id;
        const groupResponse = await groupApi.getByGroupId(groupId);
        const response = await groupApi.joinGroup(groupResponse.data._id);
        
        setJoinStatus("joined");
        
        alert("You've successfully joined this trip!");
      }

    } catch (error) {
      console.error("Failed to join trip:", error);
      setJoinStatus("error");
      alert("Failed to join trip. Please try again later.");
    }
  };

  // Handle liking a post
  const handleLikePost = async () => {
    if (!trip || !trip._id || !currentUserId) {
      alert("You need to be logged in to like posts");
      return;
    }

    try {
      if (isLiked) {
        // Unlike the post
        const response = await postApi.unlike(trip._id, currentUserId);
        setLikes(response.data.likes);
        setIsLiked(false);
      } else {
        // Like the post
        const response = await postApi.like(trip._id, currentUserId);
        setLikes(response.data.likes);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Failed to update like status:", error);
      alert("Failed to update like status. Please try again later.");
    }
  };

  // Handle adding a comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!trip || !trip._id || !currentUserId) {
      alert("You need to be logged in to comment");
      return;
    }

    if (!newComment.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await postApi.comment(trip._id, newComment);
      const updatedPost = await postApi.getById(trip._id);
      
      if (updatedPost.data && updatedPost.data.comments) {
        
        setComments(updatedPost.data.comments);
        setNewComment("");
        
        // Update user details for any new commenters
        const userIds = [...new Set(updatedPost.data.comments
          .filter(comment => comment.user_id && typeof comment.user_id === 'string')
          .map(comment => comment.user_id))];
          
        if (userIds.length > 0) {
          try {
            const userResponse = await userApi.getByIds(userIds);
            const newUserMap = {...commentUsers};
            userResponse.data.forEach(user => {
              newUserMap[user._id] = user;
            });
            setCommentUsers(newUserMap);
          } catch (error) {
            console.error("Failed to fetch new comment users:", error);
          }
        }
      }

    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading trip details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto max-w-lg">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!trip) {
    return <div className="container py-10 text-center">No trip information available</div>;
  }

  // Format the budget for display
  const formatBudget = (budget) => {
    switch(budget) {
      case "0-1000": return "$0-$1000";
      case "1001-2000": return "$1001-$2000";
      case "2001-3000": return "$2001-$3000";
      case "3001+": return "$3001+";
      default: return budget;
    }
  };

  // Format date range
  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return "Date not specified";
    }
  };

  // Format comment date
  const formatCommentDate = (date) => {
    try {
      return new Date(date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Date not available";
    }
  };

  // Calculate trip duration in days
  const calculateDuration = () => {
    try {
      const start = new Date(trip.start_date);
      const end = new Date(trip.end_date);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return "Duration not available";
      }
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return "Duration not available";
    }
  };

  // Ensure activities is an array
  const activities = Array.isArray(trip.activities) 
    ? trip.activities 
    : (typeof trip.activities === 'string' ? trip.activities.split(',').map(act => act.trim()) : []);


  const getImageUrl = () => {
    if (!trip || !trip.image) return Travel_animation;
    
    if (typeof trip.image === 'string') {
      if (trip.image.startsWith('/uploads/')) {
        return `http://localhost:5000${trip.image}`;
      }

      if (trip.image.startsWith('http')) {
        return trip.image;
      }
    }
    
    return Travel_animation;
  };

  // Get comment user name
  const getCommentUserName = (userId) => {
    if (!userId) return "Anonymous";
    
    if (userId.username) {
      return userId.username;
    }
    
    return "User";
  };

  // Get user initials for avatar
  const getUserInitials = (userId) => {
    const userName = getCommentUserName(userId);
    return getInitials(userName);
  };

  // Join button state
  const getJoinButtonContent = () => {
    switch(joinStatus) {
      case "joining":
        return (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            Joining...
          </div>
        );
      case "leaving":
        return (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            Leaving...
          </div>
        );
      case "joined":
        return (
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Leave Trip
          </div>
        );
      case "error":
        return "Try Again";
      default:
        return "Join This Trip";
    }
  };

  return (
    <div>
      <div className="h-[300px] overflow-hidden">
        <img
          src={getImageUrl()}
          alt={trip.location}
          className="mx-auto w-full h-full object-cover transition duration-700 hover:scale-110"
          onError={(e) => {
            e.target.error = null;
            e.target.src = Travel_animation;
          }}
        />
      </div>

      <div className="px-4 md:px-8 py-10">
        {/* Trip information section */}
        <div className="container mx-auto max-w-4xl pb-14">
          <div className="flex flex-wrap items-center gap-2 text-sm py-3">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{trip.location}</span>
            {activities.map((activity, index) => (
              <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                {activity}
              </span>
            ))}
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
              {formatBudget(trip.budget)}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold mb-6 mt-2">{trip.location}</h1>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {/* Trip organizer info */}
            {organizer && (
              <div className="flex items-center mb-6 pb-4 border-b">
                <div
                  className="flex items-center cursor-pointer hover:bg-blue-50 transition rounded px-2 py-1"
                  onClick={() => navigate(`/profile/${organizer._id}`)}
                  title="View organizer's profile"
                  style={{ userSelect: "none" }}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {organizer.initials}
                  </div>
                  <h2 className="text-xl pl-3 font-semibold">{organizer.name}</h2>
                </div>
              </div>
            )}
            
            {/* Trip details */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Trip Details</h2>
              <p className="text-lg leading-relaxed mb-4">{trip.text}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">What to expect</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Activities: {activities.join(', ')}</li>
                    <li>Budget range: {formatBudget(trip.budget)}</li>
                    <li>Full trip experience with like-minded travelers</li>
                    <li>Local insights and authentic experiences</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Trip Overview</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Duration: {calculateDuration()} days</li>
                    <li>Start date: {formatDate(trip.start_date)}</li>
                    <li>End date: {formatDate(trip.end_date)}</li>
                    <li>Location: {trip.location}</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between mb-6">
              <div>
                <p className="font-medium text-blue-800">Interested in joining this trip?</p>
                <p className="text-sm text-blue-600">Secure your spot before it's filled!</p>
              </div>
              <button 
                className={`mt-3 sm:mt-0 px-6 py-2 font-medium rounded-md transition ${
                  joinStatus === "joined" 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
                onClick={handleJoinTrip}
                disabled={joinStatus === "joining" || joinStatus === "leaving"}
              >
                {getJoinButtonContent()}
              </button>
            </div>
            
            {/* Likes and interactions */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handleLikePost}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
                      isLiked 
                        ? "bg-red-100 text-red-600" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      fill={isLiked ? "currentColor" : "none"}
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={isLiked ? 0 : 2} 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                      />
                    </svg>
                    <span>{isLiked ? "Liked" : "Like"}</span>
                  </button>
                  
                  <div className="text-sm text-gray-500">
                    {likes.length} {likes.length === 1 ? "person likes" : "people like"} this
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  {comments.length} {comments.length === 1 ? "comment" : "comments"}
                </div>
              </div>
              
              {/* Comment form */}
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="2"
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting || !newComment.trim()}
                        className={`px-4 py-1 rounded-md font-medium transition ${
                          !newComment.trim() || isSubmitting
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Posting...
                          </div>
                        ) : (
                          "Post Comment"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              
              {/* Comments list */}
              <div className="space-y-4 mt-2">
                <h3 className="font-semibold text-lg">Comments</h3>
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                ) : (
                  comments.map((comment, index) => (
                    <div key={index} className="flex space-x-3">
                      {/* Make avatar and username clickable */}
                      <div
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-xs cursor-pointer hover:bg-blue-100 transition"
                        onClick={() => {
                          // Try to get the user id from comment.user_id (object or string)
                          let userId = comment.user_id && comment.user_id._id ? comment.user_id._id : comment.user_id;
                          if (userId) navigate(`/profile/${userId}`);
                        }}
                        title="View user's profile"
                        style={{ userSelect: "none" }}
                      >
                        {getUserInitials(comment.user_id)}
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className="font-medium cursor-pointer hover:underline"
                              onClick={() => {
                                let userId = comment.user_id && comment.user_id._id ? comment.user_id._id : comment.user_id;
                                if (userId) navigate(`/profile/${userId}`);
                              }}
                              title="View user's profile"
                            >
                              {getCommentUserName(comment.user_id)}
                            </span>
                            <span className="text-xs text-gray-500">{formatCommentDate(comment.date)}</span>
                          </div>
                          <p className="text-gray-700">{comment.text}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>
        </div>

        <div className="mt-10 bg-gray-50 py-4 px-2 rounded-lg border border-gray-200">
          <div className="w-[95%] mx-auto">
            <Trip 
              heading="Other trips you might be interested in" 
              headingStyle="border-l-5 border-primary/50 py-2 pl-2 text-2xl font-bold" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetail;