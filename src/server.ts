import App from "./app";
import PostsController from "./posts/posts.controller";
import AuthController from "./auth/auth.controller";

const app = new App(
    [
        new PostsController(),
        new AuthController(),
    ]
)

app.listen();