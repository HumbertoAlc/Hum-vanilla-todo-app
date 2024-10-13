// name user
const user = "humberto";
// guardo la URL en una variable
const endpoint = `https://wd1-todos-api.diurivj.workers.dev/api/${user}/todos`;

// Parámetros de búsqueda
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    filter: params.get("filter"),
  };
}

/* GET */
async function loadTodos() {
  const { filter } = getQueryParams();

  let filterQuery = `?filter=`;

  if (!filter) {
    const response = await fetch(`${endpoint}`);
    if (!response.ok) throw new Error("algo salio mal");
    const data = await response.json();
    return data.todos;
  }

  if (filter === "completed") {
    filterQuery += `completed`;
  }

  if (filter === "active") {
    filterQuery += `active`;
  }

  const response = await fetch(`${endpoint}?filter=${filter}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("algo salio mal");
  const data = await response.json();
  return data.todos;
}

/* POST */
async function createTodo(todo) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todo }),
  });
  if (!response.ok) throw new Error("algo salio mal");
  const data = await response.json();
  return data.todo;
}

/* PATH */
async function updateTodo(todo, completed) {
  const body = {
    id: todo.id,
    completed: completed,
  };

  const response = await fetch(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("algo salio mal");
  const data = await response.json();
  replaceTodo(data.todo);
}

function generateTodo(todo) {
  const li = document.createElement("li");

  li.setAttribute("id", todo.id);

  li.classList.add("flex", "p-4", "items-center", "gap-x-4");

  if (todo.completed) {
    li.classList.add("line-through");
  }

  const input = document.createElement("input");

  input.setAttribute("id", `${todo.id}-${todo.todo}`);

  input.classList.add("w-5", "h-5", "cursor-pointer");

  input.setAttribute("type", "checkbox");

  if (todo.completed) {
    input.checked = true;
  }

  // Agregar la función 'updateTodo' cuando el checkbox sea clickeado
  input.onchange = (e) => updateTodo(todo, e.target.checked);

  const label = document.createElement("label");

  label.classList.add("cursor-pointer", "w-full");

  label.setAttribute("for", `${todo.id}-${todo.todo}`);

  label.innerText = todo.todo;

  li.appendChild(input);

  li.appendChild(label);

  return li;
}

function appendTodo(todo) {
  const li = generateTodo(todo);
  const todosContainer = document.getElementById("ul_container");
  todosContainer.appendChild(li);
}

async function renderTodos() {
  const todos = await loadTodos();
  todos.forEach((todo) => appendTodo(todo));
}

function replaceTodo(todo) {
  const node = document.getElementById(todo.id);
  const newNode = generateTodo(todo);
  node.replaceWith(newNode);
}

function styleFilters() {
  // encontrar los searchParams del URL
  const { filter } = getQueryParams();

  // Seleccionar los elementos
  const activeFilter = document.getElementById("filter-active");
  const completedFilter = document.getElementById("filter-completed");
  const allFilter = document.getElementById("filter-all");

  // Limpiar clases
  activeFilter.classList.remove("border-black", "border", "shadow-md");
  completedFilter.classList.remove("border-black", "border", "shadow-md");
  allFilter.classList.remove("border-black", "border", "shadow-md");

  // Dependiendo del valor del filtro, agregar las clases correspondientes
  if (filter === "active") {
    activeFilter.classList.add("border-black", "border", "shadow-md");
  } else if (filter === "completed") {
    completedFilter.classList.add("border-black", "border", "shadow-md");
  } else {
    // Cualquier otro valor o 'all' como predeterminado
    allFilter.classList.add("border-black", "border", "shadow-md");
  }
}

// Llamado de  las funciones renderTodos y styleFilters cuando cargue la página
renderTodos();
styleFilters();

const createTodoInput = document.getElementById("createTodoInput");

createTodoInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const todo = await createTodo(e.target.value);
    appendTodo(todo);
    e.target.value = "";
  }
});
