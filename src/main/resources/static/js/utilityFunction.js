// function ekak define karanawa ajax GET request ekak ganna
// example: "employee/alldata"
const getDataAjaxGetRequest = (url) => {

    let response = []; // backend eken ena data store karanna variable ekak

    // jQuery AJAX function call eka - server ekata request yawanna
    $.ajax({
        url: url,          // request karanna URL eka (API endpoint)
        type: "GET",       // HTTP request type eka (GET request)

        dataType: "json",  // backend eken ena response eka JSON format ekata convert karanawa

        /* Handles JSON data exchange between server and client */
        // backend eken ena data automatically JSON widiyata parse karanawa
        async: false,      // synchronous request ekak
        // async true nam browser eka wait karanne na
        // async false nam response enakan browser eka wait karanawa

        // ----------------------------------------------------
        // request success unoth me callback eka run wenawa
        // data parameter eka athule server response eka enawa
        // ----------------------------------------------------
        success: function (data) {

            // success message ekak console ekata print karanawa (debugging sandaha)
            console.log("Success:", data);

            // backend eken ena data eka response variable ekata store karanawa
            response = data;
        },

        // ----------------------------------------------------
        // request fail unoth (error ekak unoth) me callback eka run wenawa
        // xhr    -> XMLHttpRequest object (full request-response details thiyenawa)
        // status -> error type eka (timeout, error, abort)
        // error  -> short error message ekak (Not Found, Server Error etc.)
        // ----------------------------------------------------
        error: function (xhr, status, error) {

            // debugging sandaha error details console ekata print karanawa
            console.log("Error:", error);
            console.log("Status:", status);
            console.log("XHR:", xhr);
        }
    });
    // --------------------------------------------------------
    // Final response eka return karanawa
    // success unoth -> server data return wenawa
    // error unoth   -> error status return wenawa
    // --------------------------------------------------------
    return response;
}

// ajax GET request ekakin String response ekak gannawa
const getDataAjaxGetRequestForString = (url) => {

    // backend eken ena response eka store karanawa
    let response = [];

    $.ajax({
        url: url,
        type: "GET",

        // String response ekak widihata gannawa
        dataType: "",

        // response enakan wait karanawa
        async: false,

        // request success unoth response eka store karanawa
        success: function (data) {
            response = data;
        },

        // request fail unoth error eka console ekata pennanawa
        error: function (xhr, status, error) {
            console.log("Error:", error);
        }
    });

    // backend response eka return karanawa
    return response;
}

// reusable jQuery AJAX function ekak - server ekata data yawanna (POST / PUT / DELETE)
// example: "employee/insert", "POST", employee (Object)
const setDataAjaxGetRequest = (url, method, dataOb) => {

    // server response eka store karanna variable ekak - empty string
    let responce = "";

    // jQuery AJAX request eka initialize karanawa
    $.ajax({
        url: url, // API endpoint (request yanne koheda)
        type: method, // HTTP method (POST / PUT / DELETE)
        contentType: "application/json",// Sending data to the server in JSON format.

        /* Handles JSON data exchange between client and server */
        data: JSON.stringify(dataOb),//convert that object into a JSON string format
        //json kiyana eka language eka matha rada pawathinne na(independant)
        //frontend eke ynne Javascript ,backend eke ynne Java language 2 k 
        //json atharamadiyek widihata kriyakrnwa 


        async: false,  // async: false -> synchronous request ekak
        // e kiyanne response eka enakan browser eka wait karanawa

        // ----------------------------------------------------
        // Request eka success unoth me callback eka run wenawa
        // data parameter eka athule server response eka enawa
        // ----------------------------------------------------
        success: function (data) {

            // success message ekak console ekata print karanawa
            console.log("Success :", data);

            // server response eka responce variable ekata assign karanawa
            responce = data;
        },

        // ----------------------------------------------------
        // Request eka fail unoth (error ekak unoth) meka run wenawa
        // xhr    -> XMLHttpRequest object (full details)
        // status -> error type (error, timeout, abort)
        // error  -> short error message
        // ----------------------------------------------------
        error: function (xhr, status, error) {

            // debugging sandaha details console ekata print karanawa
            console.log(xhr);
            console.log(status);
            console.log(error);

            // error unama status eka responce widiyata store karanawa
            responce = status;
        }
    });

    // --------------------------------------------------------
    // Final eke responce eka return karanawa
    // success -> server data
    // error   -> error status
    // --------------------------------------------------------
    return responce;
}

