useEffect(() => {
  let isMounted = true;

  return () => {
    isMounted = false;
  };
}, []);

function handleSubmit(event) {
  event.preventDefault();
  const newQuestion = {
    prompt: formData.prompt,
    answers: [
      formData.answer1,
      formData.answer2,
      formData.answer3,
      formData.answer4,
    ],
    correctIndex: parseInt(formData.correctIndex),
  };

  fetch("http://localhost:4000/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newQuestion),
  })
    .then((res) => res.json())
    .then((savedQuestion) => {
      onAddQuestion(savedQuestion);
      // ✅ Only update state if still mounted
      if (isMounted) {
        setFormData({
          prompt: "",
          answer1: "",
          answer2: "",
          answer3: "",
          answer4: "",
          correctIndex: 0,
        });
      }
    })
    .catch((err) => console.error("Error adding question:", err));
}
