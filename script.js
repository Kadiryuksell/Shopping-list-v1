// Selecting DOM elements
const itemInput = document.querySelector("#item-input");
const itemForm = document.querySelector("#item-form");
const itemList = document.querySelector("#item-list");
const itemFilter = document.querySelector("#filter");
const itemAllClearBtn = document.querySelector("#clear");
const hr = document.querySelector("hr");
const formBtn = itemForm.querySelector("button");
let isUpdateMode = false;

// Function to retrieve items from local storage
function itemStorage() {
    const itemsFromStorage = getItemFromStorage();
    return itemsFromStorage;
}

// Function to display items from local storage
function displayItems() {
    const itemsFromStorage = itemStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    checkUI();
}

// Function to create an icon element
function createIcon(classes) {
    const i = document.createElement("i");
    i.className = classes;
    return i;
}

// Function to create a button element
function createBtn(classes) {
    const btn = document.createElement("button");
    btn.className = classes;
    return btn;
}

// Function to create a list item element
function createLi(classes) {
    const li = document.createElement('li');
    li.className = classes;
    return li;
}

// Function to remove the "btnUpdate" class from the button
function btnUpdateClassRemove() {
    formBtn.classList.remove("btnUpdate");
}
// Function to remove the "updateText" class from an item
function itemToUpdateClassRemove() {
    const itemToUpdate = itemList.querySelector(".updateText");
    itemToUpdate.classList.remove("updateText");
    itemToUpdate.remove();
}

// Function to handle the submission of a new item
function addItemSubmit(e) {
    e.preventDefault();
    const itemValue = itemInput.value;

    //Value validation
    if (itemValue === "") {
        alert("You cannot leave it blank");
        return 0;
    }
    // Check for update mode
    if (isUpdateMode) {
        removeItemFromStorage(itemList.querySelector(".updateText").textContent);
        itemToUpdateClassRemove();
        btnUpdateClassRemove();
        isUpdateMode = false;
    }
    // Check if the item already exists
    if (checkItemExists(itemValue.toLowerCase())) {
        alert("that item already exists!");
        itemInput.value = "";
        return;
    }

    // Create item DOM element
    addItemToDOM(itemValue);

    // Add item to local storage
    addItemToStorage(itemValue);

    checkUI();
    itemInput.value = "";
}

// Function to add an item to the DOM
function addItemToDOM(item) {
    // Create list item
    const i = createIcon("fa-solid fa-xmark");
    const btn = createBtn("remove-item btn-link text-red");
    const li = createLi("item");

    li.appendChild(document.createTextNode(item));
    btn.appendChild(i);
    li.appendChild(btn);

    // Add li to the DOM
    itemList.appendChild(li);
}

// Function to add an item to local storage
function addItemToStorage(item) {
    let itemsFromStorage = itemStorage();
    // add new item to array
    itemsFromStorage.push(item);
    // Convert to JSON string and set to local storage
    localStorage.setItem("items", JSON.stringify(itemsFromStorage))
}

// Function to retrieve items from local storage
function getItemFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem("items") === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem("items"));
    }
    return itemsFromStorage;
}



// Function to handle clicking on an item
function clickItem(e) {
    if (e.target.parentElement.classList.contains("remove-item")) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        if (e.target.classList.contains("item"))
            setItemUpdate(e.target);
        else {
            btnUpdateClassRemove();
            setItemUpdateRemove();
            checkUI();
        }
    }

}

// Function to check if an item exists in local storage
function checkItemExists(item) {
    const itemsFromStorage = itemStorage();
    return itemsFromStorage.includes(item);
}

// Function to remove the "updateText" class from all items
function setItemUpdateRemove() {
    itemList.querySelectorAll("li").forEach((i) => i.classList.remove("updateText"));
}

// Function to set an item as the one to be updated
function setItemUpdateAdd(item) {
    item.classList.add("updateText");
    formBtn.innerHTML = '<i class ="fa-solid fa-pen"></i> Update Item';
    formBtn.classList.add("btnUpdate");
}

// Function to set an item as the one to be updated and enter update mode
function setItemUpdate(item) {
    isUpdateMode = true;
    setItemUpdateRemove();
    setItemUpdateAdd(item);
    itemInput.value = item.textContent;
}


// Function to remove an item from local storage
function removeItemFromStorage(item) {
    let itemsFromStorage = getItemFromStorage();

    // Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter(i => i !== item);

    // Reset to localstorage
    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

// Function to remove an item from the DOM and local storage
function removeItem(item) {
    // Remove item from DOM
    item.remove();

    // Remove item from storage
    removeItemFromStorage(item.textContent);
    checkUI();
}


// Function to clear all items from the DOM and local storage
function clearAllItem() {
    if (confirm("Are you sure?")) {
        while (itemList.firstChild)
            itemList.removeChild(itemList.firstChild);
    }
    // Clear from localStorage
    localStorage.removeItem("items");

    checkUI();
}

// Function to filter items based on user input
function FiterItems(e) {
    const inputText = e.target.value.toLowerCase();
    const items = document.querySelectorAll("li");

    items.forEach((item) => {
        const itemText = item.firstChild.textContent.toLowerCase();

        if (itemText.indexOf(inputText) != -1)
            item.style.display = "flex";
        else
            item.style.display = "none";
    });

}

// Function to check the state of the UI and update it accordingly
function checkUI() {
    itemInput.value = "";
    const items = document.querySelectorAll("li");
    if (items.length <= 0) {
        itemFilter.classList.add("none");
        itemAllClearBtn.classList.add("none");
        hr.classList.add("none");
    } else {
        itemFilter.classList.remove("none");
        itemAllClearBtn.classList.remove("none");
        hr.classList.remove("none");
    }

    formBtn.innerHTML = "Add Item";
    formBtn.classList.add("btn");
    isUpdateMode = false;
}


// Initialize the application
function init() {
    // Event Listeners
    document.addEventListener("DOMContentLoaded", displayItems);
    itemForm.addEventListener("submit", addItemSubmit);
    itemList.addEventListener("click", clickItem);
    itemAllClearBtn.addEventListener("click", clearAllItem);
    itemFilter.addEventListener("input", FiterItems);
    checkUI();
}
// Initialize the application when the DOM is ready
init();