// define input text validator for reusability
const inputTextValidator = (textElement, pattern, object, property) => {

    let textElementValue = textElement.value; // input field eke user type kara value gannawa
    let regPattern = new RegExp(pattern);     // regex pattern create karanawa validation ekata

    // check input empty na neda
    if (textElementValue != "") {

        // regex pattern match karanawa
        if (regPattern.test(textElementValue)) {
            // valid → green border pennanawa
            textElement.style.border = '2px solid green';

            // data bind karanawa object property ekata dynamically
            // example: employee['fullname'] = value
            window[object][property] = textElementValue;
        } else {
            // invalid → red border pennanawa
            textElement.style.border = '2px solid red';
            // object property clear karanawa
            window[object][property] = null;
        }
    } else {
        // input empty nam
        if (textElement.required) {
            // required field nam → red border pennanawa
            textElement.style.border = '2px solid red';
        } else {
            // optional field nam → normal light blue border
            textElement.style.border = '1px solid rgb(164, 201, 232)';
        }
        // empty input → object property clear karanawa
        window[object][property] = null;
    }
}


// define load table data function
const loadTableData = (tableBodyElement, dataList, displayColumns, printFunction, editFunction, deleteFunction) => {

    // table body eke old html clean karanawa
    tableBodyElement.innerHTML = "";

    // data list eke object ekak ekak loop karanawa
    dataList.forEach((dataOb, index) => {

        // tr element hadanawa → row ekak
        let tr = document.createElement("tr");

        // td id create karanawa → 1,2,3… (index + 1)
        let tdId = document.createElement("td");
        tdId.innerText = index + 1;
        tr.appendChild(tdId);

        // display karanna ona columns loop karanawa
        displayColumns.forEach(displayColumn => {
            let td = document.createElement("td");

            if (displayColumn.dataType === "string") {
                // normal string data display karanawa
                td.innerText = dataOb[displayColumn.property];
            }
            if (displayColumn.dataType === "image") {

                // create image element
                let img = document.createElement("img");

                // set image size
                img.style.width = "50px";
                img.style.height = "50px";

                // check if image data exists
                if (dataOb[displayColumn.property] != null) {

                    // convert base64 value and assign to image source
                    img.src = atob(dataOb[displayColumn.property]);

                } else {

                    // if no image available show default user icon
                    img.src = "images/usericon.jpg";
                }

                // add image into table cell
                td.appendChild(img);
            }

            if (displayColumn.dataType === "function") {
                // function data call karala html display karanawa
                td.innerHTML = displayColumn.property(dataOb);
            }

            tr.appendChild(td);
        });

        let tdModify = document.createElement("td");
        tdModify.className = "text-center";

        // === PRINT BUTTON ===
        let buttonPrint = document.createElement("button");
        buttonPrint.innerHTML = "<i class='fas fa-print'></i>";
        buttonPrint.className = "btn btn-sm fw-bold me-2 p-1";
        buttonPrint.style.backgroundColor = "#8caed1ff";
        buttonPrint.style.color = "white";
        buttonPrint.onmouseover = () => buttonPrint.style.backgroundColor = "#96cbcbff";
        buttonPrint.title = "Print";
        buttonPrint.onmouseout = () => buttonPrint.style.backgroundColor = "#8caed1ff";
        tdModify.appendChild(buttonPrint);
        buttonPrint.onclick = () => printFunction(dataOb);

        // === EDIT BUTTON ===
        let buttonEdit = document.createElement("button");
        buttonEdit.innerHTML = "<i class='fas fa-pencil'></i>";
        buttonEdit.className = "btn btn-sm fw-bold me-2 p-1";
        buttonEdit.style.backgroundColor = "#8caed1ff";
        buttonEdit.style.color = "white";
        buttonEdit.onmouseover = () => buttonEdit.style.backgroundColor = "#aed197ff";
        buttonEdit.title = "Edit";
        buttonEdit.onmouseout = () => buttonEdit.style.backgroundColor = "#8caed1ff";

        tdModify.appendChild(buttonEdit);
        buttonEdit.onclick = () => editFunction(dataOb);

        // === DELETE BUTTON ===
        let buttonDelete = document.createElement("button");
        buttonDelete.innerHTML = "<i class='fas fa-trash'></i>";
        buttonDelete.className = "btn btn-sm fw-bold p-1";
        buttonDelete.style.backgroundColor = "#8caed1ff";
        buttonDelete.style.color = "white";
        buttonDelete.onmouseover = () => buttonDelete.style.backgroundColor = "#cd5b57ff";
        buttonDelete.title = "Delete";
        buttonDelete.onmouseout = () => buttonDelete.style.backgroundColor = "#8caed1ff"
        tdModify.appendChild(buttonDelete);
        buttonDelete.onclick = () => deleteFunction(dataOb);

        // append to row and table
        tr.appendChild(tdModify);
        tableBodyElement.appendChild(tr);

    });
}
// define load table data function
const loadTableData1 = (tableBodyElement, dataList, displayColumns, printFunction) => {

    // table body eke old html clean karanawa
    tableBodyElement.innerHTML = "";

    // data list eke object ekak ekak loop karanawa
    dataList.forEach((dataOb, index) => {

        // tr element hadanawa → row ekak
        let tr = document.createElement("tr");

        // td id create karanawa → 1,2,3… (index + 1)
        let tdId = document.createElement("td");
        tdId.innerText = index + 1;
        tr.appendChild(tdId);

        // display karanna ona columns loop karanawa
        displayColumns.forEach(displayColumn => {
            let td = document.createElement("td");

            if (displayColumn.dataType === "string") {
                // normal string data display karanawa
                td.innerText = dataOb[displayColumn.property];
            }
            if (displayColumn.dataType === "image") {

                // create image element
                let img = document.createElement("img");

                // set image size
                img.style.width = "50px";
                img.style.height = "50px";

                // check if image data exists
                if (dataOb[displayColumn.property] != null) {

                    // convert base64 value and assign to image source
                    img.src = atob(dataOb[displayColumn.property]);

                } else {

                    // if no image available show default user icon
                    img.src = "images/usericon.jpg";
                }

                // add image into table cell
                td.appendChild(img);
            }

            if (displayColumn.dataType === "function") {
                // function data call karala html display karanawa
                td.innerHTML = displayColumn.property(dataOb);
            }

            tr.appendChild(td);
        });

        let tdModify = document.createElement("td");
        tdModify.className = "text-center";

        // === PRINT BUTTON ===
        let buttonPrint = document.createElement("button");
        buttonPrint.innerHTML = "<i class='fas fa-print'></i>";
        buttonPrint.className = "btn btn-sm fw-bold me-2 p-1";
        buttonPrint.style.backgroundColor = "#8caed1ff";
        buttonPrint.style.color = "white";
        buttonPrint.onmouseover = () => buttonPrint.style.backgroundColor = "#96cbcbff";
        buttonPrint.title = "Print";
        buttonPrint.onmouseout = () => buttonPrint.style.backgroundColor = "#8caed1ff";
        tdModify.appendChild(buttonPrint);
        buttonPrint.onclick = () => printFunction(dataOb);

        // append to row and table
        tr.appendChild(tdModify);
        tableBodyElement.appendChild(tr);

    });
}

