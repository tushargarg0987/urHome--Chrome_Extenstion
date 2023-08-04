const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const time = document.getElementById('time');
const day = document.getElementById('day');
const quote = document.getElementById('quote');
const author = document.getElementById('author');

const defaultPopulars = [
  {title: "Amazon", url: "https://www.amazon.com/"},
  {title: "Instagram", url: "https://www.instagram.com/"},
  {title: "Facebook", url: "https://www.facebook.com/"},
  {title: "Twitter", url: "https://twitter.com/"},
  {title: "Netflix", url: "https://www.netflix.com/"},
  {title: "Youtube", url: "https://www.youtube.com/"},
  {title: "Whatsapp", url: "https://web.whatsapp.com/"},
  {title: "Wikipedia", url: "https://www.wikipedia.org/"},
  {title: "Grammarly", url: "https://www.grammarly.com/"},
  {title: "Reddit", url: "https://www.reddit.com/"},
  {title: "Pinterest", url: "https://www.pinterest.com/"},
  {title: "Canva", url: "https://www.canva.com/"},
  {title: "Quora", url: "https://www.quora.com/"},
]

const defaultEntertainment = [
  {title: "Instagram", url: "https://www.instagram.com/"},
  {title: "Facebook", url: "https://www.facebook.com/"},
  {title: "Twitter", url: "https://twitter.com/"},
  {title: "Netflix", url: "https://www.netflix.com/"},
  {title: "Prime", url: "https://www.primevideo.com/"},
  {title: "Hotstar", url: "https://www.hotstar.com/"},
  {title: "Youtube", url: "https://www.youtube.com/"},
  {title: "Reddit", url: "https://www.reddit.com/"},
  {title: "Pinterest", url: "https://www.pinterest.com/"},
]

const defaultDeveloper = [
  {title: "Github", url: "https://github.com/"},
  {title: "Stackoverflow", url: "https://stackoverflow.com/"},
  {title: "W3Schools", url: "https://www.w3schools.com/"},
  {title: "MDN Docs", url: "https://developer.mozilla.org/"},
  {title: "GFG", url: "https://www.geeksforgeeks.org/"},
  {title: "Programiz", url: "https://www.programiz.com/c-programming/online-compiler/"},
  {title: "https://www.youtube.com/", url: "Youtube"},
  {title: "https://www.reddit.com/", url: "Reddit"},
]

var first_run = false;
if (!localStorage['ran_before']) {
  first_run = true;
  localStorage['ran_before'] = '1';
}
if (first_run) {
  chrome.bookmarks.getTree((result) => {
    // const categoryList = [];
    //console.log(result[0].id);
    for (let ele in result[0].children) {
      if (result[0].children[ele].title === "Other bookmarks") {
        localStorage['other_bookmarks_index'] = ele;
        //console.log(result[0].children[0].children[ele]);
        const List = [];
        for (let element in result[0].children[ele].children) {
          if (result[0].children[ele].children[element].dateGroupModified) {
            List.push(result[0].children[ele].children[element].title)
          }
        }
        if (!List.includes("urHome Bookmarks")) {
          chrome.bookmarks.create(
            { 'parentId': result[0].children[ele].id, 'title': 'urHome Bookmarks' },
            function (newFolder) {
              chrome.bookmarks.getTree((getBookmarks) => {
                const books = getBookmarks[0].children[0].children;
                for (let ele2 in books) {
                  if (!books[ele].dateGroupModified) {
                    chrome.bookmarks.move(
                      books[ele2].id,
                      { parentId: newFolder.id, index: 0 }
                    )
                  }
                }
              })
            },
          )
        }
        if (!List.includes("Popular")) {
          chrome.bookmarks.create(
            { 'parentId': result[0].children[ele].id, 'title': 'Popular' },
            function (newFolder) {
              for (let pop in defaultPopulars) {
                chrome.bookmarks.create({
                  'parentId': newFolder.id,
                  'title': defaultPopulars[pop].title,
                  'url': defaultPopulars[pop].url,
                });
              }
            },
          )
        }
        if (!List.includes("Entertainment")) {
          chrome.bookmarks.create(
            { 'parentId': result[0].children[ele].id, 'title': 'Entertainment' },
            function (newFolder) {
              for (let pop in defaultEntertainment) {
                chrome.bookmarks.create({
                  'parentId': newFolder.id,
                  'title': defaultEntertainment[pop].title,
                  'url': defaultEntertainment[pop].url,
                });
              }
            },
          )
        }
        if (!List.includes("Developer")) {
          chrome.bookmarks.create(
            { 'parentId': result[0].children[ele].id, 'title': 'Developer' },
            function (newFolder) {
              for (let pop in defaultDeveloper) {
                chrome.bookmarks.create({
                  'parentId': newFolder.id,
                  'title': defaultDeveloper[pop].title,
                  'url': defaultDeveloper[pop].url,
                });
              }
            },
          )
        }
      }
    }
  })
  window.location.reload()
}

