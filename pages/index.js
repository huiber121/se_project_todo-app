import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import TodoCounter from "../components/TodoCounter.js";

const addTodoButton = document.querySelector(".button_action_add");
const addTodoPopupEl = document.querySelector("#add-todo-popup");
const addTodoForm = addTodoPopupEl.querySelector(".popup__form");

const todoCounter = new TodoCounter(initialTodos, ".counter__text");
const formValidator = new FormValidator(validationConfig, addTodoForm);

//create a new instance of PopupWithForm
//pass the popup selector and a handleFormSubmit function as arguments
const addTodoPopup = new PopupWithForm({
  popupSelector: "#add-todo-popup",
  handleFormSubmit: (inputValues) => {
    const name = inputValues.name;
    const dateInput = inputValues.date;

    // Create a date object and adjust for timezone
    const date = new Date(dateInput);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

    const values = { name, date, id: uuidv4() };
    // const todo = generateTodo(values);
    // section.addItem(todo);
    renderTodo(values);
    todoCounter.updateTotal(true);

    formValidator.resetValidation();

    addTodoPopup.close();
  },
});

//create a new instance of Section
//pass initialTodos as an argument
//initialTodos is an array of todo items
//each todo item is an object with properties id, name, completed, and date
//the Section instance will render each todo item
const section = new Section({
  items: initialTodos, //pass initialTodos here
  renderer: (item) => {
    renderTodo(item);
  },
  containerSelector: ".todos__list",
});

//call the setEventListeners method
addTodoPopup.setEventListeners();

//call section instance's renderItems method
section.renderItems();

formValidator.enableValidation();

function handleChecked(completed) {
  todoCounter.updateCompleted(completed);
}

function handdleDelete(completed) {
  if (completed) {
    todoCounter.updateCompleted(false);
  }
  todoCounter.updateTotal(false);
}

function renderTodo(item) {
  const todo = generateTodo(item);
  section.addItem(todo);
}

// The logic in this function should all be handled in the Todo class.
// Using funtion hoisting for the initial declaration of section instance.
function generateTodo(data) {
  const todo = new Todo(data, "#todo-template", handleChecked, handdleDelete);
  const todoElement = todo.getView();
  return todoElement;
}

addTodoButton.addEventListener("click", () => {
  addTodoPopup.open();
});

// this is moved to the Popup class
// addTodoCloseBtn.addEventListener("click", () => {
//   addTodoPopup.close();
// });

//this is moved to the declared popupwithform instance.
// addTodoForm.addEventListener("submit", (evt) => {
//   evt.preventDefault();
//   const name = evt.target.name.value;
//   const dateInput = evt.target.date.value;

//   // Create a date object and adjust for timezone
//   const date = new Date(dateInput);
//   date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

//   const values = { name, date, id: uuidv4() };
//   const todo = generateTodo(values);
//   section.addItem(todo);

//   formValidator.resetValidation();

//   addTodoPopup.close();
// });
