import React from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

import "./styles.css";
import { useParams, Link } from "react-router-dom";
import models from "../../modelData/models";
/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos() {
  const user = useParams();
  const photos = models.photoOfUserModel(user.userId);
  return (
    <div>
      {photos.map((photo) => (
        <div key={photo._id}>
          <img 
            src={require(`../../images/${photo.file_name}`)} 
            alt={photo.file_name} 
          />
          <p>Ngày đăng: {photo.date_time}</p>

          <Typography variant="h6">Bình luận:</Typography>

          <List>
            {photo.comments && photo.comments.map((com) => (
              <ListItem key={com._id}>
                <div>
                  <Link to={`/users/${com.user._id}`}>
                    {com.user.first_name} {com.user.last_name}
                  </Link>
                  <p>{com.comment}</p>           
                  <small>{com.date_time}</small>
                </div>
              </ListItem>
            ))}
          </List>
          
        
        </div>
      ))}
    </div>
  );
}

export default UserPhotos;
