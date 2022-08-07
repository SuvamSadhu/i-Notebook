const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

//ROUTE 1:Get all the notes using GET"/api/auth/getuser" Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }
})

//ROUTE 2:Add a new note using POST "/api/auth/addnote" Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Enter a valid description').isLength({ min: 5 }),], async (req, res) => {
        //If there are errors return the error and bad request
        try {
            const { title, description, tag } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const note = new Note({
                title, description, tag, user: req.user.id
            })
            const savednote = await note.save();
            res.json(savednote)
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error occured");
        }
    })

//ROUTE 3:Update an existing note using PUT "/api/auth/updatenote" Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        const newnote = {};
        if (title) { newnote.title = title };
        if (description) { newnote.description = description };
        if (title) { newnote.tag = tag };

        //find the note to be updates by note id
        let note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).send("Not found");
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true });
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }
})

//ROUTE 4:Delete an existing note using DELETE "/api/notes/deletenote" Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {

    //find the note to be updated by note id
    let note = await Note.findById(req.params.id);

    if (!note) {
        return res.status(404).send("Not found");
    }

    //allow deleyion only if user owns this note
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ "Success": "Note has been deleted", note: note });
            
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");   
}
})


module.exports = router;