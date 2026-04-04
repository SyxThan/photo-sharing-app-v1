import React from "react";
import {Typography} from "@mui/material";

import "./styles.css";
import {useParams, Link} from "react-router-dom";
import models from "../../modelData/models";
/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
    const user = useParams();
    const userDetail = models.userModel(user.userId);
    const photos = models.photoOfUserModel(user.userId);
    return (
        <>
          <Typography variant="body1">
            This should be the UserDetail view of the PhotoShare app. Since it is
            invoked from React Router the params from the route will be in property match.
            So this should show details of user: {user.userId}.
            You can fetch the model for the user from models.userModel.
          </Typography>
          <Typography>
            {`Name: ${userDetail.first_name} ${userDetail.last_name}`}
          </Typography>
          <Typography>
            {`Address: ${userDetail.location}`}
          </Typography>
          <Typography>
            {`Occupation: ${userDetail.occupation}`}
          </Typography>
          <Typography>
            {`Description: ${userDetail.description}`}
          </Typography>
          <Typography component={Link} to={`/photos/${user.userId}`}>
            Xem chi tiết ảnh của người dùng
          </Typography>
        </>
    );
}

export default UserDetail;
