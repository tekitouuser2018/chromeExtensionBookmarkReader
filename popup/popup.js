let bookmarks = [];
let currentIndex = 0;
let ok=false;
let copyBookmarks = [];
let currentFolder = '';
let dataList = [];

window.onload = getStoreData();

document.getElementById('searchButton').addEventListener('click', function (action) {
    console.log('-----search button clicked----------' );
    let searchWords = document.getElementById("searchWords").value;
    if (searchWords === null || searchWords === '') {
        getAllBookmark();
       
    } else {
        getSpecificBookmark(searchWords);
    }

})

document.getElementById('searchWords').addEventListener('keyup', function (event) {
    if (event.key === "Enter") {
        let searchWords = document.getElementById("searchWords").value;
        if (searchWords === null || searchWords === '') {
            getAllBookmark();
        } else {
            getSpecificBookmark(searchWords);
        }
    }
    

})


function getAllBookmark() {

    chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
        bookmarks = [...response.res[0].children];
        currentIndex = 0;

        document.getElementById("searchErrorMessage").style.visibility = "hidden";
        chnageDisplayBookmarks(true);

        storeAllJSONData();
    });
    
};


function getSpecificBookmark(searchWords) {
    chrome.runtime.sendMessage({ greeting: "search", words: searchWords }, function (response) {
        bookmarks = [...response.res];
        ok = response.ok;
        copyBookmarks = [...bookmarks];
        searchFolder(bookmarks, searchWords);
        bookmarks = [];
        copyBookmarks.forEach(elem => {
            bookmarks.push(elem);
        });
        if (ok) {
            document.getElementById("searchErrorMessage").style.visibility = "hidden";
            chnageDisplayBookmarks(true);
        } else {
            document.getElementById("searchErrorMessage").style.visibility = "visible";
        }

        storeAllJSONData();

    });
   
};

function searchFolder(bb, words) {
    bb.forEach(bookmark => {
        if (bookmark.children) {
            if (bookmark.title === words) {
                    copyBookmarks = [...bookmark.children];

                    currentIndex = 0;
                    ok = true;
                    return;
                } else {
                    searchFolder(bookmark.children,words);
                }

        }
    });
}

document.getElementById('contents').addEventListener('wheel', function (action) {
    if (currentIndex < 0) {
        currentIndex = 0;
    }
    if (currentIndex >= bookmarks.length) {
        currentIndex = bookmarks.length - 1;
    }

    if (event.deltaY < 0) {
        if (currentIndex <= 0) {
            return;
        }
        currentIndex--;
    }else if (event.deltaY > 0) {
        if (currentIndex >= bookmarks.length - 1) {
            return;
        }
        currentIndex++;
    }

    chnageDisplayBookmarks(true);

})
////change list display function
function chnageDisplayBookmarks(reload) {
    if (currentIndex < 0) {
        currentIndex = 0;
    }
    if (currentIndex >= bookmarks.length) {
        currentIndex = bookmarks.length - 1;
    }

    var cp = [...bookmarks];
    ////first bookmark
    if (currentIndex - 1 < 0) {
        targetList = document.getElementById('cont_bookmark_list1');
        targetList.innerText = '';
    } else {
        var targetList = document.getElementById('cont_bookmark_list1');
        targetList.innerText = bookmarks[currentIndex - 1].title;
    }
    ////second bookmark
    if (currentIndex >= bookmarks.length) {
        targetList = document.getElementById('cont_bookmark_list2');
        targetList.innerText = '';
    } else {
        targetList = document.getElementById('cont_bookmark_list2');
        targetList.innerText = bookmarks[currentIndex].title;

        if (reload) {
            chrome.runtime.sendMessage({ greeting: "print", bookmarks: cp, currentIndex: currentIndex }, function (response) {
            });
        }
        
    }
    ////third bookmark
    if (currentIndex+1 >= bookmarks.length) {
        targetList = document.getElementById('cont_bookmark_list3');
        targetList.innerText = '';
    } else {
        targetList = document.getElementById('cont_bookmark_list3');
        targetList.innerText = bookmarks[currentIndex+1].title;
    }
    ////forth bookmark
    if (currentIndex+2 >= bookmarks.length) {
        targetList = document.getElementById('cont_bookmark_list4');
        targetList.innerText = '';
    } else {
        targetList = document.getElementById('cont_bookmark_list4');
        targetList.innerText = bookmarks[currentIndex+2].title;
    }
    ////fifth bookmark
    if (currentIndex+3 >= bookmarks.length) {
        targetList = document.getElementById('cont_bookmark_list5');
        targetList.innerText = '';
    } else {
        targetList = document.getElementById('cont_bookmark_list5');
        targetList.innerText = bookmarks[currentIndex+3].title;
    }
    ////sixth bookmark
    if (currentIndex+4 >= bookmarks.length) {
        targetList = document.getElementById('cont_bookmark_list6');
        targetList.innerText = '';
    } else {
        targetList = document.getElementById('cont_bookmark_list6');
        targetList.innerText = bookmarks[currentIndex+4].title;
    }
    storeCurrentIndes();

}
//lists click events
const listTargets = document.getElementsByClassName('list');
for (let i = 0; i < listTargets.length; i++){
    listTargets[i].addEventListener('click', () => {

        if ((bookmarks.length - 1 >= currentIndex + i - 1 || currentIndex + i - 1 >=0) && listTargets[i].innerText !=='') {
            currentIndex += i - 1;

            chnageDisplayBookmarks(true);
        }
        
    });
}


chrome.storage.onChanged.addListener(getStoreData());

//store the data to storage
function storeAllJSONData() {
    let memo = bookmarks.map(e => JSON.stringify(e));
    chrome.storage.local.set({ 'bookmarkReaderData': memo }, function (res) {
        chrome.storage.local.set({ 'bookmarkReaderIndex': 0 }, function (resul) {
            chrome.storage.local.get(function (result) { console.log(JSON.stringify(result)) });
        });
    }); 
}
//store the current index to storage
function storeCurrentIndes() {
    chrome.storage.local.set({ 'bookmarkReaderIndex': currentIndex }, function (resul) {

    });
}
//get store data from storage , and change list display.
function getStoreData() {

    chrome.storage.local.get( function (res) {

        bookmarks = res.bookmarkReaderData.map((e)=>JSON.parse(e));

        chrome.storage.local.get(function (result) {
            currentIndex = result.bookmarkReaderIndex;
            chnageDisplayBookmarks(false);

            getFolderList();
            
        });
    });

};

function getFolderList() {
    chrome.runtime.sendMessage({ greeting: "datalist" }, function (response) {
        dataList = response.list;
        let target = document.getElementById('inputDatalist');
        dataList.forEach((data) => {
            let op = document.createElement('option');
            op.value = data.title;
            target.append(op);
        });
    });
};