// define load table data function-without edit button
const loadTableData2 = (tableBodyElement, dataList, displayColumns, printFunction, deleteFunction) =>{

    // table body eke old html clean karanawa
    tableBodyElement.innerHTML = "";

    // data list eke object ekak ekak loop karanawa
    dataList.forEach((dataOb, index) => {

        // tr element hadanawa → row ekak
        let tr = document.createElement("tr");

        // td id create karanawa → 1,2,3… (index + 1)
        let tdId = document.createElement("td");
        tdId.innerText = index + 1;
        tr.appendChild(tdId);

        // display karanna ona columns loop karanawa
        displayColumns.forEach(displayColumn => {
            let td = document.createElement("td");

            if (displayColumn.dataType === "string") {
                // normal string data display karanawa
                td.innerText = dataOb[displayColumn.property];
            }
            if (displayColumn.dataType === "image") {

                // create image element
                let img = document.createElement("img");

                // set image size
                img.style.width = "50px";
                img.style.height = "50px";

                // check if image data exists
                if (dataOb[displayColumn.property] != null) {

                    // convert base64 value and assign to image source
                    img.src = atob(dataOb[displayColumn.property]);

                } else {

                    // if no image available show default user icon
                    img.src = "images/usericon.jpg";
                }

                // add image into table cell
                td.appendChild(img);
            }

            if (displayColumn.dataType === "function") {
                // function data call karala html display karanawa
                td.innerHTML = displayColumn.property(dataOb);
            }

            tr.appendChild(td);
        });

        let tdModify = document.createElement("td");
        tdModify.className = "text-center";

        // === PRINT BUTTON ===
        let buttonPrint = document.createElement("button");
        buttonPrint.innerHTML = "<i class='fas fa-print'></i>";
        buttonPrint.className = "btn btn-sm fw-bold me-2 p-1";
        buttonPrint.style.backgroundColor = "#8caed1ff";
        buttonPrint.style.color = "white";
        buttonPrint.onmouseover = () => buttonPrint.style.backgroundColor = "#96cbcbff";
        buttonPrint.title = "Print";
        buttonPrint.onmouseout = () => buttonPrint.style.backgroundColor = "#8caed1ff";
        tdModify.appendChild(buttonPrint);
        buttonPrint.onclick = () => printFunction(dataOb);


        // === DELETE BUTTON ===
        let buttonDelete = document.createElement("button");
        buttonDelete.innerHTML = "<i class='fas fa-trash'></i>";
        buttonDelete.className = "btn btn-sm fw-bold p-1";
        buttonDelete.style.backgroundColor = "#8caed1ff";
        buttonDelete.style.color = "white";
        buttonDelete.onmouseover = () => buttonDelete.style.backgroundColor = "#cd5b57ff";
        buttonDelete.title = "Delete";
        buttonDelete.onmouseout = () => buttonDelete.style.backgroundColor = "#8caed1ff"
        tdModify.appendChild(buttonDelete);
        buttonDelete.onclick = () => deleteFunction(dataOb);

        // append to row and table
        tr.appendChild(tdModify);
        tableBodyElement.appendChild(tr);

    });
}
//define inner tabel view function
const loadTableDataInner = (tableBodyElement, dataList, displayColumns) => {

    // table body eke old html clean karanawa
    tableBodyElement.innerHTML = "";

    // data list eke object ekak ekak loop karanawa
    dataList.forEach((dataOb, index) => {

        // tr element hadanawa → row ekak
        let tr = document.createElement("tr");

        // td id create karanawa → 1,2,3… (index + 1)
        let tdId = document.createElement("td");
        tdId.innerText = index + 1;
        tr.appendChild(tdId);

        // display karanna ona columns loop karanawa
        displayColumns.forEach(displayColumn => {

            // td element create karanawa
            let td = document.createElement("td");

            // string type data display karanawa
            if (displayColumn.dataType === "string") {

                // object eke property value eka td ekata assign karanawa
                td.innerText = dataOb[displayColumn.property];
            }

            // function type data display karanawa
            if (displayColumn.dataType === "function") {

                // function eka call karala return wena value eka td ekata assign karanawa
                td.innerHTML = displayColumn.property(dataOb);
            }

            // td eka tr ekata append karanawa
            tr.appendChild(td);
        });

        // tr eka table body ekata append karanawa
        tableBodyElement.appendChild(tr);
    });
}

