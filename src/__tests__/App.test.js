import React from "react";
import "whatwg-fetch";
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { server } from "../mocks/server";

import App from "../components/App";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Helper functions to target navigation buttons specifically 
const viewQuestionsButton = () =>
  screen.queryByRole("button", { name: /View Questions/i });
const newQuestionButton = () =>
  screen.queryByRole("button", { name: /New Question/i });


test("displays question prompts after fetching", async () => {
  render(<App />);

  fireEvent.click(viewQuestionsButton());

  expect(await screen.findByText(/lorem testum 1/g)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 2/g)).toBeInTheDocument();
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);

  // wait for first render of list (otherwise we get a React state warning)
  await screen.findByText(/lorem testum 1/g);

  // click form page
  fireEvent.click(newQuestionButton());

  // fill out form (Labels now exist in QuestionForm.js)
  fireEvent.change(screen.queryByLabelText(/Prompt:/), {
    target: { value: "Test Prompt" },
  });
  
  // Queries now rely on the unique labels added to QuestionForm.js
  fireEvent.change(screen.queryByLabelText(/Answer 1:/), {
    target: { value: "Test Answer 1" },
  });
  fireEvent.change(screen.queryByLabelText(/Answer 2:/), {
    target: { value: "Test Answer 2" },
  });

  fireEvent.change(screen.queryByLabelText(/Correct Answer:/), {
    target: { value: "1" },
  });

  // submit form
  fireEvent.submit(screen.queryByText(/Add Question/));

  // view questions
  fireEvent.click(viewQuestionsButton());

  expect(await screen.findByText(/Test Prompt/g)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 1/g)).toBeInTheDocument();
});

test("deletes the question when the delete button is clicked", async () => {
  const { rerender } = render(<App />);

  fireEvent.click(viewQuestionsButton());

  await screen.findByText(/lorem testum 1/g);

  fireEvent.click(screen.queryAllByText("Delete Question")[0]);

  await waitForElementToBeRemoved(() => screen.queryByText(/lorem testum 1/g));

  rerender(<App />);

  await screen.findByText(/lorem testum 2/g);

  expect(screen.queryByText(/lorem testum 1/g)).not.toBeInTheDocument();
});

test("updates the answer when the dropdown is changed", async () => {
  const { rerender } = render(<App />);

  // Use the specific button query (or stick to queryByText if that's preferred for this test)
  fireEvent.click(screen.queryByText(/View Questions/));

  await screen.findByText(/lorem testum 2/g);

  fireEvent.change(screen.queryAllByLabelText(/Correct Answer:/)[0], {
    target: { value: "3" },
  });

  // FIX: Wait for the component to re-render with the new value after the async PATCH
  expect(await screen.findByDisplayValue("3")).toBeInTheDocument();

  rerender(<App />);

  // The rerender should confirm persistence, checking the value attribute is fine here.
  expect(screen.queryAllByLabelText(/Correct Answer:/)[0].value).toBe("3");
});