function main() {
    document.addEventListener('DOMContentLoaded', function(){
        fetchquotes()
        formListener()
        quoteListener()

    })
}

function fetchquotes() {
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(resp => resp.json())
    // .then(quotes => console.log(quotes))
    .then(quotes => renderQuotes(quotes))
}

function renderQuotes(quotes) {
    quotes.forEach(printQuote)
}

function printQuote(quote) {
    // grab unordered list 
    // create new list element and set attributes
    // append li to ul
    const quoteList = document.getElementById('quote-list')
    const newQuote = document.createElement('li')
    newQuote.className = 'quote-card'
    newQuote.innerHTML = `<blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success' data-id= ${quote.id}>Likes: <span>${quote.likes.length}</span></button>
    <button class='btn-danger' data-id= ${quote.id}>Delete</button>
  </blockquote>`

  quoteList.appendChild(newQuote)

}


function grabFormData() {
    quote = document.getElementById('new-quote').value 
    author = document.getElementById('author').value
    return {quote, author}
}

function createQuote(quoteData) {
    const configObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(quoteData)
    }
    fetch('http://localhost:3000/quotes', configObj)
    .then(resp => resp.json())
    .then(quote => printQuote(quote))
    
}


function deleteQuote(id) {
    fetch(`http://localhost:3000/quotes/${id}`, {method: 'Delete'})
    .then(resp => resp.json())
    .then(data => console.log(data))
}

function createLike(id) {
    const configObj = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({quoteId: id})
    }

    fetch('http://localhost:3000/likes', configObj)
    .then(resp => resp.json())
    .then(like => console.log(like))
}

// ****Event Listeners***

function formListener() {
    quoteForm = document.getElementById('new-quote-form')
    quoteForm.addEventListener('click', (event) => {
        event.preventDefault()
        if (event.target.className === "btn btn-primary") {
            let quoteData = grabFormData()
            quoteForm.reset()
            createQuote(quoteData)
        }

    })
}

function quoteListener() {
    const quoteList = document.querySelector('#quote-list')
    quoteList.addEventListener('click', (event) => {
        if (event.target.className === 'btn-danger') {
            const parent = event.target.parentNode
            deleteQuote(event.target.dataset.id)
            parent.parentNode.remove()
        }
        if (event.target.className === 'btn-success') {
            const likeNum = parseInt(event.target.firstElementChild.innerHTML)
            createLike(parseInt(event.target.dataset.id))
            event.target.firstElementChild.innerHTML = likeNum+1

        }

    })
}


main()