import React, { useState, useContext, useRef } from 'react'
import { useEffect } from 'react';
import NoteContext from '../context/notes/NoteContext';
import Addnote from './Addnote';
import NoteItem from './NoteItem';
import {  useNavigate } from 'react-router-dom'

const Notes = (props) => {
  const context = useContext(NoteContext);
  const navigate = useNavigate();
  const { notes, getNote, editNote } = context;
  useEffect(() => {
    if(localStorage.getItem('token')) {
      getNote();
    } else {
      navigate('/login')
    }
    // eslint-disable-next-line
  }, [])
  const ref = useRef(null);
  const refClose = useRef(null);
  const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "default" })

  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag });
  }

  const handleClick = (e) => {
    editNote(note.id, note.etitle, note.edescription, note.etag);
    refClose.current.click();
    props.showAlert("Updated successfully", "success")
  }

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value })
  }
  return (
    <>
      <Addnote showAlert={props.showAlert} />
      <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input type="text" value={note.etitle} required minLength={5} className="form-control" id="etitle" name='etitle' aria-describedby="emailHelp" onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <input type="text" value={note.edescription} required minLength={5} className="form-control" id="edescription" name='edescription' onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="tag" className="form-label">Tag</label>
                  <input type="text" value={note.etag} className="form-control" id="etag" name='etag' onChange={onChange} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button disabled={note.etitle.length < 5 || note.edescription.length < 5} onClick={handleClick} type="button" className="btn btn-primary">Update Note</button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className='row my-3'>
          <h2>Your Notes</h2>
          <div className="container mx-2">
            {notes.length === 0 && "No notes to display"}
          </div>
          {notes.map((note) => {
            return <NoteItem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />;
          })}
        </div>
      </div>
    </>
  )
}

export default Notes
