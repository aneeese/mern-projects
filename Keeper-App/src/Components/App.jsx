import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {
    const [notes, setNote] = useState([]);

    function addNote(newNote) {
        setNote(prevNotes => [...prevNotes, newNote]);
    }

    function deleteNote(id) {
        setNote(prevNotes => {
            return prevNotes.filter((note, index) => {
                return index !== id;
            })
        })
    }

    return (
        <div>
            <Header />
            <CreateArea AddNewNote = {addNote}/>
            {
                notes.map((note, index) => <Note key={index} id = {index} title={note.title} content={note.content} delFunc = {deleteNote}/>)
            }
            <Footer />
        </div>
    );
}

export default App;