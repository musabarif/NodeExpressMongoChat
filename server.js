var express=require('express')
var bodyParser =require('body-parser')
var app=express()

var http=require('http').Server(app)
var io=require('socket.io')(http)
var mongoose=require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

var dburl='mongodb://user:Password1@ds223653.mlab.com:23653/learning-node'

var MessageModel=mongoose.model('Message',{
    Name:String,
    Message:String
})


app.get('/messages',(req,res)=>{
    MessageModel.find({},(err,data)=>{
        res.send(data)
    })
    
})

app.post('/messages',(req,res)=>{
    var message=new MessageModel(req.body)

    message.save((err)=>{
        if(err)
            sendStatus(500)

        io.emit('message',req.body)
         res.sendStatus(200);
            
    })

    
})


io.on('connection',(socket)=>{
    console.log('a user connected');
})

mongoose.connect(dburl,{useNewUrlParser:true},(error)=>{
    console.log('mongo db connected',error)
})

var server=http.listen(3000,()=>{
    console.log('server is running on port',server.address().port)
})