const getQuote = () => {
  fetch('https://zenquotes.io/api/random/quotes')
    .then(res => res.json())
    .then(data => {
      quote.innerHTML = `"${data[0].q}"`;
      author.innerHTML = `~<i>${data[0].a}</i>`;
    })
}

function removeBookmark(id) {
  document.getElementById(id).remove();
  chrome.bookmarks.remove(id, function () {
    console.log("Removed");
  }
  )
}

const getBookmarks = () => {
  chrome.bookmarks.getTree((getBookmarks) => {
    const books = getBookmarks[0].children[localStorage['other_bookmarks_index']].children;
    for (let ele in books) {
      if (books[ele].title === "urHome Bookmarks") {
        const toMarked = document.getElementById("bookmarks");
        for (let element in books[ele].children) {
          const old = toMarked.innerHTML;
          var addTitle = "";
          if (books[ele].children[element].title.length > 14) {
            addTitle = books[ele].children[element].title.slice(0, 14) + "...";
          }
          else {
            addTitle = books[ele].children[element].title;
          }
          const toAdd = `<div id=${books[ele].children[element].id} class="bookmark-container"><a href="${books[ele].children[element].url}" class="bookmark"><img class="bookmark-img" src=${faviconURL(books[ele].children[element].url)}></img><p>${addTitle}</p></a><img class="bookmark-cross" src=assets/cross-icon.png></img></div>`
          toMarked.innerHTML = old + toAdd;
        }
        const old2 = toMarked.innerHTML;
        toMarked.innerHTML = old2 + `<img title="Add Bookmark" class="bookmark-img" id="to-add-btn" style="border-radius: 50%;background-color: white;margin: 12px 23px;cursor: pointer;" src=https://img.icons8.com/?size=512&id=24717&format=png></img>`;
        document.getElementById('to-add-btn').addEventListener('click', () => {
          document.getElementsByClassName('add-bookmark-input')[0].classList.remove('hide')
        })
      }
      if (books[ele].title === "Popular") {
        const toMarked = document.getElementById("popular");
        toMarked.innerHTML = "";
        for (let element in books[ele].children) {
          const old = toMarked.innerHTML;
          var addTitle = "";
          if (books[ele].children[element].title.length > 14) {
            addTitle = books[ele].children[element].title.slice(0, 14) + "...";
          }
          else {
            addTitle = books[ele].children[element].title;
          }
          const toAdd = `<div id=${books[ele].children[element].id} class="bookmark-container"><a href="${books[ele].children[element].url}" class="bookmark"><img class="bookmark-img" src=${faviconURL(books[ele].children[element].url)}></img><p>${addTitle}</p></a><img class="bookmark-cross" src=assets/cross-icon.png></img></div>`
          toMarked.innerHTML = old + toAdd;
        }
        const old2 = toMarked.innerHTML;
        toMarked.innerHTML = old2 + `<img title="Add Bookmark" class="bookmark-img" id="to-add-btn" style="border-radius: 50%;background-color: white;margin: 12px 23px;cursor: pointer;" src=https://img.icons8.com/?size=512&id=24717&format=png></img>`;
        document.getElementById('to-add-btn').addEventListener('click', () => {
          document.getElementsByClassName('add-bookmark-input')[0].classList.remove('hide')
        })
      }
      if (books[ele].title === "Entertainment") {
        const toMarked = document.getElementById("leisure");
        toMarked.innerHTML = "";
        for (let element in books[ele].children) {
          const old = toMarked.innerHTML;
          var addTitle = "";
          if (books[ele].children[element].title.length > 14) {
            addTitle = books[ele].children[element].title.slice(0, 14) + "...";
          }
          else {
            addTitle = books[ele].children[element].title;
          }
          const toAdd = `<div id=${books[ele].children[element].id} class="bookmark-container"><a href="${books[ele].children[element].url}" class="bookmark"><img class="bookmark-img" src=${faviconURL(books[ele].children[element].url)}></img><p>${addTitle}</p></a><img class="bookmark-cross" src=assets/cross-icon.png></img></div>`
          toMarked.innerHTML = old + toAdd;
        }
        const old2 = toMarked.innerHTML;
        toMarked.innerHTML = old2 + `<img title="Add Bookmark" class="bookmark-img" id="to-add-btn" style="border-radius: 50%;background-color: white;margin: 12px 23px;cursor: pointer;" src=https://img.icons8.com/?size=512&id=24717&format=png></img>`;
        document.getElementById('to-add-btn').addEventListener('click', () => {
          document.getElementsByClassName('add-bookmark-input')[0].classList.remove('hide')
        })
      }
      if (books[ele].title === "Developer") {
        const toMarked = document.getElementById("developer");
        toMarked.innerHTML = "";
        for (let element in books[ele].children) {
          const old = toMarked.innerHTML;
          var addTitle = "";
          if (books[ele].children[element].title.length > 14) {
            addTitle = books[ele].children[element].title.slice(0, 14) + "...";
          }
          else {
            addTitle = books[ele].children[element].title;
          }
          const toAdd = `<div id=${books[ele].children[element].id} class="bookmark-container"><a href="${books[ele].children[element].url}" class="bookmark"><img class="bookmark-img" src=${faviconURL(books[ele].children[element].url)}></img><p>${addTitle}</p></a><img class="bookmark-cross" src=assets/cross-icon.png></img></div>`
          toMarked.innerHTML = old + toAdd;
        }
        const old2 = toMarked.innerHTML;
        toMarked.innerHTML = old2 + `<img title="Add Bookmark" class="bookmark-img" id="to-add-btn" style="border-radius: 50%;background-color: white;margin: 12px 23px;cursor: pointer;" src=https://img.icons8.com/?size=512&id=24717&format=png></img>`;
        document.getElementById('to-add-btn').addEventListener('click', () => {
          document.getElementsByClassName('add-bookmark-input')[0].classList.remove('hide')
        })
      }
    }
  })
  document.addEventListener("DOMContentLoaded", function (e) {
    const crosses = Array.from(document.getElementsByClassName('bookmark-cross'));
    crosses.forEach(element => {
      element.addEventListener('click', () => {
        removeBookmark(element.parentNode.id)
      })
    });
  })
}

