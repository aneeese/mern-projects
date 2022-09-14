import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import { useEffect } from "react";

function App() {
    const [notes, setNote] = useState([]);
    const [newNote, setNewNote] = useState({});

    function addNote(note) {
        setNewNote(note);
    }
    
    useEffect(() => {
        axios.post("http://localhost:4000/postNote", {note: newNote})
    }, [newNote])

    useEffect(() => {
        axios.get("http://localhost:4000/getNotes").then(response => setNote(response.data))
    }, [notes, newNote])
    

    function deleteNote(id) {
        setNote(prevNotes => {
            return prevNotes.filter((note, index) => {
                return index !== id;
            })
        })
        axios.delete(`http://localhost:4000/delete/${id}`).then(response => console.log(response))
    }

    return (
        <div>
            <Header />
            <CreateArea AddNewNote = {addNote}/>
            {
                notes.map((note) => <Note key={note._id} id = {note._id} title={note.title} content={note.content} delFunc = {deleteNote}/>)
            }
            <Footer />
        </div>
    );
}

export default App;