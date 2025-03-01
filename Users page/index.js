const addBox = document.querySelector(".addBox");
const popUpBox = document.querySelector(".popupBox");
const closeIcon = document.querySelector("header i");
const titleTag = document.querySelector("input");
const descTag = document.querySelector("textarea");
const addBtn = popUpBox.querySelector(".addQuote");
const popupTitle = document.querySelector("header p");

// Array of 12 months to display in the popup
const months = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

// Quotes array (local storage)
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
let isUpdate = false, updateID = null;

// Function to add new quote
addBox.addEventListener("click", function(){
    titleTag.focus();
    popUpBox.classList.add("show");
});

// Close pop-up new quote
closeIcon.addEventListener("click", () => {
    popUpBox.classList.remove("show");
    titleTag.value = "";
    descTag.value = "";
    addBtn.innerText = "Add Quote";
    popupTitle.innerText = "Add a Quote";
});

// New quote is added and stored onto the page
addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let quoteTitle = titleTag.value.trim(),
        quoteDesc = descTag.value.trim();

    if (quoteTitle || quoteDesc) {
        let dateObj = new Date(),
            month = months[dateObj.getMonth()],
            day = dateObj.getDate(),
            year = dateObj.getFullYear();

        let quoteInfo = {
            title: quoteTitle,
            description: quoteDesc,
            date: `${month} ${day}, ${year}`
        };

        if (!isUpdate) {
            quotes.push(quoteInfo);
        } else {
            isUpdate = false;
            quotes[updateID] = quoteInfo;
        }

        localStorage.setItem("quotes", JSON.stringify(quotes));
        closeIcon.click();
        showQuotes();
    } else {
        alert("Please enter a title or description.");
    }
});

// Show the quotes on the page
function showQuotes() {
    document.querySelectorAll(".quote").forEach(quote => quote.remove());

    quotes.forEach((quote, index) => {
        let liTag = `<li class="quote">
            <div class="details">
                <p>${quote.title}</p>
                <span>${quote.description}</span>
            </div>
            <div class="bottom-content">
                <span>${quote.date}</span>
                <div class="settings">
                    <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                    <ul class="menu">
                        <li onclick="updateQuote(${index}, '${quote.title}', '${quote.description}')">
                            <i class="uil uil-pen"></i>Edit
                        </li>
                        <li onclick="deleteQuote(${index})">
                            <i class="uil uil-trash"></i>Delete
                        </li>
                    </ul>
                </div>
            </div>
        </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);
    });
}

// Clear input fields when popup is closed
closeIcon.addEventListener("click", () => {
    titleTag.value = "";
    descTag.value = "";
});

// Menu settings to let user edit or delete the quote from the list
function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", (e) => {
        if (e.target.tagName !== "I" || e.target !== elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

// Delete function that will delete the quote
function deleteQuote(noteId) {
    let confirmDel = confirm("Are you sure you want to delete this quote?");
    if (!confirmDel) return;

    quotes.splice(noteId, 1);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    showQuotes();
}

// Update function that will update the quote
function updateQuote(noteId, title, desc) {
    isUpdate = true;
    updateID = noteId;
    addBox.click();
    titleTag.value = title;
    descTag.value = desc;
    addBtn.innerText = "Update Quote";
    popupTitle.innerText = "Update a Quote";
}

// Show existing quotes on page load
showQuotes();
