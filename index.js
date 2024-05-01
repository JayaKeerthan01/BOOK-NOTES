import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import { log } from "console";

const app=express()
const PORT=3000

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))

const db= new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"books",
    password:"Jayakeerthan@11",
    port:5432
})
db.connect()


app.get('/',async(req,res)=>{
    const all_books=await db.query("SELECT * FROM new_book")
    res.render("index.ejs",{books:all_books.rows})
})

app.get('/add_new',(req,res)=>{
    res.render('add_new.ejs')
})

app.post('/add_new',async(req,res)=>{
    var book_details=req.body
    await db.query("INSERT INTO new_book (title,description,isbn,rating) VALUES($1,$2,$3,$4)",[book_details.title,book_details.description,book_details.isbn,book_details.rating])
    res.redirect('/')
})

app.get('/read_notes/:id',async(req,res)=>{
    const id=parseInt(req.params['id'])
    const specific_book=await db.query("SELECT * FROM new_book WHERE id=$1",[id])
    const specific_notes=await db.query("SELECT notes FROM read_notes WHERE book_id=$1",[id])
    res.render('read_notes.ejs',{book:specific_book.rows[0],notes:specific_notes.rows})
})

app.post('/new_notes/:id',async(req,res)=>{
    const id=parseInt(req.params['id'])
    const notes=req.body.notes
    await db.query("INSERT INTO read_notes (notes,book_id) VALUES($1,$2)",[notes,id])
    res.redirect(`/read_notes/${id}`)
})

app.get('/edit_book/:id',async(req,res)=>{
    const id=parseInt(req.params['id'])
    const specific_book = await db.query("SELECT * FROM new_book WHERE id=$1",[id])
    res.render('add_new.ejs',{specific_book:specific_book.rows[0],book_id:id})
    
})                                       

app.post('/edited_book/:id',async(req,res)=>{
    const id=parseInt(req.params.id)
    const values=req.body
    await db.query("UPDATE new_book SET title=$1,description=$2,isbn=$3,rating=$4 WHERE id=$5",[values.title,values.description,values.isbn,values.rating,id])
    res.redirect('/')
})

app.get('/delete_book/:id',async(req,res)=>{
    const id =parseInt(req.params.id)
    await db.query("DELETE FROM read_notes WHERE book_id=$1",[id])
    await db.query("DELETE FROM new_book WHERE id=$1",[id])
    res.redirect('/')
})

app.listen(PORT,()=>{
    console.log("Your server is currently running on th port: "+PORT);
})








































