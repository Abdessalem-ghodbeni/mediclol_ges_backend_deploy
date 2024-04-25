import React, { useState, useEffect } from "react";

export default function FeedbackDetails({ feedback }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    feedback_type: "general_feedback",
    questions: [" "], // Initialize an empty array for questions
  });

  const [newQuestions, setNewQuestions] = useState([]);

  // Update form data when feedback prop changes (optional)
  useEffect(() => {
    if (feedback) {
      setFormData({
        title: feedback?.feedback?.title || "",
        description: feedback?.feedback?.description || "",
        feedback_type: feedback?.feedback?.feedback_type || "general_feedback",
        questions: feedback?.feedback?.questions || [], // Set questions if available
      });
      console.log("feedback : ",feedback);
    }
  }, [feedback]);

  // Handle input changes for title, description, and feedback type
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    // feedback = { ...formData, [name]: value };
    feedback.feedback = { ...formData, [name]: value };
    // console.log('feedback : ',feedback);
    // console.log('feedback : ',feedback.feedback);
  };

  // ****************************** Questions Managment 

  // Handle input changes for individual questions
  const handleQuestionChange = (index, event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      questions: prevFormData.questions.map((question, i) => {
        if (i === index) {
          return {
            ...question,
            [name]: value,
          };
        }
        return question;
      }),
    }));
    feedback.feedback = { ...formData, [name]: value };
    console.log("feedback.feedback : ", feedback.feedback);
  };
  // const handleQuestionChange = (index, event) => {
  //   const { name, value } = event.target;

  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: value,
  //   }));
  // };

  // Add a new question to the list of new questions
  
  const addQuestion = () => {
    setNewQuestions([...newQuestions, { name: "", type: "cercle" }]);
  };

  // Merge new questions with main form data
  // const mergeNewQuestions = () => {
  //   // Assuming formData and newQuestions are state variables
  //   // Set formData with updated questions
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     questions: [...prevFormData.questions, ...newQuestions],
  //   }));

  //   // Clear newQuestions
  //   setNewQuestions([]);
  //   console.log("formData.questions : ", formData.questions);
  //   console.log("newQuestions : ", newQuestions);
  //   feedback.feedback.questions = formData.questions;
  //   // setFormData({ ...formData, questions: newQuestions });

  //   // // Now you can log formData to see the updated questions
  //   console.log("formData: ", formData);
  // };
  const mergeNewQuestions = () => {
    // setFormData((prevFormData) => ({
    //   ...prevFormData,
    //   questions: [...prevFormData.questions, ...newQuestions],
    // }));
    const mergeNewQuestions = { ...formData };
    mergeNewQuestions.questions.push(newQuestions[0]);
    // Update the state with the new formData
    setFormData(mergeNewQuestions);
    setNewQuestions([]);
    console.log("formData.questions : ", formData.questions);
    console.log("newQuestions : ", newQuestions);
    feedback.feedback.questions = formData.questions;

    console.log("formData: ", formData);
  };

  // Delete a question from the list of new questions
  const deleteNewQuestion = (index) => {
    setNewQuestions((prevNewQuestions) => [
      ...prevNewQuestions.slice(0, index),
      ...prevNewQuestions.slice(index + 1),
    ]);
  };

  // Delete a question from the main form data
  const deleteQuestion = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      questions: [
        ...prevFormData.questions.slice(0, index),
        ...prevFormData.questions.slice(index + 1),
      ],
    }));
  };

  return (
    <>
      {/* Card body Begin */}
      <div className="card-body">
        <form className="row g-4 align-items-center">
          {/* Title item */}
          <div className="col-xl-6">
            <label className="form-label">Feedback Title</label>
            <input
              name="title"
              type="text"
              className="form-control"
              placeholder="Feedback Title"
              value={formData.title}
              onChange={handleChange}
            />
            <div className="form-text">Enter feedback title.</div>
          </div>

          {/* Description --> Textarea item */}
          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows={3}
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />
            <div className="form-text">
              Write a brief description of your feedback.
            </div>
          </div>

          {/* Feedback type item */}
          <div className="col-lg-12">
            <label className="form-label">Feedback Type</label>
            <input
              name="feedback_type"
              type="text"
              className="form-control"
              placeholder="Feedback Type"
              value={formData.feedback_type}
              onChange={handleChange}
            />
            <div className="form-text">Enter your feedback type.</div>
          </div>

          {/* Questions */}
          {formData.questions.map((question, index) => (
            <div key={index} className="col-lg-12">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <label className="form-label">Question {index + 1}</label>
                  <input
                    name={`name-${index}`}
                    type="text"
                    className="form-control"
                    placeholder={`Question ${index + 1}`}
                    value={question.name || ""}
                    onChange={(event) => handleQuestionChange(index, event)}
                  />
                  <div className="form-text">Enter question text.</div>
                </div>
                <div className="col-lg-4">
                  <label className="form-label">Type</label>
                  <input
                    name={`type-${index}`}
                    type="text"
                    className="form-control"
                    placeholder={`Type ${index + 1}`}
                    value={question.type || ""}
                    onChange={(event) => handleQuestionChange(index, event)}
                  />
                  <div className="form-text">Enter the type of rating.</div>
                </div>
                <div className="col-lg-2">
                  <button
                    type="button"
                    className="btn btn-danger mt-2"
                    onClick={() => deleteQuestion(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* New Questions */}
          {newQuestions.map((question, index) => (
            <div key={index} className="col-lg-12">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <label className="form-label">New Question {index + 1}</label>
                  <input
                    name={`new-name-${index}`}
                    type="text"
                    className="form-control"
                    placeholder={`New Question ${index + 1}`}
                    value={question.name || ""}
                    onChange={(event) => {
                      const { value } = event.target;
                      setNewQuestions((prevNewQuestions) => {
                        const newQuestionsCopy = [...prevNewQuestions];
                        newQuestionsCopy[index].name = value;
                        return newQuestionsCopy;
                      });
                    }}
                  />
                  <div className="form-text">Enter new question text.</div>
                </div>
                <div className="col-lg-4">
                  <label className="form-label">New Type</label>
                  <input
                    name={`new-type-${index}`}
                    type="text"
                    className="form-control"
                    placeholder={`New Type ${index + 1}`}
                    value={question.type || ""}
                    onChange={(event) => {
                      const { value } = event.target;
                      setNewQuestions((prevNewQuestions) => {
                        const newQuestionsCopy = [...prevNewQuestions];
                        newQuestionsCopy[index].type = value;
                        return newQuestionsCopy;
                      });
                    }}
                  />
                  <div className="form-text">Enter the type of new rating.</div>
                </div>
                <div className="col-lg-2">
                  <button
                    type="button"
                    className="btn btn-danger mt-2"
                    onClick={() => deleteNewQuestion(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Button to add a new question */}
          <div className="col-lg-12">
            <button
              type="button"
              className="btn btn-primary me-2"
              onClick={addQuestion}
            >
              Add Question
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={mergeNewQuestions}
            >
              Save New Questions
            </button>
          </div>
        </form>
      </div>
      {/* Card body END */}
    </>
  );
}
