import * as express from 'express';
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as morgan from "morgan";

import 'dotenv/config'
import Controller from "./interfaces/controller.interface";

import errorMiddleware from "./middleware/error.middleware";

class App {
    public app: express.Application;

    constructor(controllers: Controller[]) {
        this.app = express();

        this.connectToTheDatabase();

        this.initMiddleWares();
        this.initControllers(controllers);
        this.initErrorHandling();
    }

    private initMiddleWares(){
        this.app.use(morgan('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended:true}));
    }

    private initControllers(controllers: Controller[]){
        controllers.forEach((controller: Controller) => {
            this.app.use('/', controller.router);
        })
    }

    private initErrorHandling(){
        this.app.use(errorMiddleware);
    }

    public listen(){
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        });
    }

    private connectToTheDatabase(){
        mongoose.connect(`${process.env.MONGODB_URL}`);
    }
}

export default App;