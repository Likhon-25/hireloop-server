import express from 'express';
import cors from 'cors'
const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json())
app.use(cors())

app.get("/", (req, res) =>{
    res.send("Hireloop is running")
})

app.listen(PORT, ()=>{
    console.log(`Example app listening on port ${PORT}`);
})