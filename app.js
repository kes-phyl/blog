//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const ejs = require("ejs");
const _ = require('lodash');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const newBlogs = [{title: 'Home', body: "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero."}];
const app = express();



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//creating database connection... AND CREATING MONGOOSE MODEL

mongoose.connect('mongodb://127.0.0.1:27017/blogDB');

const blogSchema = {
  title: String,
  body: String
}

const  Blog = mongoose.model('blog', blogSchema);

//INSERTING DEFAULT ITEMS INTO THE DATABASE...



const blogInitial = new Blog({
  title: 'Home',
  body: 'It was the best of times, it was the worse of times. It was the age of wisdom, it was the age of foolishness. It was a spring of hope, It was a winter of despair. Are you feeling nostalgic? Has the loneliness resided? Have you successfully eliminated any reason to mingle... Is it worth it you ask?.. Think for a moment....'
})
const blogFinal = new Blog({
  title: 'Away',
  body: 'Have you been to Scotland before?? The journey to Scotland and the views is somehow significant to the race we have as humans. The view from the west midlands in the train all the way feeling the quiet ocean breeze.. At this point you have started seeing the highs and lows of the leaning Edingburgh valleys... with the cool breze... think for a moment..'
})



// Blog.find({}, function(err, foundResult){
//   console.log(foundResult)
//   if(!err){
   
//   }
// })



//creating the home route

app.get('/', function(req, res){
 Blog.find({}, function(err, foundBlog){
  if(!err){
    if(foundBlog.length === 0){
      Blog.insertMany([blogInitial, blogFinal], function(err){
        if(!err){
          console.log('saved succesfully')
          res.render('home', {newBlogs: foundBlog});
        }
      })
    
    }else{
      res.render('home', {newBlogs: foundBlog});
    }
   
  }
 })


  ;
})

//creating the post route

app.get('/post/:postName', function(req,res){
  const requestedTitle = req.params.postName;
  const lowerCaseRequestedTitle = _.lowerCase(requestedTitle);

  newBlogs.forEach(function(blog){
    const storedTitle = blog.title;
    const storedBody = blog.body;
    const lowerCaseStoredTitle = _.lowerCase(storedTitle)

    if(lowerCaseRequestedTitle === lowerCaseStoredTitle){
      res.render('post', {title: storedTitle, body: storedBody })
    }
  })
  // console.log(req.params.postName);
})


//creating the about us route

app.get('/about', function(req, res){
  res.render('about', {aboutContent: aboutContent});
})

//creating the contact us route

app.get('/contact', function(req, res){
  res.render('contact', {contactContent: contactContent});
})

//creating the compose route

app.get('/compose', function(req, res){
  res.render('compose')
})

//post route for the submitted new BLOG

app.post('/compose/', function(req, res){

  const newPost = {
    'title': req.body.postTitle,
    'body': req.body.postBody
  }
  newBlogs.push(newPost)
  res.redirect('/')
  // res.render('home', {homeContent: homeStartingContent, newBlogs: newBlogs[1].title , newBlogs: newBlogs[1].body});

})






app.listen(3000, function() {
  console.log("Server started on port 3000");
});
