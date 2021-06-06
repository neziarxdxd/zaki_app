const { router, route,text } = require('bottender/router');
const fetch = require('node-fetch');

async function doSolveThis(context){

  //get the text
  var parseString = context.event.text

  // this will split the string by space 
  var splittedString = parseString.split(" ")

  // removes the forward slash and get the function 
  var command = splittedString[0].substring(1,)

  // this get the whole equation 
  var eq = splittedString.slice(1, splittedString.length )  
  var equation= eq.join(" ");

  // send the Command and Equation 
  await context.sendText("command: "+command)
  await context.sendText("equation: "+equation)
  
    
  // transform the equation to URI
  var encodedUrl = encodeURIComponent(equation)
  
  try {
    // fetch dsds
    var response = await fetch(`https://newton.now.sh/api/v2/${command}/${encodedUrl}`)
    var jsonBlocks = await response.json()
    await context.sendText(`result: ${jsonBlocks.result}`)
  }  
  catch (e) {    
    console.error(e)    
  }
 
}

async function sendHelp(context){
  await context.sendText("Hi kindly choose the some  commands ") 
}

async function wikiPediaSend(context){
  var parseString = context.event.text

  // this will split the string by space 
  var splittedString = parseString.split(" ") 

  // this get the whole equation 
  var eq = splittedString.slice(1, splittedString.length )  
  var searchWord= eq.join(" ");

  try {
    // fetch the data
    var response = await fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&origin=*&formatversion=2&exintro&explaintext&redirects=1&titles=${searchWord}`)
    var jsonBlocks = await response.json()
    var summaryText = jsonBlocks["query"]["pages"][0]["extract"]
    //test
    var firstParagraph = summaryText.split("\n")
    await context.sendText(firstParagraph[0])
  }  
  catch (e) {    
    console.error(e)    
  }
}

async function dictionarySend(context){
  var parseString = context.event.text

  // this will split the string by space 
  var splittedString = parseString.split(" ") 

  // this get the whole equation 
  var eq = splittedString.slice(1, splittedString.length )  
  var searchWord= eq.join(" ");

  try {
    // fetch dsds
    var response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`)
    var jsonBlocks = await response.json();
     var temporaryData = jsonBlocks[0]["meanings"]    
    await context.sendText(temporaryData[0]["definitions"][0]["definition"])
  }  
  catch (e) {    
    console.error(e)    
  }
}


module.exports = async function App(context) {
  return router(
    [     
      text(/^\/simplify[]?\s+/,doSolveThis),  
      text(/^\/factor[]?\s+/,doSolveThis),  
      text(/^\/derive[]?\s+/,doSolveThis),  
      text(/^\/integrate[]?\s+/,doSolveThis),  
      text(/^\/zeroes[]?\s+/,doSolveThis),  
      text(/^\/tangent[]?\s+/,doSolveThis),  
      text(/^\/area[]?\s+/,doSolveThis),  
      text(/^\/cos[]?\s+/,doSolveThis),
      text(/^\/sin[]?\s+/,doSolveThis),
      text(/^\/log[]?\s+/,doSolveThis),  
      text(/^\/wiki[]?\s+/,wikiPediaSend),  
      text(/^\/word[]?\s+/,dictionarySend),  
      route('*',sendHelp)
    ]

  );
};
