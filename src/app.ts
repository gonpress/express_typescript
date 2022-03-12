import express from 'express';
import * as bodyParser from "body-parser";
import mongoose from "mongoose";
import morgan from "morgan";

import 'dotenv/config'
import Controller from "./interfaces/controller.interface";

class App {
    public app: express.Application;

    constructor(controllers: Controller[]) {
        this.app = express();

        this.connectToTheDatabase();

        this.initMiddleWares();
        this.initControllers(controllers);
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