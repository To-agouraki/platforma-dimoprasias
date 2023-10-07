import React, { useState } from "react";
import Card from "../../shared/components/UIElements/Card";
import { Link } from "react-router-dom";
import "./CategoryItem.css";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";

const CategoryItem = ({ name, description, id, onDelete }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, nError, sendRequest, clearError } = useHttpClient();

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
      );
      onDelete(id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={nError} onClear={clearError} />

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
          {isLoading && <LoadingSpinner asOverlay />}
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
