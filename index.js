import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";


const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


let posts = []
let imageURL=[
    "/images/360_F_679108763_CrjLUzZDMsCfc0nemzehQbpOVtjeJNK3.jpg",
    "/images/204163252-foto-hermoso-paisaje-de-la-naturaleza-vista-ilustración.jpg",
    "/images/images.jpeg",
    "/images/istockphoto-1124718823-612x612.jpg"
]

app.post("/create", (req, res) => {
    let post = {
        id: posts.length + 1,
        title: req.body["title"],
        content: req.body["content"],
        image: imageURL[posts.length % imageURL.length]
    }
    posts.push(post)
    res.render("index.ejs", { posts: posts });
})

app.get("/", (req, res) => {
    res.render("index.ejs", {
        posts: posts,
    });
})
app.use((req, res, next) => {
    console.log(`Request Method: ${req.method}, URL: ${req.url}`);
    next();
});

app.get('/posts/:id/edit', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find((p) => p.id === postId);

    if (post) {
        res.render('edit_post.ejs', { post : post });
    } else {
        res.status(404).send('Post not found.');
    }
});

app.put('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id); // Extract the ID from the URL
    const updatedtitle = req.body["title"]; // The updated data sent in the request body
    const updatedcontent = req.body["content"]; // The updated data sent in the request body
    // Find the post to update
    const index = posts.findIndex((post) => post.id === postId);

    if (index !== -1) {
        // Update the post data
        posts[index].title = updatedtitle;
        posts[index].content =  updatedcontent;
        // res.send(`Post with ID ${postId} updated successfully.`);
        console.log(req.body);
        
        
    } else {
        res.status(404).send('Post not found.');
    }

    res.render("index.ejs", {
        posts: posts
    });
});


app.delete('/posts/:id', (req, res) => {
    console.log(`DELETE request for post ID: ${req.params.id}`);
    let requestedPostId = parseInt(req.params.id)
    // Find the index of the post to delete
    let index = posts.findIndex((p) => p.id === requestedPostId);
    
    // Ensure index is valid before attempting to delete
    if (index !== -1) {
        posts.splice(index, 1); // Remove one post at the found index
        console.log(`Deleted post at index: ${index}`);
    } else {
        console.log(`Post with ID ${req.params.id} not found.`);
    }

    // Re-render the index page with the updated posts array
    res.render("index.ejs", {
        posts: posts
    });
});



app.get("/add_post", (req, res) => {
    res.render("add_post.ejs")
})

app.get("/posts/:id", (req, res) => {
    const requestedPostId = parseInt(req.params.id); // Get the post ID from the URL
    const post = posts.find((p) => p.id === requestedPostId);

    if (post) {
        res.render('content.ejs', { posts: post });
    } else {
        res.status(404).send('Post not found');
    }
})

app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
})

