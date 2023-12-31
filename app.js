var express = require("express");
var app = express();
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverrise = require("method-override")
var expressSanitizer  = require("express-sanitizer")


mongoose.connect("mongodb://localhost/Restfull_blog1");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"))
app.use(methodOverride("_method"));


// MONGOOSE / MODEL CONFI

var blogSchema = new mongoose.Schema({
    title: String,
    Image: String,
    body: String,
    created: {type:Date, default:Date.now}
});
var Blog = mongoose.model("Blog" , blogSchema);


// Routs

app.get("/",function(req,res){
    res.redirect("/blogs");
    
});

// index route
app.get("/blogs",function(req, res){
    Blog.find({}, function(err , blogs){
        if(err){

            console.log("ERROR");
        }
        else{
            // console.log(blogs)
            res.render("index", { blogs:blogs})
        }
    });
});

// New Route
app.get("/blogs/new",function(req,res){
    res.render("new");
})

// create Route
app.post( "/blogs", function(req,res){
    console.log(req.body);
    // create blog
    console.log(req.body);
    Blog.create(req.body.blog, function(err, newBlog){
    if(err){
        res.render("new");
    }else{
        //  than redirect to the index
        res.redirect("/blogs");
    }
});
});

// Show Route
app.get("/blogs/:id" , function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("show",{blog: foundBlog});
        }
    })
})

// Edit Routes
app.get("/blogs/:id/edit" , function(req,res){
    Blog.findById(req.params.id , function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("edit", {blog:foundBlog})
        }
    });
})

//  Route Update
app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// Route Delete
app.delete("/blogs/:id", function(req,res){
// destroy blog
    Blog.findByIdAndRemove(req.params.id ,function(err){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs");
        }
    })
})

app.listen(3000,()=>{
    console.log(" The Blog server has started! ");
});


