
let searchHistoryArr = [];

const postsUrl = 'https://jsonplaceholder.typicode.com/posts?_limit=10&page=1';

const fetchData = async (url) => {
  const getData = await fetch(url); 
  return getData.json();
}

const autocomplete = async (inp) => {
  let posts = await fetchData(postsUrl);

  let currentFocus;

  inp.addEventListener("input", function(e) {
      let a, b, i, val = this.value;

      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;

      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");

      this.parentNode.appendChild(a);

      posts.forEach(element => {
        if(element.title.substr(0, val.length).toUpperCase() === val.toUpperCase()){
          b = document.createElement("DIV");
          b.innerHTML = "<strong>" + element.title.substr(0, val.length) + "</strong>";
          b.innerHTML += element.title.substr(val.length);
          b.innerHTML += "<input type='hidden' value='" + element.title + "'>";
          b.addEventListener("click", function(e) {
              inp.value = this.getElementsByTagName("input")[0].value;
              searchHistoryArr.push({ 
                value: val,
                time: new Date().toLocaleString(),
              });
              closeAllLists();
              renderSearchHistory(searchHistoryArr);
          });
          a.appendChild(b);
        }
      });
  });

  let buttonClearAll = document.getElementById('clear-history');

  buttonClearAll.addEventListener( 'click', (e) => {
    searchHistoryArr = [];
    renderSearchHistory(searchHistoryArr);
  })

  inp.addEventListener("keydown", function(e) {
      let x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode == 38) { 
        currentFocus--;
        addActive(x);
      } else if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1) {
          if (x) x[currentFocus].click();
        }
      }
  });

  const addActive = (x) => {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }
  const removeActive = (x) => {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  const closeAllLists = (elmnt) => {
    let x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", (e) => {
      closeAllLists(e.target);
  });
}
const renderSearchHistory = (historyArr) => {
  let historyList = document.getElementById('history-list');
  historyList.innerHTML = ``;

  historyArr.forEach((history, index) => {
    
    historyBlock = document.createElement("DIV");
    historyBlock.setAttribute("id", index + "history-block");
    historyBlock.setAttribute("class", "history-block");

    historyBlock.innerHTML = `<p>${history.value}</p>`

    historyBlock.innerHTML += `
      <div class='right-side' id='side-${index}'>
        <span>${history.time}</span>
      </div>
    `; 
    historyList.appendChild(historyBlock);
    let side = document.getElementById(`side-${index}`);

    let removeButton = document.createElement('button');
    removeButton.setAttribute("class", "history-list-button-remove");
    removeButton.innerHTML = 'X';
    removeButton.addEventListener("click", (e) => {
      historyArr.splice(index, 1);
      renderSearchHistory(historyArr);
    });
    side.appendChild(removeButton);

    historyList.appendChild(historyBlock);
  });
}

autocomplete(document.getElementById("myInput"));
