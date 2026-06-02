import { Link } from "react-router-dom";
import "./styles.css";

function UserComment({ comment }) {
  const user = comment.user_id || comment.user;

  return (
    <li className="user-comment-item">
      <div className="user-comment-content">
        <Link
          className="user-comment-author"
          to={`/users/${user?._id || comment.user_id}`}
        >
          {user?.first_name
            ? `${user.first_name} ${user.last_name}`
            : "Người dùng"}
        </Link>

        <p className="user-comment-text">
          {comment.comment}
        </p>

        <small className="user-comment-date">
          {comment.date_time}
        </small>
      </div>
    </li>
  );
}

export default UserComment;