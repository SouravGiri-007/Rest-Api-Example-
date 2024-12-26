const  express = require("express")
const users = require('./MOCK_DATA.json')
const app = express();
const port = 1010;
const fs = require("fs");

// Middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json()); // Add this line if you're sending JSON data in the POST request.

app.use((req,res,next) => {
    fs.appendFile(
        "log.txt",
        `${Date.now()}: ${req.method}: ${req.path}\n`,
        (err,data) => {
            next();
        }
    )
});
app.use((req,res,next) => {
    console.log("Hello from middleware 3");
    next();
});
app.use((req,res,next) => {
    console.log("Hello from middleware 2");
     next();
});
//Routes
app.get( "/users",(req,res) =>{
    const html =`
    <ul>
    ${users.map(users => `<li>${users.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html)
})
app.get( "/api/users",(req,res) =>{
    return res.json(users)
})
app.get("/api/users/:id", (req,res) =>{
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user)
});
app.post("/api/users", (req, res) => {
    const body = req.body;
    users.push({...body, id: users.length + 1});
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to save data" });
        }
        return res.json({ status: "success" });
    });
});
app.patch("/api/users/:id", (req,res) =>{
    return res.json({status: "pending"})
})
app.delete("/api/users/:id", (req,res) =>{
    const id = Number(req.params.id);
      // Find the index of the user with the specified id
  const userIndex = users.findIndex((user) => user.id === id);

  // If the user does not exist, return a 404 error
  if (userIndex === -1) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }

  // Remove the user from the array
  const deletedUser = users.splice(userIndex, 1);
  fs.writeFile('./MOCK_DATA.json',JSON.stringify(users,null,2), (err,data) => {
    return res.json({status: "pendingD"});
});
})
app.listen(port, () => console.log(`Server Started at Port no. ${port}`));