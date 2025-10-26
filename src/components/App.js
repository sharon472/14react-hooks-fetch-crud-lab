import { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionList from "./QuestionList";
import QuestionForm from "./QuestionForm";

function App() {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState("List");

  // DELIVERABLE 1: GET /questions
  useEffect(() => {
    // Use AbortController for cleanup (Best Practice)
    const controller = new AbortController();
    const signal = controller.signal;

    fetch("http://localhost:4000/questions", { signal })
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((error) => {
        if (error.name !== 'AbortError') {
            console.error('Fetch error:', error);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  // Handler for POST
  function handleAddQuestion(newQuestion) {
    setQuestions([...questions, newQuestion]);
  }

  // Handler for DELETE
  function handleDeleteQuestion(id) {
    setQuestions(questions.filter((q) => q.id !== id));
  }

  // Handler for PATCH (Crucial for the failing test)
  function handleUpdateQuestion(updatedQuestion) {
    // Immutaably replace the old question object with the new one
    const updated = questions.map((q) =>
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    setQuestions(updated);
  }

  function renderPage() {
    if (page === "Form") {
      return <QuestionForm onAddQuestion={handleAddQuestion} />;
    } else if (page === "List") {
      return (
        <QuestionList
          questions={questions}
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateQuestion={handleUpdateQuestion}
        />
      );
    }
  }

  return (
    <div>
      <AdminNavBar onChangePage={setPage} />
      {renderPage()}
    </div>
  );
}

export default App;