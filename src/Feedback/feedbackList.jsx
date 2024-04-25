import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import FeedbackDetails from "./feedbackDetails";
import axios from "axios";
import StarRating from "./starRatings";
// import feedbackList from "./feedbackList";

export default function feedbackList() {
  const [feedbacks, setFeedback] = useState([]);
  const [show, setShow] = useState(false);
  const [showSR, setShowSR] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);

  //display feedbacks List
  useEffect(() => {
    fetch("http://localhost:3000/feedback")
      .then((response) => response.json())
      .then((data) => setFeedback(data))
      .catch((error) => console.error("Error fetching feedback:", error));
  }, []);

  // show & close modal Details item
  const handleShow = (data) => {
    setSelectedData(data);
    setSelectedId(data?.feedback?._id || null);
    // console.log("data?._id : ",data.feedback);
    setShow(true);
  };
  const handleClose = () => setShow(false);

  const handleShowStarRating = (data) => {
    setSelectedData(data);
    setSelectedId(data?.feedback?._id || null);
    // console.log("data?._id : ",data.feedback);
    setShowSR(true);
  };
  const handleCloseStarRating = () => setShowSR(false);

  // Modal for Delete item
  const handleDeleteClick = (id) => {
    setItemIdToDelete(id);
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleConfirmDelete = async () => {
    try {
      // console.log(
      //   `Deleting item with ID: ${feedbacks[itemIdToDelete]._id}`
      // );
      const id = feedbacks[itemIdToDelete]._id;
      // Send DELETE request to the endpoint with the item ID
      const response = await axios.delete(
        `http://localhost:3000/feedback/${id}`
      );

      // Handle success response
      // console.log("Item deleted successfully:", response.data);
      // Filter out the deleted item from the feedbacks list
      const updatedFeedback = feedbacks.filter(
        (feedback) => feedback._id !== id
      );
      setFeedback(updatedFeedback);
      setShowDeleteModal(false); // Close the delete modal
    } catch (error) {
      // Handle error
      console.error("Error deleting item:", error);
      // You may want to display an error message to the user
    }
  };

  // Modal for update & create item
  const handleSubmit = async () => {
    try {
      let response;

      if (selectedId == null) {
        console.log("selectedData : ", selectedData);
        response = await axios.post(
          `http://localhost:3000/feedback`,
          selectedData.feedback
        );
      } else {
        response = await axios.put(
          `http://localhost:3000/feedback/${selectedId}`,
          selectedData.feedback
        );
      }

      // Check for successful response
      if (response.status >= 200 && response.status < 300) {
        console.log("Data updated successfully:", response.data);
        // Update feedback list after successful update
        const updatedFeedback = response.data;

        if (selectedId == null) {
          // If it's a new feedbacks, add it to the existing feedback
          setFeedback((prevFeedbacks) => [...prevFeedbacks, updatedFeedback]);
        } else {
          // If it's an existing feedbacks, update it in the feedback list
          setFeedback((prevFeedbacks) =>
            prevFeedbacks.map((feedback) =>
              feedback._id === selectedId ? updatedFeedback : feedback
            )
          );
        }

        // Close the modal after completion
        handleClose();
      } else {
        throw new Error("Error updating data");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      // Handle errors appropriately, e.g., display error message to user
    }
  };

  return (
    <>
      {/* list of items */}
      <>
        {/* Page main content START */}
        <div className="page-content-wrapper p-xxl-4">
          {/* Title */}
          <div className="row">
            <div className="col-12 mb-4 mb-sm-5">
              <div className="d-sm-flex justify-content-between align-items-center">
                <h1 className="h3 mb-3 mb-sm-0">Feedback List</h1>
                <div className="d-grid">
                  <a href="#" className="btn btn-primary mb-0">
                    <i className="bi bi-filetype-pdf me-2" />
                    Generate Report
                  </a>{" "}
                </div>
              </div>
            </div>
          </div>
          {/* Filters Begin */}
          <div className="row g-4 align-items-center">
            {/* Tabs */}
            <div className="col-lg-6">
              <ul className="nav nav-pills-shadow nav-responsive">
                <li className="nav-item">
                  <a
                    className="nav-link mb-0 active"
                    data-bs-toggle="tab"
                    href="#tab-1"
                  >
                    All Feedback
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link mb-0"
                    data-bs-toggle="tab"
                    href="#tab-3"
                  >
                    Canceled
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link mb-0"
                    data-bs-toggle="tab"
                    href="#tab-4"
                  >
                    Pending
                  </a>
                </li>
              </ul>
            </div>
            {/* Search */}
            <div className="col-md-6 col-lg-3">
              <form className="rounded position-relative">
                <input
                  className="form-control bg-transparent"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button
                  className="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0 text-primary-hover text-reset"
                  type="submit"
                >
                  <i className="fas fa-search fs-6" />
                </button>
              </form>
            </div>
            {/* Select */}
            <div className="col-md-6 col-lg-3">
              <form>
                <select
                  className="form-select js-choice"
                  aria-label=".form-select-sm"
                >
                  <option value>Sort by ...</option>
                  <option>Pride moon Village Resort &amp; Spa</option>
                  <option>Courtyard by Marriott New York</option>
                  <option>Park Plaza Lodge Hotel</option>
                  <option>Royal Beach Resort</option>
                </select>
              </form>
            </div>
          </div>
          {/* Filters END */}
          <br />
          {/* show star rating button */}
          <div className="row ">
            <div className="d-sm-flex ">
              <a
                onClick={() => handleShowStarRating({})}
                className="btn btn-primary mb-0"
              >
                <i className="bi bi-plus me-2" />
                Star Rating
              </a>
            </div>
          </div>
          <br />
          {/* add new feedback button */}
          <div className="row ">
            <div className="d-sm-flex ">
              <a
                onClick={() => handleShow({})}
                className="btn btn-primary mb-0"
              >
                <i className="bi bi-plus me-2" />
                New
              </a>
            </div>
          </div>

          {/* list Begin */}
          <div className="card shadow mt-5">
            {/* Card body Begin */}
            <div className="card-body">
              {/* Table head */}
              <div className="bg-light rounded p-3 d-none d-lg-block">
                <div className="row row-cols-7 g-4">
                  <div className="col">
                    <h6 className="mb-0">feedback N⁰</h6>
                  </div>
                  <div className="col">
                    <h6 className="mb-0">title</h6>
                  </div>
                  <div className="col">
                    <h6 className="mb-0">description</h6>
                  </div>

                  <div className="col">
                    <h6 className="mb-0">feedback_type</h6>
                  </div>
                  <div className="col">
                    <h6 className="mb-0">Action</h6>
                  </div>
                </div>
              </div>
              {/* Table data */}
              {feedbacks.map((feedback, index) => (
                <div
                  key={feedback._id}
                  className="row row-cols-xl-7 align-items-lg-center border-bottom g-4 px-2 py-4"
                >
                  {/* index item */}
                  <div className="col">
                    <small className="d-block d-lg-none">N⁰ :</small>
                    <h6 className="mb-0 fw-normal">{index + 1}</h6>
                  </div>
                  {/* Name of item */}
                  <div className="col">
                    <small className="d-block d-lg-none">feedback :</small>
                    <h6 className="mb-0 fw-normal">
                      {feedback.title.length > 10
                        ? `${feedback.title.slice(0, 10)}...`
                        : feedback?.title || ""}
                    </h6>
                  </div>

                  {/* Description item */}
                  <div className="col">
                    <small className="d-block d-lg-none">Description:</small>
                    <h6 className="mb-0 fw-normal">
                      {feedback.description && feedback.description.length > 15
                        ? `${feedback.description.slice(0, 15)}...`
                        : feedback?.description || ""}
                    </h6>
                  </div>

                  {/* feedback_type item */}
                  <div className="col">
                    <div className="badge bg-success bg-opacity-10 text-success">
                      {feedback.feedback_type &&
                      feedback.feedback_type.length > 15
                        ? `${feedback.feedback_type.slice(0, 15)}...`
                        : feedback?.feedback_type || ""}
                    </div>
                    {/* {categories[feedback.category_id] ? (
                      <div className="badge bg-success bg-opacity-10 text-success">
                        {categories[feedback.category_id].length > 15
                          ? `${categories[feedback.category_id].slice(
                              0,
                              15
                            )}...`
                          : categories[feedback.category_id]}
                      </div>
                    ) : (
                      <div className="badge bg-danger bg-opacity-10 text-danger">
                        None
                      </div>
                    )} */}
                  </div>

                  {/* Action button */}
                  <div className="col">
                    <small className="d-block d-lg-none">Action :</small>
                    <button
                      className="btn btn-sm btn-info m-1"
                      onClick={() => handleShow({ feedback })}
                    >
                      <i className="fa-solid fa-cogs"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-info m-1"
                      onClick={() => handleShowStarRating({ feedback })}
                    >
                      <i className="fa-solid fa-window-restore"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-danger m-1"
                      // onClick={() => handleDelete(feedback._id)}
                      onClick={() => handleDeleteClick(index)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Card body END */}
            {/* Card footer Begin */}
            <div className="card-footer pt-0">
              {/* Pagination and content */}
              <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                {/* Content */}
                <p className="mb-sm-0 text-center text-sm-start">
                  Showing 1 to 8 of 20 entries
                </p>
                {/* Pagination */}
                <nav
                  className="mb-sm-0 d-flex justify-content-center"
                  aria-label="navigation"
                >
                  <ul className="pagination pagination-sm pagination-primary-soft mb-0">
                    <li className="page-item disabled">
                      <a className="page-link" href="#" tabIndex={-1}>
                        Prev
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        1
                      </a>
                    </li>
                    <li className="page-item active">
                      <a className="page-link" href="#">
                        2
                      </a>
                    </li>
                    <li className="page-item disabled">
                      <a className="page-link" href="#">
                        ..
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        15
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        Next
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            {/* Card footer END */}
          </div>
          {/* list END */}
        </div>
        {/* Page main content END */}/
      </>
      {/* Modal */}
      <>
        {/* Modal Details Data */}
        <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>feedback Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FeedbackDetails feedback={selectedData} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => handleSubmit()}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Start Rating */}
        <Modal show={showSR} onHide={handleCloseStarRating} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Star Ratings</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <StarRating feedback={selectedData} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseStarRating}>
              Close
            </Button>
            <Button variant="primary">Send</Button>
          </Modal.Footer>
        </Modal>
      </>
    </>
  );
}
