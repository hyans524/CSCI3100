import React from 'react';
import { useNavigate } from 'react-router-dom';

const GroupMembers = ({ members }) => {
  const navigate = useNavigate();

  const getDisplayName = (member) => {
    return member.username;
  };
  
  // Get avatar text (first letter of name)
  const getAvatarText = (member) => {
    const name = getDisplayName(member);
    return name.charAt(0).toUpperCase();
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-700">Group Members</h2>
          <span className="text-sm font-medium text-blue-600">{members.length} people</span>
        </div>
        
        {!members || members.length === 0 ? (
          <p className="text-gray-500 italic">No members in this group yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {members.map((member, index) => (
              <li key={member._id || `member-${index}`} className="py-3 flex items-center">
                <div
                  className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3 cursor-pointer hover:bg-blue-200 transition"
                  onClick={() => member._id && navigate(`/profile/${member._id}`)}
                  title="View user's profile"
                  style={{ userSelect: "none" }}
                >
                  {getAvatarText(member)}
                </div>
                <div>
                  <div
                    className="font-medium cursor-pointer hover:underline"
                    onClick={() => member._id && navigate(`/profile/${member._id}`)}
                    title="View user's profile"
                  >
                    {getDisplayName(member)}
                  </div>
                  <div className="text-sm text-gray-500">{member.email || `member${index}@example.com`}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GroupMembers;