import bodyParser from "body-parser";
import cors from "cors";

export default app => {
    app.use(bodyParser.json());
    app.use(cors({
        origin: 'http://localhost:8081',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
}