// define load table data function
const loadTableDataInner1 = (tableBodyElement, dataList, displayColumns, deleteFunction) => {

    // table body eke old html clean karanawa
    tableBodyElement.innerHTML = "";

    // data list eke object ekak ekak loop karanawa
    dataList.forEach((dataOb, index) => {

        // tr element hadanawa → row ekak
        let tr = document.createElement("tr");

        // td id create karanawa → 1,2,3… (index + 1)
        let tdId = document.createElement("td");
        tdId.innerText = index + 1;
        tr.appendChild(tdId);

        // display karanna ona columns loop karanawa
        displayColumns.forEach(displayColumn => {
            let td = document.createElement("td");

            if (displayColumn.dataType === "string") {
                // normal string data display karanawa
                td.innerText = dataOb[displayColumn.property];
            }
            if (displayColumn.dataType === "image") {

                // create image element
                let img = document.createElement("img");

                // set image size
                img.style.width = "50px";
                img.style.height = "50px";

                // check if image data exists
                if (dataOb[displayColumn.property] != null) {

                    // convert base64 value and assign to image source
                    img.src = atob(dataOb[displayColumn.property]);

                } else {

                    // if no image available show default user icon
                    img.src = "images/usericon.jpg";
                }

                // add image into table cell
                td.appendChild(img);
            }

            if (displayColumn.dataType === "function") {
                // function data call karala html display karanawa
                td.innerHTML = displayColumn.property(dataOb);
            }

            tr.appendChild(td);
        });

        let tdModify = document.createElement("td");
        tdModify.className = "text-center";

        // === DELETE BUTTON ===
        let buttonDelete = document.createElement("button");
        buttonDelete.innerHTML = "<i class='fas fa-trash'></i>";
        buttonDelete.className = "btn btn-sm fw-bold p-1";
        buttonDelete.style.backgroundColor = "#8caed1ff";
        buttonDelete.style.color = "white";
        buttonDelete.onmouseover = () => buttonDelete.style.backgroundColor = "#cd5b57ff";
        buttonDelete.title = "Delete";
        buttonDelete.onmouseout = () => buttonDelete.style.backgroundColor = "#8caed1ff"
        tdModify.appendChild(buttonDelete);
        buttonDelete.onclick = () => deleteFunction(dataOb);

        // append to row and table
        tr.appendChild(tdModify);
        tableBodyElement.appendChild(tr);

    });
}

