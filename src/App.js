import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

// button-group
const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];

const toDoItems = [
  {
    key: uuidv4(),
    label: "Have fun",
  },
  {
    key: uuidv4(),
    label: "Spread Empathy",
  },
  {
    key: uuidv4(),
    label: "Generate Value",
  },
];

// helpful links:
// useState crash => https://blog.logrocket.com/a-guide-to-usestate-in-react-ecb9952e406c/
function App() {
  const [itemToAdd, setItemToAdd] = useState("");
  const [itemToAdd2, setItemToAdd2] = useState("");

  //arrow declaration => expensive computation ex: API calls
  const [items, setItems] = useState(() =>
  {
    const getTodos = JSON.parse(localStorage.getItem('items'))
  
    if (getTodos) {
      return (getTodos)
    } else {
      return toDoItems
    }
  })

  const [filterType, setFilterType] = useState("");

  const [update, setUpdate] = useState(false);

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };
  const filterItem = (evento) => {
    setItemToAdd(evento.target.value);
    todoFilter();
  };
  const[todos, setTodos] = useState(()=>
{
  const getTodos = JSON.parse(localStorage.getItem('todos'))

  if (getTodos) {
    return (getTodos)
  } else {
    return []
  }
}

  ) 
  // const localstorage = (event2) => {
  //   setItemToAdd(event2.target.value);
  //   tosaveStorage();
  // };

  // settodos
  useEffect(() =>{
    localStorage.setItem('items', JSON.stringify(items))
  }, [items])

  // // get todos
  // useEffect(() => {
  //   const getTodos = JSON.parse(localStorage.getItem('todos'))

  //   if(getTodos) {
  //     setTodos(getTodos)
  //   }
  // }, [])
  // const [todos, setTodos] = useState(() => {
    // window.localStorage.setItem("todos", itemToAdd)

    // get the todos from localstorage
  //   const savedTodos = localStorage.getItem("todos");
  //   // if there are todos stored
  //   if (savedTodos) {
  //     // return the parsed JSON object back to a javascript object
  //     return JSON.parse(savedTodos);
  //     // otherwise
  //   } else {
  //     // return an empty array
  //     return [];
  //   }
  // });
  
  const [filtered, setFiltered] = useState([]);

  function deleteItem(ind) {
      let arr = []
      if(ind == 0) {
        arr = items.shift()
      }else {
        arr = items.splice(ind,1)     
      }
      setItems([...arr])
  }
  // function tosaveStorage() {
  //   window.localStorage.setItem("saver", itemToAdd)
  //   window.localStorage.getItem("saver")
  // }

  function todoFilter() {
      // if(condition === 'all') {
      //   setFiltered(items)
      // } else {
      //   let newTodo = [...items].filter(item => item.status === condition)
      //   setFiltered(newTodo)
      // }

      let DATA = items.filter((item) => item.label.toLowerCase().match(itemToAdd.toLowerCase()))
      setFiltered(DATA)
  }

  const handleAddItem =  () => {
    // mutating !WRONG!
    // const oldItems = items;
    // oldItems.push({ label: itemToAdd, key: uuidv4() });
    // setItems(oldItems);

    // not mutating !CORRECT!
    setItems((prevItems) => [
      ...prevItems,
      { label: itemToAdd2, key: uuidv4() },
    ]);

    setItemToAdd2("");
  };

  const handleItemDone = ({ key }) => {
    //first way
    // const itemIndex = items.findIndex((item) => item.key === key);
    // const oldItem = items[itemIndex];
    // const newItem = { ...oldItem, done: !oldItem.done };
    // const leftSideOfAnArray = items.slice(0, itemIndex);
    // const rightSideOfAnArray = items.slice(itemIndex + 1, items.length);
    // setItems([...leftSideOfAnArray, newItem, ...rightSideOfAnArray]);

    //  second way
    // const changedItem = items.map((item) => {
    //   if (item.key === key) {
    //     return { ...item, done: item.done ? false : true };
    //   } else return item;
    // });

    //second way updated
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, done: !item.done };
        } else return item;
      })
    );
  };

  const handleFilterItems = (type) => {
    setFilterType(type);
  };

  const amountDone = items.filter((item) => item.done).length;

  const amountLeft = items.length - amountDone;

  const filteredItems =
    !filterType || filterType === "all"
      ? items
      : filterType === "active"
      ? items.filter((item) => !item.done)
      : items.filter((item) => item.done);

      let data = itemToAdd.length == 0 ? filteredItems : filtered

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>
          {amountLeft} more to do, {amountDone} done
        </h2>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          onChange={filterItem}
          value={itemToAdd}
        />
        {/* Item-status-filter */}
        <div className="btn-group">
          {buttons.map((item) => (
            <button
              onClick={() => handleFilterItems(item.type)}
              key={item.type}
              type="button"
              className={`btn btn-${
                filterType !== item.type ? "outline-" : ""
              }info`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {
        // filteredItems.length > 0 &&
          data.map((item, index) => (
            <li key={item.key} className="list-group-item">
              <span className={`todo-list-item${item.done ? " done" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => handleItemDone(item)}
                >
                  {item.label}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button onClick={()=>deleteItem(index)}
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd2}
          type="text"
          className="form-control"
          placeholder="What needs to inputbe done"
          onChange={event=>setItemToAdd2(event.target.value)}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
