import React from 'react';

const Comment = ({ /* articleId, */ comment }) => {
  return (
    <div className="comment">
      {/* <img
        className="avatar-comment"
        // src={userDetails.avatar}
        // alt={userDetails.name}
      /> */}

      <div className="show-comment">
        {/* <h6 className="avatar-name">{userDetails.name}</h6> */}
        {comment}
      </div>
    </div>
  );
};

export default Comment;
