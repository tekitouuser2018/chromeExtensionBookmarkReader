

let arr = [];
let len = 0;
let searchResult = false;
let folder = [];
let folderLen = 0;

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.greeting === "hello") {
            getAllTree();
            arr = arr.slice(len);
            len = arr.length;
            sendResponse({ res: arr });
        }else if (request.greeting === 'print') {
            updatePage(request.bookmarks, request.currentIndex);

            sendResponse({ res: 'page printed' });
        } else if (request.greeting === 'search') {
            getSpecificTree();
            arr = arr.slice(len);
            len = arr.length;
            sendResponse({ res: arr, ok: searchResult });
        // } else if (request.greeting === 'debug') {
        //     chrome.storage.sync.set({ 'debug_user_name': 'test_loot_user' }, function () { });
        //     sendResponse({ res: "debug" });
        } else if (request.greeting === 'datalist') {
            getFolder();
            folder = folder.slice(folderLen);
            folderLen = folder.length;
            sendResponse({list:folder, message:'data okutta'});
        }
    }
);

///////////////////////////DEBUG///////////////////
function debug() {
    chrome.bookmarks.getTree(function (bookmark) {
        debugSecond(bookmark);
    });
}; 

function debugSecond(bookmarks) {
    bookmarks.forEach(bookmark => {
        arr.push(bookmark);
    });

}
////////////////////////////DEBUG///////////////////

function getAllTree() {
    chrome.bookmarks.getTree(function (bookmark) {
        printBookmarks(bookmark); 
    });
}; 

function printBookmarks(books) {
    arr.push(books[0].children[0]);
    // books.forEach(bookmark => {
    //     if (bookmark.children) {
    //         printBookmarks(bookmark.children);
    //     } else {
    //         arr.push(bookmark);
    //     }
    // });
    
}
//////////////////////////////////////////////////
function getSpecificTree() {
    chrome.bookmarks.getTree(function (bookmark) {
        printSpecificBookmarks(bookmark);
    });
};

function printSpecificBookmarks(books) {
    books.forEach(bookmark => {
        arr.push(bookmark);
    });

}
//////////////////////////////////////////////////

function getFolder() {
    chrome.bookmarks.getTree(function (bookmark) {
        getFolderPrint(bookmark);
    });
};

function getFolderPrint(books) {
    books.forEach(bookmark => {

        if (bookmark.children) {
            folder.push(bookmark);
            getFolderPrint(bookmark.children);
        } 
    });

}

///////////////////////////////////////////////////

function updatePage(books , currentIndex) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
        chrome.tabs.update(tab.id, { url: books[currentIndex].url });
    });
}; 
