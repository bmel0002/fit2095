//Import packages
const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require('body-parser');
const randomString = require('randomstring');

let Book = require('./models/book');
let Author = require('./models/author');

//Configure Express
const app = express()

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(express.static('images'));
app.use(express.static('css'));
app.use(bodyparser.urlencoded({ extended: false }));
app.listen(8080);


// Connection URL
const DB_URL = "mongodb://localhost:27017/week5library";


//Connect to mongoDB server
mongoose.connect(DB_URL, function (err) {
    if (err) console.log(err);
    else {
        console.log('Connection successful');
    }
});


//Routes Handlers

//Insert new book
//GET request: send the page to the client
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});
//POST request: receive the details from the client and insert new document (i.e. object) to the collection (i.e. table)
app.post('/addnewbook', function (req, res) {
    let bookDetails = req.body;
    if (bookDetails.ISBN.length === 0) {
        bookDetails.ISBN = generateISBN();
    }
    let book = new Book ({
        _id: new mongoose.Types.ObjectId(),
        title: bookDetails.title,
        author: bookDetails.author,
        relDate: bookDetails.relDate,
        isbn: bookDetails.ISBN,
        summary: bookDetails.summary
    });
    book.save( function (err) {
        if (err) {
            console.log(err);
            res.redirect('/');
        }
        else {
            console.log("Book added successfully");
            res.redirect('/getbooks');

            Author.findByIdAndUpdate(bookDetails.author,{
                $inc: { numBooks: 1 }
            }, function (err,result) {
                if (err) console.log(err);
            });
        }
    });
});

//List all books
//GET request: send the page to the client. Get the list of documents form the collections and send it to the rendering engine
app.get('/getbooks', function (req, res) {
    Book.find({}).populate('author').exec(function (err, books) {
        res.render("listbooks.html", {booksDb: books});
    });
});

//Update book: 
//GET request: send the page to the client 
app.get('/updatebook', function (req, res) {
    res.sendFile(__dirname + '/views/updatebook.html');
});

//POST request: receive the details from the client and do the update
app.post('/updatebookdata', function (req, res) {
    let bookDetails = req.body;
    Book.findOneAndUpdate({isbn:bookDetails.oldISBN},{
        title: bookDetails.newTitle,
        author: bookDetails.newAuthor,
        relDate: bookDetails.newRelDate,
        summary: bookDetails.newSummary
    }, function (err,result) {
        if (err) {
            console.log(err);
            res.redirect('/updatebook');
        }
        else {
            res.redirect('/getbooks');
        }
    });
});

//Delete book: 
//GET request: send the page to the client to enter the book's name
app.get('/deletebook', function (req, res) {
    res.sendFile(__dirname + '/views/deletebook.html');
});
//POST request: receive the book's name and do the delete operation 
app.post('/deletebookdata', function (req, res) {
    let bookDetails = req.body;
    Book.deleteOne({ isbn: bookDetails.ISBN }, function (err, doc) {
        if (err) {
            console.log(err);
            res.redirect('/deletebook');
        }
        else {
        console.log(bookDetails.ISBN)
        console.log(doc);
        }
    });
    res.redirect('/getbooks');// redirect the client to list books page
});

//Insert author
//GET request: send the page to the client
app.get('/addauthor', function (req, res) {
    res.sendFile(__dirname + '/views/addauthor.html');
});
//POST request: receive the details from the client and insert new document (i.e. object) to the collection (i.e. table)
app.post('/addnewauthor', function (req, res) {
    let authorDetails = req.body;
    let author = new Author ({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: authorDetails.fname,
            lastName: authorDetails.lname
        },
        dob: authorDetails.dob,
        address: {
            state: authorDetails.state,
            suburb: authorDetails.suburb,
            street: authorDetails.street,
            unit: authorDetails.unit
        },
        numBooks: authorDetails.numBooks
    });
    author.save( function (err) {
        if (err) {
            console.log(err);
            res.redirect('/addauthor');
        }
        else {
            console.log("Author added successfully");
            res.redirect('/getauthors');
        }
    });
});

//List all authors
//GET request: send the page to the client. Get the list of documents form the collections and send it to the rendering engine
app.get('/getauthors', function (req, res) {
    Author.find({},function (err, authors) {
        res.render("listauthors.html", {authorsDb: authors});
    });
});

//Update author: 
//GET request: send the page to the client 
app.get('/updateauthor', function (req, res) {
    res.sendFile(__dirname + '/views/updateauthor.html');
});

//POST request: receive the details from the client and do the update
app.post('/updateauthordata', function (req, res) {
    let authorDetails = req.body;
    Author.findByIdAndUpdate({_id: authorDetails.ID},{
        numBooks: authorDetails.numBooks
    }, function (err,result) {
        if (err) {
            console.log(err);
            res.redirect('/updateauthor');
        }
        else {
            res.redirect('/getauthors');
        }
    });
});

//Delete book: 
//GET request: send the page to the client to enter the author's ID
app.get('/deleteauthor', function (req, res) {
    res.sendFile(__dirname + '/views/deleteauthor.html');
});
//POST request: receive the author's ID and do the delete operation 
app.post('/deleteauthordata', function (req, res) {
    let authorDetails = req.body;
    Author.deleteOne({ _id: authorDetails.ID }, function (err, doc) {
        if (err) {
            console.log(err);
            res.redirect('/deleteauthor');
        }
        console.log(doc);
    });
    res.redirect('/getauthors');// redirect the client to list authors page
});

function generateISBN() {
    ISBN = randomString.generate({
        length: 13,
        charset: 'numeric'
    });
    return ISBN;
}
