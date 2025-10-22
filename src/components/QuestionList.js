import React from "react";

function QuestionItem({ question, onDeleteQuestion, onUpdateQuestion }) {
  const { id, prompt, answers, correctIndex } = question;

  function handleDeleteClick() {
    onDeleteQuestion(id);
  }

  function handleCorrectAnswerChange(e) {
    const newCorrectIndex = parseInt(e.target.value);
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correctIndex: newCorrectIndex }),
    })
      .then((r) => r.json())
      .then((updatedQuestion) => onUpdateQuestion(updatedQuestion));
  }

  return (
    <article className="question-item">
      <h3>{prompt}</h3>
      <ol type="A">
        {answers.map((ans, index) => (
          <li
            key={index}
            style={{
              color: index === correctIndex ? "green" : "black",
              fontWeight: index === correctIndex ? "bold" : "normal",
            }}
          >
            {ans}
          </li>
        ))}
      </ol>

      <label>
        Correct Answer:
        <select
          aria-label="Correct Answer"
          value={correctIndex}
          onChange={handleCorrectAnswerChange}
        >
          {answers.map((ans, index) => (
            <option key={index} value={index}>
              {index + 1}
            </option>
          ))}
        </select>
      </label>

      <button onClick={handleDeleteClick}>Delete</button>
    </article>
  );
}

export default QuestionItem;
