
const mongodb = require("mongodb")
const MongoClient = mongodb.MongoClient ;
const express = require("express")
const Joi = require('joi')
//const mongoose = require("mongoose")
const app = express()

const url = "mongodb://127.0.0.1:27017";
const databs = "Databasezzz"

app.use(express.json());


const courses=[
    {id : 1 ,name :"john"},
    {id : 2 ,name :"steve"},
    {id : 3 ,name :"greg"},
]

MongoClient.connect(url,{ useUnifiedTopology: true },(err,client)=>
{
    if(err)
    {
        console.log("Error Occured");

    }
    const db = client.db(databs)
})


app.get('/',(req,res)=>
{
    res.send(" Hollow World ")
})

//Create
app.post('/api/courses', (req, res) => {
    const {error} = validateCourse(req.body)

    if(error)
    
        return res.status(400).send(error.details[0].message)       //error log
           

    const course =
    {
        id : courses.length + 1,
        name : req.body.name
    };
    courses.push(course);
    res.send(course);
});

//Update
app.put('/api/courses/:id', (req, res) => {

    const course = courses.find(c=> c.id === parseInt(req.params.id));
    if(!course)
    res.status(404).send('The course with given id was not found');
    //object destructuring for error 
const {error} = validateCourse(req.body)
if(error)
{
    res.status(400).send(error.details[0].message)       //error log
    return;
};
//update ppts
course.name = req.body.name;
res.send(course)
});

app.delete('/api/courses/:id', (req, res)=>
{
    //show error if not found
    const course = courses.find(c=> c.id === parseInt(req.params.id));
    if(!course)
    res.status(404).send('The course with given id was not found');

//delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course)
}
);

function validateCourse(course)
{
    const schema = {
        name : Joi.string().min(3).required()
    
    };
    
    return Joi.validate(course, schema);
}

//read

app.get('/api/courses',(req,res)=>
{
    res.send(courses);
})

app.get('/api/courses/:id',(req,res)=>{
    const course = courses.find(c=> c.id === parseInt(req.params.id));
    if(!course)
    res.status(404).send('The course with given id was not found');
    
    res.send(course)
})



const port=process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


