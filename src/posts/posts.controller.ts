import express from 'express';
import Controller from "../interfaces/controller.interface";
import postsModel from "./posts.model";
import Post from "./post.interface";
import PostNotFoundException from "../exceptions/PostNotFoundException";

class PostsController{
    public path = '/posts';
    public router = express.Router();

    // private posts: Post[] = [];
    private post = postsModel;

    constructor() {
        this.initRoutes();
    }

    public initRoutes(){
        this.router.get(this.path, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPostById);
        this.router.post(this.path, this.createPost);
        this.router.put(`${this.path}/:id`, this.updatePost);
        this.router.delete(`${this.path}/:id`, this.deletePost);
    }

    private getAllPosts = async (req:express.Request, res:express.Response) => {
        const posts = await this.post.find();
        res.json({
            count: posts.length,
            posts
        });
    }

    private getPostById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {
        const {id} = req.params;

        const post = await this.post.findById(id);

        if (post) {
            res.json(post);
        }
        else {
           next(new PostNotFoundException(id));
        }
    }

    private createPost = async (req:express.Request, res:express.Response) => {
        const postData: Post = req.body;

        const createdPost = new this.post(postData);
        await createdPost.save();
        res.json(createdPost);
    }

    private updatePost = async(req:express.Request, res:express.Response, next:express.NextFunction) =>{
        const {id} = req.params;
        const postData: Post = req.body;

        const updatedPost = await this.post.findByIdAndUpdate(id, postData, { new: true });
        if (updatedPost){
            res.json(updatedPost);
        } else {
            next(new PostNotFoundException(id));
        }

        // const getPost = await this.post.findById(id);
        //
        // if(getPost){
        //     getPost.title = postData.title;
        //     getPost.content = postData.content;
        //     getPost.author = postData.author;
        //
        //     res.json(getPost);
        //     getPost.save();
        // }
    }

    private deletePost = async(req:express.Request, res:express.Response, next: express.NextFunction) => {
        const {id} = req.params;

        const successResponse = await this.post.findByIdAndDelete(id);

        if (successResponse) {
            res.send(200);
        } else {
            next(new PostNotFoundException(id));
        }
        // const getPost = await this.post.findById(id)
        //
        // if(getPost)
        // {
        //     getPost.remove();
        //     res.json('deleted post');
        // }
    }
}

export default PostsController