// define function to load options into select dropdown
const loadSelectOptions = (element, dataList, message, property, selectedValue) => {

    // default HTML options clear karanawa
    element.innerHTML = "";

    if (message != "") {
        // default option create karanawa (user eka guide karanna)
        let optionMsg = document.createElement("option");
        optionMsg.value = "";          // value empty
        optionMsg.selected = true;     // default select wenna
        optionMsg.disabled = true;     // user cannot select this
        optionMsg.innerText = message; // text display karanawa
        element.appendChild(optionMsg);
    }

    // data list eke thiyana objects loop karala options append karanawa
    dataList.forEach(dataOb => {
        let option = document.createElement("option");
        option.value = JSON.stringify(dataOb); // object eka JSON string karala value ekata assign karanawa
        if (selectedValue == dataOb.id) {
            option.selected = "selected";
        }
        option.innerText = dataOb[property];   // display karana text
        element.appendChild(option);
    });
}

// define function ekak datalist ekata options load karanna
const loadDatalistOptions = (element, dataList, property, idField) => {

    // old options clear karanawa
    element.innerHTML = "";

    // data list eka loop karanawa
    dataList.forEach(dataOb => {

        let option = document.createElement("option");

        // display value set karanawa
        option.value = dataOb[property];

        // related id eka store karanawa
        option.setAttribute("data-id", dataOb[idField]);

        // option eka datalist ekata add karanawa
        element.appendChild(option);
    });
}


// define function ekak selected datalist option eke id eka ganna
const getIdFromDatalist = (inputElement, datalistElement) => {

    // user select karapu value eka gannawa
    let inputValue = inputElement.value;

    // datalist eke options okkoma gannawa
    let options = datalistElement.querySelectorAll("option");

    // matching option eka hoyanawa
    for (let option of options) {

        if (option.value === inputValue) {

            // matching option eke id eka return karanawa
            return option.getAttribute("data-id");
        }
    }

    // match ekak nathnam null return karanawa
    return null;
}

//create function for set ui color
const setUIColour = (elementList) => {
    //define setui colour after submittion  ex-border color normal wenawa
    // element list eke thiyena element walata thama meka apply wenne
    elementList.forEach(element => {

        // remove focus
        element.blur();

        // reset border
        element.style.border = "1.5px solid rgb(164, 201, 232)";
        element.style.boxShadow = "none";
        //element.style.transform = "scale(1)";
    });
}

