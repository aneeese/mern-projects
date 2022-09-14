import React, { useState } from "react";
import AddIcon from "@material-ui/icons/Add"
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom'

function CreateArea(props) {

  const [note, setNote] = useState({ title: "", content: "" });
  const [isClicked, setClick] = useState(false);

  function handleInput(event) {
    const {name, value} = event.target;
    setNote(prevValue => {
      return {
        ...prevValue, [name]: value
      }
    })  
  }

  function handleClick() {
    setClick(true);
  }
  
  return (
    <div>
      <form className="create-note">
        { 
        isClicked ? <input 
          onChange={handleInput} 
          value={note.title} 
          name="title" 
          placeholder="Title" /> : null
        }
        <textarea 
          onChange={handleInput} 
          value={note.content} 
          name="content" 
          placeholder="Take a note..." 
          rows={isClicked ? "3" : "1"} 
          onClick={handleClick}/>
        <Zoom in={isClicked}>
          <Fab 
            onClick={(event) => {
              props.AddNewNote(note);
              event.preventDefault();
              setNote({ title: "", content: "" })
            }}>
              <AddIcon />
          </Fab>
        </Zoom>
        
      </form>
    </div>
  );
}

export default CreateArea;