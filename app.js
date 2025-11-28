const todoForm = document.querySelector('form');
const addButton = document.getElementById('add-button');
const todoListUL = document.getElementById('todo-list');
const todoInput = document.getElementById('todo-input');
const clearAllBtn = document.getElementById('clear-all');
const searchInput = document.getElementById('search-input');


let allTodos = getTodos();
updateTodoList();

// FORM SUBMIT
todoForm.addEventListener('submit', function(e) {
  e.preventDefault();
  addTodo();
});

// ADD TODO
function addTodo() {
  const todoText = todoInput.value.trim();
  // Get date and time
  const now = new Date();
  const createdAt = now.toLocaleString();
  if (todoText.length > 0) {
    const todoObject = {
      text: todoText,
      completed: false,
      createdAt

    };

    allTodos.push(todoObject);
    updateTodoList();
    saveTodos();
    todoInput.value = "";
  }
}

// UPDATE TODO LIST
function updateTodoList(filteredTodos = allTodos) {
  todoListUL.innerHTML = "";
   if (filteredTodos.length === 0) {
    todoListUL.innerHTML = `<p style="text-align:center; color:var(--secondary-color)">No todos found.</p>`;
    return;
  }

  filteredTodos.forEach((todo, todoIndex) => {
    
    const todoItem = createTodoItem(todo, todoIndex);
    todoListUL.append(todoItem);
  });
}

// CREATE EACH TODO ITEM
function createTodoItem(todo, todoIndex) {
  const todoId = "todo-" + todoIndex;
  const todoLI = document.createElement("li");
  todoLI.className = "todo";

  todoLI.innerHTML = `
    <input type="checkbox" id="${todoId}">
    <label class="custom-checkbox" for="${todoId}">
      <svg fill="transparent" xmlns="http://www.w3.org/2000/svg"
        height="24" viewBox="0 -960 960 960" width="24">
        <path d="M382-240 154-468l57-57 171 171 
        367-367 57 57-424 424Z"/>
      </svg>
    </label>

    <label for="${todoId}" class="todo-text">
      ${todo.text}
    </label>
    <small>Created: ${todo.createdAt}</small>

     <button class="edit-button" title="Edit"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--secondary-color)"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button>


    <button class="delete-button"  title="Delete">
      <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg"
        height="24" viewBox="0 -960 960 960" width="24">
        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40
        h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280
        h80v-360h-80v360Zm160 0h80v-360h-80v360Z"/>
      </svg>
    </button>

  `;
  const textLabel = todoLI.querySelector('.todo-text');
  const editBtn = todoLI.querySelector('button[title="Edit"]');
  function startEditing(){
    // create input and replace label
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = todo.text;
    // replace the label node with input
    textLabel.replaceWith(input);
    input.focus();
    // save on blur or Enter
    function finishEditing(save) {
      const newText = input.value.trim();
      if (save && newText.length > 0) {
        allTodos[todoIndex].text = newText;
        allTodos[todoIndex].createdAt = allTodos[todoIndex].createdAt || new Date().toISOString();
        saveTodos();

      }
      // putting label back
      const newLabel = document.createElement('label');
      newLabel.className = `todo-text ${allTodos[todoIndex].completed ? 'completed' : ''}`;
      newLabel.setAttribute('for', todoId);
      newLabel.textContent = allTodos[todoIndex].text;
      input.replaceWith(newLabel);
      updateTodoList();
    }

    input.addEventListener('blur', () => finishEditing(true));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        finishEditing(true);
        
      } else if (e.key === 'Escape') {
        finishEditing(false);
      }
    });
  }
  editBtn.addEventListener('click', startEditing);
  textLabel.addEventListener('dblclick', startEditing);
  


  // DELETE BUTTON
  const deleteButton = todoLI.querySelector(".delete-button");
  deleteButton.addEventListener("click", () => {
    deleteTodoItem(todoIndex);
  });
 



  // CHECKBOX
  const checkbox = todoLI.querySelector("input");
  checkbox.addEventListener("change", () => {
    allTodos[todoIndex].completed = checkbox.checked;
    saveTodos();
  });

  checkbox.checked = todo.completed;
  return todoLI;
}




// DELETE TODO
function deleteTodoItem(todoIndex) {
  allTodos = allTodos.filter((_, i) => i !== todoIndex);
  saveTodos();
  updateTodoList();
}



// Delete all todos
clearAllBtn.addEventListener('click', () => {
  if (allTodos.length === 0) return alert('No todos to clear.');
  if (confirm('Are you sure you want to delete ALL your todos?')) {
    allTodos = [];
    saveTodos();
    updateTodoList();
  }
});


// SEARCH TODOS LIVE
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
   
  const filtered = allTodos.filter(todo =>
    todo.text.toLowerCase().includes(query)
  );

  updateTodoList(filtered);
});



/*-------------LOCAL STORAGE----------------*/
//To save in the local storage
function saveTodos(){
  localStorage.setItem("todos",JSON.stringify(allTodos))
}
// To retrive from the local storage
function getTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem("todos"));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}



/*================THEME AND MODE================*/
const themeToggle = document.getElementById("theme-toggle");
const lightIcon = document.getElementById("light-icon");
const darkIcon = document.getElementById("dark-icon");

// Load saved theme
let theme = localStorage.getItem("theme") || "dark";
applyTheme(theme);

themeToggle.addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark";
  applyTheme(theme);
  localStorage.setItem("theme", theme);
});

function applyTheme(mode) {
  document.body.className = mode;
  document.body.style.transition = "300ms ease"


  if (mode === "light") {
    lightIcon.style.display = "block";
    darkIcon.style.display = "none";
  } else {
    lightIcon.style.display = "none";
    darkIcon.style.display = "block";
  }
}


