import express, { Response, Request } from 'express';
import root from '../routes/index.routes'
import cookieParser from 'cookie-parser';

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json())
server.use(cookieParser());
server.use('/api', root);

server.get('/', (req: Request, res: Response) => {
    res.redirect('/api');
});

export default server;