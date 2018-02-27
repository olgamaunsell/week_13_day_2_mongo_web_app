const QuoteView = require('./views/quoteView');
const Request = require('./services/request.js');

const quoteView = new QuoteView();
const request = new Request('http://localhost:3000/api/quotes');

const createButtonClicked = function(event) {
  event.preventDefault();
  console.log('form submit clicked');

  const nameInputValue = document.querySelector('#name').value;
  const quoteInputValue = document.querySelector('#quote').value;

  const quoteToSend = {
    name: nameInputValue,
    quote: quoteInputValue
  }

  request.post(createRequestComplete, quoteToSend);
}

const deleteRequestComplete = function() {
  quoteView.clear();
}

const deleteButtonClicked = function() {
  request.delete(deleteRequestComplete);
}

const appStart = function(){
  request.get(getQuotesRequestComplete);

  const createQuoteButton = document.querySelector('#submit-quote');
  const deleteButton = document.querySelector('#deleteButton');

  createQuoteButton.addEventListener('click', createButtonClicked);
  deleteButton.addEventListener('click', deleteButtonClicked );

}

const getQuotesRequestComplete = function(allQuotes){
  allQuotes.forEach(function(quote){
    quoteView.addQuote(quote);
  });

}

const createRequestComplete = function(newQuote) {
  console.log(newQuote);
  quoteView.addQuote(newQuote);
}

document.addEventListener('DOMContentLoaded', appStart);
