const cheerio = require("cheerio");
var request = require("request");
const mongoose = require("mongoose");



mongoose.connect("mongodb://localhost/article");

let models = require("../models/index.js");

function loadArticle(link, cb) {
  request(link, function(error, response, html){
    let $ = cheerio.load(html);
    let document = {};
    document.title = $(".story-intro header h1").text().trim();
  //  console.log(document.title);
    document.body = [];
    $(".story-text p").each(function(i, element){
   //   console.log($(element).text());
      document.body.push($(element).text().trim());
    });
   // console.log(document);
    cb(document);
  });
  
}


request("https://www.politico.com", function(error, response, html){
  if(error){
    return console.log(error);
  }
  let $ = cheerio.load(html);
  let linksArray = [];
  $(".headline a").each(function(i, element){
  //  console.log(typeof element);
    let link = $(element).attr("href");
    if(link.split("/").length>5){
      if(link.split("/")[3]=="story"){
        linksArray.push(link.trim());
      }
    }
  });
  linksArray.forEach(element =>{
    loadArticle(element, function(doc){
      models.article.create(doc)
        .then(function(article){
          console.log(article);
        });
    });
  });
});

