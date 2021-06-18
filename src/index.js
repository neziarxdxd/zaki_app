const { router, route,text } = require('bottender/router');
const fetch = require('node-fetch');
const google = require('./google/google');

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

module.exports = async function App(context) {
 
  var number = context.state.number; 
  if(context.state.wiki){
    context.setState({wiki:false})
    await context.sendText(`Here are the things about ${context.event.text}`)
  }
  
  if (number=="1") {
    context.resetState(); 
    context.setState({wiki:true});
    await context.sendText(`Send me what you want to search using wikipedia`);
  }

  else if (number=="2") {  
    context.resetState();  
    await context.sendText(`Send me what you want to search using dictionary`);
  }
  else if (number=="3") { 
    context.resetState();   
    await context.sendText(`Send me your question`);
  }
  else{
    context.resetState();
    context.setState({ number: context.event.text });
    await context.sendText("Choose among the numbers 1,2,3 ?");
  }

  
};
