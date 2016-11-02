var express = require('express');
var morgan = require('morgan');
var path = require('path');
var pool=require('pg').pool;

var config = {
  host: 'db.imad.hasura-app.io',
  user: 'priyanka178',
  password:process.env.DB_PASSWORD,
  database: 'priyanka178',
  port:'5432'
};
var app = express();
app.use(morgan('combined'));


var articals={
    'article_one': {
        title:'article_one|priyanka verma',
        heading :'article_one',
        date:'1 nov 2016',
        content:`
        <p>
        hii i am priyanka
        </p> `
    },
    'article_two': {
        title:'article_two|priyanka verma',
        heading :'article_two',
        date:'1 nov 2016',
        content:`
        <p>
        hii i am priyanka
        </p> `
    },
    'article_three': {
        title:'article_three|priyanka verma',
        heading :'article_three',
        date:'1 nov 2016',
        content:`
        <p>
        hii i am priyanka
        </p> `
    }
};
function createTemplate(data){
    var title=data.title;
    var date=data.date;
    var heading=data.heading;
    var content=data.content;
var htmltemplate=`
<html>
    <head>
        <title>
            ${title}
        </title>
        <meta name="viewport" content="width=device-width,initial_scale=1"/>
        <style>
            .container{
               max-width: 800px;
    margin: 0 auto;
    color: #8c8585;
    font-family: sans-sarif;
    padding-top: 30px;
    padding-left: 20px;
    padding-right: 20px;

            }
        </style>
    </head>
    <body>
        <div class="container">
        <div>
            <a href="/">home</a>
            
            </div>
            <hr/>
            <h3>
                ${heading}
            </h3>
            <div>
                ${date.toDateString()}
            </div>
            <div>
               ${content}
            </div>
            </div>
    </body>


</html>

`;
return htmltemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
var pool=new pool(config);
app.get('/test_db',function(req,res){
    pool.query('select * from test',function(err,result){
       if(err){
           res.status(500).send(err.toString());
       } else
       {
           res.send(JSON.stringify(result.rows));
       }
    });
});

var counter=0;
app.get('/counter',function(req,res){
    counter=counter+1;
    res.send(counter.tostring());
});



app.get('/articles/:articlename',function(req,res){
    
    pool.query("select * from articlee where title='"+req.params.articlename+"'",function(err,result){
      if(err){
           res.status(500).send(err.toString());
       } else
       {
           if(res.rows.length===0)
           {
                res.status(404).send('article not found');
           }else
           {
               var articleData=result.rows[0];
               res.send(createTemplate(articleData));
           }
       }   
    });
    });


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