function faviconURL(u) {
  const url = new URL(chrome.runtime.getURL("/_favicon/"));
  url.searchParams.set("pageUrl", u);
  url.searchParams.set("size", "32");
  return url.toString();
}

const addBookmark = () => {
  var parentId;
  const folderName = document.getElementById('input-folder').value;
  console.log(folderName);
  chrome.bookmarks.getTree((result) => {
    console.log(result[0].children);
    // const categoryList = [];
    console.log(result[0].id);
    if (folderName === "urHomeBookmarks") {
      for (let ele in result[0].children[localStorage['other_bookmarks_index']].children) {
        console.log(result[0].children[localStorage['other_bookmarks_index']].children[ele]);
        if (result[0].children[localStorage['other_bookmarks_index']].children[ele].title === "urHome Bookmarks") {
          parentId = result[0].children[localStorage['other_bookmarks_index']].children[ele].id
        }
      }
    } else {
      for (let ele in result[0].children[localStorage['other_bookmarks_index']].children) {
        console.log(result[0].children[localStorage['other_bookmarks_index']].children[ele]);
        if (result[0].children[localStorage['other_bookmarks_index']].children[ele].title === folderName) {
          parentId = result[0].children[localStorage['other_bookmarks_index']].children[ele].id
        }
      }
    }

    chrome.bookmarks.create({
      'parentId': parentId,
      'title': document.getElementById('input-title').value,
      'url': document.getElementById('input-url').value,
    });
  })
  window.location.reload();
}

