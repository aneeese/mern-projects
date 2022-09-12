import React, { useState, useEffect } from "react";
import axios from "axios";
import ToDoItem from "./ToDoItem";
import InputArea from "./InputArea";

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  function addItem(inputText) {
    if (inputText.length !== 0) {
      setNewItem(inputText);
    }
  }

  useEffect(() => {
    axios.get("http://localhost:4000/all-items").then(response => setItems(response.data));
  }, [newItem, items])

  useEffect(() => {
    axios.post("http://localhost:4000/postName", {postName: newItem})
  }, [newItem])

  function deleteItem(id) {
    axios.delete(`http://localhost:4000/delete/${id}`).then(response => console.log())
    setItems((prevItems) => {
      return prevItems.filter((item, index) => {
        return index !== id;
      });
    });
  }

  return (
    <div className="container">
      <div className="heading">
        <h1>To-Do List</h1>
      </div>
      <InputArea addNewItem={addItem} />
      <div>
        <ul>
          {items.map((todoItem) => (
            <ToDoItem
              key={todoItem.id}
              id={todoItem.id}
              text={todoItem.name}
              onChecked={deleteItem}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;