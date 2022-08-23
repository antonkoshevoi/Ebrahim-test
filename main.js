
let searchHistoryArr = []; // array for fetch data posts

const postsUrl = 'https://jsonplaceholder.typicode.com/posts?_limit=10&page=1';
// url string for fetch

const fetchData = async (url) => { // function for fetching data on fake api
  try {
    const getData = await fetch(url); 
    return getData.json();
  } catch (error) {
    alert(error);
  }
}

const autocomplete = async (inp) => { // autocomplete functionality
  let posts = await fetchData(postsUrl);

  let currentFocus;

  inp.addEventListener("input", function(e) { // create listener for input
      let a, b, i, val = this.value;

      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;

      a = document.createElement("DIV"); // create block dropdown for searching
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");

      this.parentNode.appendChild(a);

      posts.forEach(element => { // looking for a matching entry by title
        if(element.title.substr(0, val.length).toUpperCase() === val.toUpperCase()){
          b = document.createElement("DIV");
          b.innerHTML = "<strong>" + element.title.substr(0, val.length) + "</strong>";
          b.innerHTML += element.title.substr(val.length);
          b.innerHTML += "<input type='hidden' value='" + element.title + "'>";
          b.addEventListener("click", function(e) { // create a listener for the selected item 
              inp.value = '';
              searchHistoryArr.push({ 
                value: element.title,
                time: new Date().toLocaleString(),
              });
              closeAllLists();
              renderSearchHistory(searchHistoryArr);
          });
          a.appendChild(b);
        }
      });
  });

  let buttonClearAll = document.querySelector('.clear-history');

  buttonClearAll.addEventListener( 'click', (e) => { // listener on button for history cleanup 
    searchHistoryArr = []; 
    renderSearchHistory(searchHistoryArr);
  });

  inp.addEventListener("keydown", function(e) {  // function to be able to use the keyboard on the drop-down menu
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

  const addActive = (x) => { // function to highlight the selected item using the keyboard  on the drop-down menu
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
  const closeAllLists = (elmnt) => { // function to colse the drop-down menu
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
const renderSearchHistory = (historyArr) => { // function to render searching history block
  let historyList = document.querySelector('.history-list');
  historyList.innerHTML = ``;

  historyArr.forEach((history, index) => {
    
    historyBlock = document.createElement("DIV"); // create a block to display the data of the selected item
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

    let removeButton = document.createElement('button'); // create button for remove selected history
    removeButton.setAttribute("class", "history-list-button-remove");
    removeButton.innerHTML = 'X';
    removeButton.addEventListener("click", (e) => { // create listener for remove selected history
      historyArr.splice(index, 1);
      renderSearchHistory(historyArr);
    });
    side.appendChild(removeButton);

    historyList.appendChild(historyBlock);
  });
}

autocomplete(document.getElementById("myInput"));