//create reusable delete function
const deleteWithConfirm = (dataOb, message, url, onSuccess) => {

    // SweetAlert2 confirm popup eka open karanawa
    Swal.fire({
        title: "Are you sure?",   // popup title eka
        html: "You are about to delete the following detail..<br><br>" + message, // delete wenna one data details
        icon: "warning",         // warning icon eka
        showCancelButton: true,  // Cancel button eka pennanawa
        confirmButtonColor: "#3085d6", // Confirm button color
        cancelButtonColor: "#d33",     // Cancel button color
        confirmButtonText: "Yes, delete it!", // Confirm button text
        cancelButtonText: "Cancel"     // Cancel button text
    }).then((result) => {

        // user Confirm button eka click karoth
        if (result.isConfirmed) {

            // backend ekata delete request eka yawanna
            // setDataAjaxGetRequest → common AJAX function eka
            const deleteResponse =
                setDataAjaxGetRequest(url, "DELETE", dataOb);

            // delete success unoth
            if (deleteResponse === "OK") {

                // success SweetAlert popup eka
                Swal.fire({
                    title: "Deleted!",
                    text: "Deleted successfully!",
                    icon: "success"
                }).then(() => {
                    onSuccess(); // callback after success
                });

            } else {

                // delete fail unoth error SweetAlert popup eka
                Swal.fire({
                    title: "Error!",
                    text: "Delete not completed. Error: " + deleteResponse,
                    icon: "error"
                });
            }
        }

        // user Cancel click karoth → mokuth karanne na
    });
}

// reusable submit function
// validation + confirm popup + AJAX save + callback execution

const submitWithConfirm = (checkSubmit, dataOb, url, onSuccess) => {

    // 1. Form validation check karanawa
    let errors = checkSubmit();

    // 2. errors naththam submit process eka continue wenawa
    if (errors === "") {
        // confirm popup message
        let message = "Are you sure you want to submit the following detail?";

        // 3. SweetAlert2 confirmation popup show karanawa
        Swal.fire({
            title: "Confirm Submission",
            html: message,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, submit!",
            cancelButtonText: "Cancel"

        }).then((result) => {

            // 4. user confirm karoth
            if (result.isConfirmed) {
                // save result eka store karanawa
                let postResponse = "OK";
                // 5. object array ekak nam loop karala save karanawa
                if (Array.isArray(dataOb)) {
                    dataOb.forEach(ob => {
                        let response = setDataAjaxGetRequest(url, "POST", ob);

                        // error response ekak awoth eka store karanawa
                        if (response !== "OK") {
                            postResponse = response;
                        }
                    });

                } else {

                    // 6. single object ekak nam direct save karanawa
                    postResponse = setDataAjaxGetRequest(url, "POST", dataOb);
                }

                // 7. save success nam success popup eka show karanawa
                if (postResponse === "OK") {
                    Swal.fire({
                        title: "Saved!",
                        text: "Record saved successfully!",
                        icon: "success"
                    }).then(() => {
                        // callback function eka execute karanawa
                        onSuccess();
                    });

                } else {
                    // 8. save fail nam error popup eka show karanawa
                    Swal.fire({
                        title: "Error!",
                        html: "Save not completed. Some errors occurred:<br><br>" + postResponse,
                        icon: "error"
                    });
                }
            }
        });
    } else {
        // 9. validation errors thiyenawanam warning popup eka show karanawa
        Swal.fire({
            title: "Validation Error",
            html: "Save not completed. Some errors occurred:<br><br>" + errors,
            icon: "warning"
        });
    }
}
// create reusable update function
const updateWithConfirm = (checkSubmit, checkUpdates, dataOb, url, onSuccess) => {
    // Handles validation, change detection, user confirmation, and update request
    // Log the data object for debugging
    console.log(dataOb);

    // Check form validation errors
    let errors = checkSubmit();

    // Proceed only if there are no validation errors
    if (errors === "") {

        // Check whether the form has any updates
        let updates = checkUpdates();

        // If no changes were detected
        if (updates === "") {

            // Show information message
            Swal.fire({
                title: "No Changes",
                text: "Form hasn't any changes!",
                icon: "info",
                allowOutsideClick: false
            });

        } else {

            // Show confirmation dialog with updated details
            Swal.fire({
                title: "Are you sure?",
                html: "Do you want to update the following details?<br><br>" +
                    updates.replace(/\n/g, "<br>"),
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes, update",
                cancelButtonText: "Cancel",
                allowOutsideClick: false
            }).then((result) => {

                // If user confirms the update
                if (result.isConfirmed) {

                    // Send PUT request to backend with updated data
                    let updateResponse = setDataAjaxGetRequest(url, "PUT", dataOb);

                    // If update is successful
                    if (updateResponse === "OK") {

                        // Show success message
                        Swal.fire({
                            title: "Updated!",
                            text: "Record updated successfully!",
                            icon: "success"
                        }).then(() => {
                            onSuccess(); // Execute callback after successful update
                        });

                    } else {

                        // Show error message if update fails
                        Swal.fire({
                            title: "Error!",
                            text: "Update not completed. Error: " + updateResponse,
                            icon: "error"
                        });
                    }
                }
            });
        }

    } else {

        // Show validation error messages
        Swal.fire({
            title: "Validation Error!",
            html: "Update not completed.<br><br>" +
                errors.replace(/\n/g, "<br>"),
            icon: "warning"
        });
    }
}

