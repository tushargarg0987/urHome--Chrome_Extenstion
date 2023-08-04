chrome.runtime.onInstalled.addListener(function (details) {
    // chrome.bookmarks.getTree((result) => {
    //     console.log(result[0].children);
    //     // const categoryList = [];
    //     //console.log(result[0].id);
    //     for (let ele in result[0].children) {
    //         if (result[0].children[ele].title === "Other bookmarks") {
    //             //console.log(result[0].children[0].children[ele]);
    //             chrome.bookmarks.create(
    //                 { 'parentId': result[0].children[ele].id, 'title': 'urHome Bookmarks' },
    //                 function (newFolder) {
    //                     console.log("added folder: " + newFolder.title);
    //                 },
    //                 { 'parentId': result[0].children[ele].id, 'title': 'Popular' },
    //                 function (newFolder) {
    //                     console.log("added folder: " + newFolder.title);
    //                 },
    //                 { 'parentId': result[0].children[ele].id, 'title': 'Entertainment' },
    //                 function (newFolder) {
    //                     console.log("added folder: " + newFolder.title);
    //                 },
    //                 { 'parentId': result[0].children[ele].id, 'title': 'Developer' },
    //                 function (newFolder) {
    //                     console.log("added folder: " + newFolder.title);
    //                 },
    //             );
    //         }
    //     }
    // })
    // (async () => {
    //     const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    //     const response = await chrome.tabs.sendMessage(tab.id, {greeting: "hello"});
    //     // do something with response here, not outside the function
    //     console.log(response);
    // })();
    // const bc = new BroadcastChannel("test_channel");
    // bc.postMessage("This is a test message.");
    // window.location = './installed.html'

    console.log("Worked");
    // bc.close();

});