const checkOver = (ele) => {
  const { clientWidth, clientHeight, scrollWidth, scrollHeight } = ele;
  if (scrollHeight > clientHeight || scrollWidth > clientWidth) {
    ele.classList.remove('noScroll');
    ele.classList.add('scroll');
  }
  else {
    ele.classList.add('noScroll');
  }
}


window.addEventListener('resize', () => {
  const sets = document.querySelector(".set:not(.hide)")
  checkOver(sets);
});


document.getElementById('cancel-btn').addEventListener('click', () => {
  document.getElementsByClassName('add-bookmark-input')[0].classList.add('hide')
})
document.getElementById('add-btn').addEventListener('click', () => {
  document.getElementsByClassName('add-bookmark-input')[0].classList.add('hide')
  addBookmark();
})



document.getElementById('1').addEventListener('click', () => {
  const headings = document.getElementsByTagName('h4');
  for (ele in headings) {
    if (headings[ele].classList) {
      headings[ele].classList.remove('selected');
    }
  }
  headings[0].classList.add('selected');
  const sets = document.getElementsByClassName('set');
  for (ele in sets) {
    if (sets[ele].classList) {
      sets[ele].classList.add('hide');
    }
  }
  sets[0].classList.remove('hide');
  checkOver(sets[0]);
})


document.getElementById('2').addEventListener('click', () => {
  const headings = document.getElementsByTagName('h4');
  for (ele in headings) {
    if (headings[ele].classList) {
      headings[ele].classList.remove('selected');
    }
  }
  headings[1].classList.add('selected');
  const sets = document.getElementsByClassName('set');
  for (ele in sets) {
    if (sets[ele].classList) {
      sets[ele].classList.add('hide');
    }
  }
  sets[1].classList.remove('hide');
  checkOver(sets[1]);
})


document.getElementById('3').addEventListener('click', () => {
  const headings = document.getElementsByTagName('h4');
  for (ele in headings) {
    if (headings[ele].classList) {
      headings[ele].classList.remove('selected');
    }
  }
  headings[2].classList.add('selected');
  const sets = document.getElementsByClassName('set');
  for (ele in sets) {
    if (sets[ele].classList) {
      sets[ele].classList.add('hide');
    }
  }
  sets[2].classList.remove('hide');
  checkOver(sets[2]);
})


document.getElementById('4').addEventListener('click', () => {
  const headings = document.getElementsByTagName('h4');
  for (ele in headings) {
    if (headings[ele].classList) {
      headings[ele].classList.remove('selected');
    }
  }
  headings[3].classList.add('selected');
  const sets = document.getElementsByClassName('set');
  for (ele in sets) {
    if (sets[ele].classList) {
      sets[ele].classList.add('hide');
    }
  }
  sets[3].classList.remove('hide');
  checkOver(sets[3]);
})

