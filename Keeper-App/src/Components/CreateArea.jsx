import React, { useState } from "react";

function CreateArea(props) {

  const [note, setNote] = useState({
    title: "",
    content: ""
  })

  function handleInput(event) {
    const {name, value} = event.target;
    setNote(prevValue => {
      if (name === "title") {
        return {
          title: value,
          content: prevValue.content
        }
      } else if (name === "content") {
        return {
          title: prevValue.title,
          content: value
        }
      }
    })
  }
  
  return (
    <div>
      <form>
        <input onChange={handleInput} value={note.title} name="title" placeholder="Title" />
        <textarea onChange={handleInput} value={note.content} name="content" placeholder="Take a note..." rows="3" />
        <button onClick={(event) => {
            props.AddNewNote(note);
            event.preventDefault();
            setNote({
              title: "",
              content: ""
            })
          }
        }>Add</button>
      </form>
    </div>
  );
}

export default CreateArea;