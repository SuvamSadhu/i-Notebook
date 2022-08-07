import React,{ useContext } from 'react'
import { useState } from 'react';
import NoteContext from '../context/notes/NoteContext';

const Addnote = (props) => {
    const context = useContext(NoteContext);
    const {addNote} = context;

    const[note, setNote]  =  useState({title:"", description:"", tag:""})
    const handleClick = (e) => {
            e.preventDefault();
            addNote(note.title, note.description, note.tag);
            setNote({title:"", description:"", tag:""})
            props.showAlert("Added successfully","success")

    }

    const onChange = (e) => {
        setNote({...note, [e.target.name]: e.target.value})
    }
    return (
        <div>
            <div className='container my-3'>
                <h2>Add a Note</h2>
                <form>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" value={note.title} className="form-control" id="title" name='title' aria-describedby="emailHelp" onChange={onChange} required  minLength={5}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" value={note.description} className="form-control" id="description" name='description' onChange={onChange} required  minLength={5}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label">Tag</label>
                        <input type="text" value={note.tag} className="form-control" id="tag" name='tag' onChange={onChange} required  minLength={5}/>
                    </div>
                    <button disabled={note.title.length<5 || note.description.length<5} type="submit" onClick={handleClick} className="btn btn-primary">Add Note</button>
                </form>
            </div>
        </div>
  )
}

export default Addnote
