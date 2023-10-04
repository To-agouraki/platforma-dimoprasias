import React, { useState } from "react";
import Card from "../../shared/components/UIElements/Card";
import { Link } from "react-router-dom";
import "./CategoryItem.css";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useNavigate } from "react-router-dom";

const CategoryItem = ({ name, description, id }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, nError, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/admin//deleteCategory/${id}`,
        "DELETE",
        null
      )
      // props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              Cancel
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              Delete
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>

      <li className="category-item">
        <Card>
          <div className="category-header">
            <h3>{name}</h3>
            <div className="button-group">
              <Link to={`/categories/${id}`} className="update-button">
                Update
              </Link>
              <Link
                onClick={showDeleteWarningHandler}
                className="delete-button"
              >
                Delete
              </Link>
            </div>
          </div>
          <p>{description}</p>
          {/* Add different styles based on conditions */}
          <div className={description ? "has-description" : "no-description"}>
            {description ? "" : "No description available"}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default CategoryItem;