const validateFile = (element, object, property, priviewid) => {
    // log selected files for debugging
    console.log(element.files);

    // get the first selected file
    let file = element.files[0];

    // create a FileReader to read the file
    let fileReader = new FileReader();

    // on file load, set preview and store as base64
    fileReader.onload = (event) => {
        priviewid.src = event.target.result;       // show image in preview
        object[property] = btoa(event.target.result);  // store as base64
    }

    // read file as Data URL
    fileReader.readAsDataURL(file);
}

// load select option with two attributes
const loadSelectOptionsWithTwoAttributes = (
    element,            // select element eka
    dataList,           // load karanna ona object array eka
    message,            // default option message eka
    valueAttribute,     // option value ekata use karana attribute eka
    property1,          // display karana palaweni attribute eka
    property2,          // display karana deweni attribute eka
    separator         // attributes dekata athara danna text eka

) => {

    // select eke thiyena old options clear karanawa
    element.innerHTML = "";


    // default option eka create karanawa
    if (message != "") {

        let optionMsg = document.createElement("option");

        optionMsg.value = "";          // value empty karanawa
        optionMsg.selected = true;     // default select karanawa
        optionMsg.disabled = true;     // select karanna bari karanawa
        optionMsg.innerText = message; // display message eka set karanawa

        element.appendChild(optionMsg);
    }


    // data list eke objects tika loop karanawa
    dataList.forEach(dataOb => {

        // new option ekak create karanawa
        let option = document.createElement("option");


        // full object eka JSON string karala value ekata danna
        option.value = JSON.stringify(dataOb);

        // attributes dekama ekathu karala display text eka hadanawa
        option.innerText =
            dataOb[property1] +
            separator +
            dataOb[property2]?.name;


        // hadapu option eka select ekata add karanawa
        element.appendChild(option);

    });

}

const clearFormData = (formId, objectName = null) => {

    // form eke id eka use karala form eka hoyagannawa
    let form = document.getElementById(formId);

    if (form != null) {

        // form eke thiyena normal input values okkoma clear karanawa
        form.reset();

        // form eke input, select, textarea elements okkoma gannawa
        let elements = form.querySelectorAll("input, select, textarea");

        elements.forEach(element => {

            // clear karapu passe validation border eka default color ekata set karanawa
            element.style.border = "1.5px solid rgb(164, 201, 232)";

            // select2 use karana select ekak nam value eka clear karanawa
            if ($(element).hasClass("select2-hidden-accessible")) {
                // select2 selected value eka remove karanawa
                $(element).val(null).trigger("change");

                // select2 container border eka default ekata set karanawa
                $(element)
                    .next(".select2-container")
                    .find(".select2-selection")
                    .css("border", "1.5px solid rgb(164, 201, 232)");
            }

        });

        // dynamic widihata add karapu select values reset karanawa
        form.querySelectorAll("select").forEach(select => {
            // mulin thiyena default option eka select karanawa
            select.selectedIndex = 0;

        });
        // form eke image preview elements hoyagannawa
        let images = form.querySelectorAll("img");

        images.forEach(img => {

            // upload karapu photo eka remove karala
            // default photo eka aye pennanawa
            img.src = defaultPhoto;

        });
        // file input fields hoyagannawa
        let fileInputs = form.querySelectorAll("input[type='file']");
        fileInputs.forEach(file => {

            // selected file eka remove karanawa
            file.value = "";

        });
    }
    // object name eka pass karala thiyenawanam object eka empty karanawa
    if (objectName != null) {

        // old data remove karala aluth empty object ekak hadanawa
        window[objectName] = {};

    }

}