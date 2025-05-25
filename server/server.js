//import dependencies
import express from "express"; //web framework to build API and handle routes (build server)
import cors from "cors"; //middleware to allow client to communicate with backend even with different port num 

//import routes (where incoming API reuqests for each path will be handled)
import adminAuth from "./routes/libAuth.js";
import bookManagement from "./routes/book.js";
//import vendors from "./routes/vendor.js";

//set up server port and express framework
const PORT = process.env.PORT || 5050;
const app = express(); //to handle requests

//app.use function is a middleware that gets executed for every incoming request
app.use(cors()); //enables cors to support the express app
app.use(express.json()); //parses incoming request to JSON format

app.use("/libAuth", adminAuth);
app.use("/book", bookManagement);
//app.use("/vendors", vendors);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
