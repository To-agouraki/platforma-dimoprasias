import React from "react";
import { Link } from "react-router-dom";
import { FaCog } from "react-icons/fa";

import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import "./UserItem.css";

const UserItem = (props) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${props.id}/places`}>
          <div className="user-item__image">
            <Avatar
              image={`http://localhost:5000/${props.image}`}
              alt={props.name}
            />
          </div>

          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.placeCount} {props.placeCount === 1 ? "Item" : "Items"}
            </h3>
          </div>
        </Link>
        <div>
          <Link to={`/updateNormalUser/${props.id}`}>
            User Settings <FaCog className="user-item__settings-icon" />
          </Link>
        </div>
      </Card>
    </li>
  );
};

export default UserItem;
