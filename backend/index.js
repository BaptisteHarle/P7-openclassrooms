import express from 'express';
import path from 'path';
import UserController from './src/controllers/userController';
import PostController from './src/controllers/postController';
import CommentController from './src/controllers/commentController';
import { adminOnly, userAtLeast } from './src/middlewares/auth';


const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8080;

// Routes de l'app React
app.use('/', express.static(path.resolve(__dirname, './webapp')));
app.use('/signup', express.static(path.resolve(__dirname, './webapp')));
app.use('/wall', express.static(path.resolve(__dirname, './webapp')));
app.use('/manage', express.static(path.resolve(__dirname, './webapp')));

// Routes de l'API
app.get('/api/comment', adminOnly, CommentController.getComments);
app.get('/api/comment/:commentId', userAtLeast, CommentController.getComment);
app.post('/api/comment', userAtLeast, CommentController.createComment);
app.put('/api/comment/:commentId', userAtLeast, CommentController.modifyComment);
app.delete('/api/comment/:commentId', userAtLeast, CommentController.deleteComment);

app.get('/api/post', userAtLeast, PostController.getPosts);
app.get('/api/post/:postId', userAtLeast, PostController.getPost);
app.post('/api/post', userAtLeast, PostController.createPost);
app.put('/api/post/:postId', userAtLeast, PostController.modifyPost);
app.delete('/api/post/:postId', userAtLeast, PostController.deletePost);

app.get('/api/users', adminOnly, UserController.getUsers);
app.get('/api/user', userAtLeast, UserController.getUser);
app.post('/api/signup', UserController.createUser);
app.put('/api/user/:userId', userAtLeast, UserController.modifyUser);
app.delete('/api/user/:userId', userAtLeast, UserController.deleteUser);
app.post('/api/login', UserController.login);

app.listen(PORT, () => {
  console.log(`Server now listening to http://localhost:${PORT}`);
});