document.getElementById("getBooks").addEventListener('click', () => {
  chrome.tabs.create({ url: 'chrome://bookmarks/' });
})

document.getElementById("getHistory").addEventListener('click', () => {
  chrome.tabs.create({ url: 'chrome://history/' });
})

document.getElementById("getDownloads").addEventListener('click', () => {
  chrome.tabs.create({ url: 'chrome://downloads/' });
})

document.getElementById("getExt").addEventListener('click', () => {
  chrome.tabs.create({ url: 'chrome://extensions/' });
})

document.getElementById("getSet").addEventListener('click', () => {
  chrome.tabs.create({ url: 'chrome://settings/' });
});

document.getElementById("inputBar").addEventListener('keyup', (e) => {
  // console.log(e.key);
  if (e.key == "Enter") {
    var key = document.getElementById('inputBar').value;
    key = key.replace(/ /g, "+");
    console.log(key);
    location.href = `https://www.google.com/search?q=${key}`;
  }
})

getQuote();

getBookmarks();

window.onload = () => { checkOver(document.getElementsByClassName('set')[0]); }


function findLocation() {

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const geolocation = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    fetch(geolocation)
      .then(res => res.json())
      .then(data => {
        const city = data.locality;
        document.getElementById("status").innerHTML = city;
      })
    const weather = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=auto&current_weather=true`
    fetch(weather)
      .then(res => res.json())
      .then(data => {
        const code = data.current_weather.weathercode;
        const d = new Date(data.current_weather.time);
        let hour = d.getHours();
        if (code == 0 || code == 1) {
          if (hour < 5 || hour > 20) {
            document.getElementById("myImg").src = "./assets/sunny_moon.png";
          }
          else {
            document.getElementById("myImg").src = "./assets/sunny_day.png";
          }

        }
        else if (code == 2) {
          document.getElementById("myImg").src = "./assets/partly-cloudy.png";
        }
        else if (code == 3) {
          document.getElementById("myImg").src = "./assets/full-cloudy.png";

        }
        else if (code == 45 || code == 48) {
          document.getElementById("myImg").src = "./assets/fog.png";

        }
        else if (code == 51 || code == 53 || code == 55 || code == 56 || code == 57 || code == 61 || code == 63 || code == 80 || code == 81 || code == 65 || code == 82) {
          document.getElementById("myImg").src = "./assets/rain.png";

        }
        else if (code == 95 || code == 96 || code == 99) {
          document.getElementById("myImg").src = "./assets/thunderstorm.png";
        }
        else if (code == 71 || code == 73 || code == 75 || code == 85 || code == 86 || code == 77) {
          document.getElementById("myImg").src = "./assets/snow.png";
        }
        document.getElementById("temp").innerHTML = "Temperature - " + String(data.current_weather.temperature) + " °C";
        document.getElementById("wind").innerHTML = "Wind Speed - " + String(data.current_weather.windspeed) + " km/h";
      })
  }

  const error = (err) => {
    console.log(err);
  }
  navigator.geolocation.getCurrentPosition(success, error);
}


findLocation();




const timeUpdate = () => {
  const d = new Date();
  const hrs = d.getHours()
  const mins = d.getMinutes();
  if (hrs < 10 && mins < 10) {
    time.innerHTML = "0" + d.getHours() + " : 0" + d.getMinutes();
  }
  else if (hrs < 10) {
    time.innerHTML = "0" + d.getHours() + " : " + d.getMinutes();
  }
  else if (mins < 10) {
    time.innerHTML = d.getHours() + " : 0" + d.getMinutes();
  }
  else {
    time.innerHTML = d.getHours() + " : " + d.getMinutes();
  }
  day.innerHTML = weekday[d.getUTCDay()] + ', ' + month[d.getMonth()] + ' ' + d.getUTCDate();
}
timeUpdate();
setInterval(timeUpdate, 1000);
