function main(){
  document.addEventListener('DOMContentLoaded', function(){
    createSortButton()
    fetchQuotes()
    addQuote()
  })
}

function fetchQuotes(){
  fetch(`http://localhost:3000/quotes?_embed=likes`)
  .then(resp => resp.json())
  .then(quotes => {
    addSortButtonListener(quotes)
    renderQuotes(quotes)
  })

}

function renderQuotes(quotes){
  quotes.forEach(quote => renderQuote(quote))
}

function createSortButton(){
  const main = document.getElementById('main')
  main.insertAdjacentHTML('afterbegin', `<button id="sort">Sort</button>`)
}

function addSortButtonListener(quotes){
  const quoteList = document.getElementById('quote-list')
  const sortButton = document.getElementById('sort')
  sortButton.addEventListener('click', function(){
    if (sortButton.innerText === 'Sort'){
      sortButton.innerText = 'Unsort'
      quoteList.innerHTML = ""
      renderQuotes(sortQuotes(quotes))
    }
    else if (sortButton.innerText === 'Unsort') {
      sortButton.innerText = 'Sort'
      quoteList.innerHTML = ""
      renderQuotes(quotes)
    }
  })
}

function compareQuotes(a, b){
  const quoteA = a.author.toUpperCase()
  const quoteB = b.author.toUpperCase()
  
  let comparison = 0
  if (quoteA > quoteB){
    comparison = 1
  }
  else if (quoteA < quoteB){
    comparison = -1
  }
  return comparison
}

function sortQuotes(quotes){
  return [...quotes].sort(compareQuotes)
}

function renderQuote(quote){
  const ulElement = document.querySelector('#quote-list')
  ulElement.insertAdjacentHTML('beforeend', `<li id='${quote.id}' class='quote-card'>
  <blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button id='like-${quote.id}' class='btn-success'>Likes: <span id="likes-${quote.id}">${quote.likes.length}</span></button>
    <button id='delete-${quote.id}'class='btn-danger'>Delete</button>
  </blockquote>
  </li>`)

  const likeBtn = document.querySelector(`#like-${quote.id}`)
  likeBtn.addEventListener('click', function(){
    updateLikes(quote)
  })
  
  const deleteBtn = document.querySelector(`#delete-${quote.id}`)
  deleteBtn.addEventListener('click', function(){
    deleteQuote(quote)
  })
}

function deleteQuote(quote){
  quoteCard.remove()
  const quoteCard = document.getElementById(`${quote.id}`)
  fetch(`http://localhost:3000/quotes/${quote.id}`, {method: 'DELETE'})
}


function updateLikes(quote){
  const likes = document.getElementById(`likes-${quote.id}`)
  likes.innerText++
  const reqObj = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'quoteId': quote.id,
      'createdAt': Date.now()
    })
  }
  fetch('http://localhost:3000/likes', reqObj)
  .then(resp => resp.json())
  .then(updateQuoteLikes(quote.id))
}

function updateQuoteLikes(quoteId){
  fetch(`http://localhost:3000/quotes/${quoteId}?_embed=likes`)
  .then(resp => resp.json())
  .then(quote => {
    const likeBtn = document.querySelector(`#like-${quote.id}`)
    likeBtn.children[0].innerHTML = quote.likes.length
  })
}

function addQuote() {
  const quoteForm = document.querySelector('#new-quote-form')
  quoteForm.addEventListener('submit', function(){
    event.preventDefault()
    postQuote()
  })
}

function postQuote(){
  const quote = document.querySelector('#new-quote').value
  const author = document.querySelector('#author').value
  reqObj = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'quote': quote,
      'author': author,
      'likes': []
    })
  }
  fetch('http://localhost:3000/quotes?_embed=likes', reqObj)
  .then(resp => resp.json())
  .then(quote => renderQuote(quote))
}

main()
