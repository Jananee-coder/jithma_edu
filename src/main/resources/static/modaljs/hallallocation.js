//browser load event – page eka reload wenakota db eken hall allocation data okkoma update wenawa.
//eka nisa hall allocation table eka refresh wenna reusable function ekak hadala use karanawa.
//me function eka submission, update, delete awasthawal di call karanawa.
//advantage – code reusability ekak tiyenawa, code eka simple wenawa.

//browser load event
window.addEventListener("load", () => {

    $('.js-example-basic-single').select2({
        theme: "bootstrap-5",
        width: '100%'
    });

    // Logged-in user ta HALL ALLOCATION module eka sambandha permissions ganna
    userPrivilege = getDataAjaxGetRequest("/userprivilegebymodule?modulename=HALLALLOCATION")

    //call table refresh function
    loadHallAllocationTable();
    //call form refresh function
    loadHallAllocationForm();
});
//select elements catch karanawa
let selectBatch = document.querySelector("#selectBatch");
let selectHall = document.querySelector("#selectHall");
let selectType = document.querySelector("#selectType");
let selectWeekday = document.querySelector("#selectWeekday");
let dateAllocate = document.querySelector("#dateAllocate");
let startTime = document.querySelector("#startTime");
let endTime = document.querySelector("#endTime");
let selectStatus = document.querySelector("#selectStatus");
let hallAllocationStatusLabel = document.querySelector("#hallAllocationStatusLabel");
let hallAllocationStatuSelect = document.querySelector("#hallAllocationStatuSelect");
let tabFormButton = document.querySelector("#tabFormButton");


// allocation type handle function
const handleAdditionalType = () => {

    // additional type nam date field enable karanawa
    if (hallallocation.allocationtype_id.name === "Additional") {
        dateAllocate.disabled = false;
        dateAllocate.required = true;

    } else {
        dateAllocate.disabled = true;
        dateAllocate.value = "";
    }

}


//allocation status color display karanna function eka
const getAllocationStatus = (dataOb) => {
    const allocationstatus = dataOb.allocationstatus_id.name;

    if (allocationstatus === "Active") {
        return `<span style="color: green; font-weight: bold;">${allocationstatus}</span>`;
    }
    if (allocationstatus === "Cancelled") {
        return `<span style="color: red; font-weight: bold;">${allocationstatus}</span>`;
    }

    return `<span>${allocationstatus}</span>`;
}
//allocation batch name set
const getBatchName = (dataOb) => {
    return dataOb.batch_id.batchname;
}
//allocation hall name set
const getHall = (dataOb) => {
    return dataOb.hall_id.name;
}
//allocation type name set
const getAllocationType = (dataOb) => {
    return dataOb.allocationtype_id.name;
}


//hall allocation table load karanna function eka
const loadHallAllocationTable = () => {

    // empty array ekak hadanawa halls hold karanna
    hallAllocations = new Array();

    // backend eken hall allocations okkoma gannawa
    hallAllocations = getDataAjaxGetRequest("/hallallocation/alldata");

    //table display columns define karanawa
    let displayColumns = [
        { property: getBatchName, dataType: "function" },
        { property: getHall, dataType: "function" },
        { property: getAllocationType, dataType: "function" },
        { property: getAllocationStatus, dataType: "function" },
    ];

    //reusable table load function eka call karanawa
    loadTableData(tableBodyHallAllocation, hallAllocations, displayColumns, printHallAllocation, editHallAllocation, deleteHallAllocation);

    for (const index in hallAllocations) {
        // Update permission naththm – update button hide karanawa
        if (!userPrivilege.privi_update) {
            tableBodyHallAllocation.children[index].children[5].children[1].style.display = "none";
        }
        // Delete permission naththm – delete button hide karanawa
        if (!userPrivilege.privi_delete) {
            tableBodyHallAllocation.children[index].children[5].children[2].style.display = "none";
        }
    }
    //datatable activate karanawa (bootstrap/jquery)
    $("#tableHallAllocation").dataTable();
}

// define form load karanna 
const loadHallAllocationForm = () => {
    tabFormButton.innerText = "Add Hall Allocation";

    // form eka reset karanawa(input walata dapu values okkoma clear wenawa)
    formAllocation.reset();

    //empty object ekak hadanwa
    hallallocation = new Object();
    // why -Vaild value tika collect krala backend ekata pass krnna ona.
    // one by one pass krnawata wada object eka pass krna eka lesi.

    //batch list
    batches = getDataAjaxGetRequest("/batch/alldata");
    loadSelectOptions(selectBatch, batches, "Select Batch..!", "batchname");

    //hall list
    halls = getDataAjaxGetRequest("/hall/alldata");
    loadSelectOptions(selectHall, halls, "Select Hall..!", "name");

    //allocation type list
    allocationtypes = getDataAjaxGetRequest("/allocationtype/alldata");
    loadSelectOptions(selectType, allocationtypes, "Select Hall Allocation Type..!", "name");

    // weekday list 
    let weekdays = getDataAjaxGetRequest("/weekday/alldata");
    loadSelectOptions(selectWeekday, weekdays, "Select Weekday...!", "name");

    //allocation status list
    let allocationstatuses = getDataAjaxGetRequest("/allocationstatus/alldata");
    loadSelectOptions(selectStatus, allocationstatuses, "Select Hall Allocation Status..!", "name");

    //fill strat time through batch strat time


    //db ekata active widihata status eka pass krnawa
    hallallocation.allocationstatus_id = { id: 1, name: "Active" };
    selectStatus.value = JSON.stringify(hallallocation.allocationstatus_id);

    // Hide allocation Status label and select
    hallAllocationStatusLabel.style.display = "none";
    hallAllocationStatuSelect.style.display = "none";

    // userta ta insert privilege naththam form buttons hide karanawa
    if (!userPrivilege.privi_insert) {
        tabFormButton.style.display = "none";   // "Add New" button hide
        buttonSubmit.style.display = "none";    // "Save" button hide
    }
    // buttons control karanawa
    buttonUpdate.style.display = "none"; // update button hide
    buttonSubmit.style.display = "block"; // submit button show


    // form eke tiyena input, select, radio okkoma border colour / UI reset karanawa
    setUIColour([selectBatch, selectHall, selectType, selectWeekday, dateAllocate, startTime, endTime, selectStatus]);
    let tableTab = new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabTableArea"]'));
    tableTab.show(); // form tab hide karanna epa, table tab activate wenawa

}

const printHallAllocation = (dataOb) => {
    hallallocation = dataOb;
    // print details table fill karanawa (modal eka assume karanawa)
    tdBatchname.innerText = hallallocation.batch_id.batchname;
    tdHallname.innerText = hallallocation.hall_id.name;
    tdAllocationType.innerText = hallallocation.allocationtype_id.name;
    tdWeekday.innerText = hallallocation.weekday_id.name;
    tdDate.innerText = hallallocation.date;
    tdStartTime.innerText = hallallocation.starttime;
    tdEndTime.innerText = hallallocation.endtime;
    tdHallAllocationStatus.innerText = hallallocation.allocationstatus_id.name;

    $("#modalHallAllocationPrint").modal("show");
}

// Print button eka click karama call wenna function eka
const buttonPrint = () => {
    // Aluth tab ekak open karanawa
    const newTab = window.open();
    // Print page eka create karanawa
    newTab.document.writeln(
        "<html><head><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'><title>Print Hall Allocations Detail</title></head>" +
        "<body>" +
        "<h2>Print Hall Allocations Details</h2>" +
        tablePrintHallAllocation.outerHTML +
        "</body></html>"
    );
    // Document eka close karanawa
    newTab.document.close();

    // interval ekak set kara mili second 250 kin - print eka click karama 250ms thiyala tab eka open wenawa.
    // eeta passe print page eka close karama mulu new tab ekama close wenawa.
    setTimeout(() => {
        newTab.print();
        newTab.close();
    }, 250);
    // Bootstrap modal eka hide karanawa
    $("#modalHallAllocationPrint").modal("hide");
}
// define edit function for Hall Allocation
const editHallAllocation = (dataOb) => {

    // deep copy karanawa, reference issue nisa
    // hallallocation, oldHallAllocation eke reference ekama nisa direct assign karama update track karanna ba
    hallallocation = JSON.parse(JSON.stringify(dataOb));
    oldHallAllocation = JSON.parse(JSON.stringify(dataOb));

    // open Add Hall Allocation tab
    new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabFormArea"]')).show();
    tabFormButton.innerText = "Update Hall Allocation";

    // refill form fields from object
    selectBatch.value = JSON.stringify(hallallocation.batch_id);
    selectBatch.disabled = true;
    selectHall.value = JSON.stringify(hallallocation.hall_id);
    selectType.value = JSON.stringify(hallallocation.allocationtype_id);
    selectWeekday.value = JSON.stringify(hallallocation.weekday_id);
    dateAllocate.value = hallallocation.date;
    startTime.value = hallallocation.starttime;
    endTime.value = hallallocation.endtime;

    // hall allocation status visible and refill
    hallAllocationStatusLabel.style.display = "block";
    hallAllocationStatuSelect.style.display = "block";
    selectStatus.value = JSON.stringify(hallallocation.allocationstatus_id);

    // buttons control
    buttonSubmit.style.display = "none";  // hide submit
    buttonUpdate.style.display = "block"; // show update
    buttonClear.style.display = "none";  // clear button hide
}

// define checkAllocationFormError
const checkAllocationFormError = () => {

    // validation errors store karaganna variable ekak
    let errors = "";

    // batch validation
    if (hallallocation.batch_id == null) {
        errors += "Please select Batch Name. This field is required.<br>";
        selectBatch.style.border = "1px solid red";
    }

    // hall validation
    if (hallallocation.hall_id == null) {
        errors += "Please select Hall. This field is required.<br>";
        selectHall.style.border = "1px solid red";
    }

    // allocation type validation
    if (hallallocation.allocationtype_id == null) {
        errors += "Please select Hall Type. This field is required.<br>";
        selectType.style.border = "1px solid red";
    }

    // weekday validation
    if (hallallocation.weekday_id == null) {
        errors += "Please select Weekday. This field is required.<br>";
        selectWeekday.style.border = "1px solid red";
    }

    // date validation (only for Additional type)
    if (hallallocation.allocationtype_id.name === "Additional" &&
        hallallocation.date == null
    ) {
        errors += "Please enter Date. This field is required for Additional allocation.<br>";
        dateAllocate.style.border = "1px solid red";
    }

    // start time validation
    if (hallallocation.starttime == null) {
        errors += "Please enter Start-time. This field is required.<br>";
        startTime.style.border = "1px solid red";
    }

    // end time validation
    if (hallallocation.endtime == null) {
        errors += "Please enter End-time. This field is required.<br>";
        endTime.style.border = "1px solid red";
    }

    // final error string eka return karanawa
    return errors;
}

//hall submission function
const buttonHallAllocationSubmit = () => {
    // common insert function eka call karanawa
    submitWithConfirm(checkAllocationFormError, hallallocation, "/hallallocation/insert", () => {
        // success unama passe form eka reset + table reload
        loadHallAllocationForm();
        loadHallAllocationTable();

    });
}

// define function to get changes in Hall Allocation form
const checkHallAllocationFormUpdate = () => {
    let updates = "";

    // check hallallocation objects exist
    if (hallallocation != null && oldHallAllocation != null) {

        // batch name change
        /* if (hallallocation.batch_id.batchname !== oldHallAllocation.batch_id.batchname) {
            updates += "Batch changed: " + oldHallAllocation.batch_id.batchname + " --> " + hallallocation.batch_id.batchname + "\n";
        }*/
        // hall name change
        if (hallallocation.hall_id.name !== oldHallAllocation.hall_id.name) {
            updates += "Hall changed: " + oldHallAllocation.hall_id.name + " --> " + hallallocation.hall_id.name + "\n";
        }

        // allocation type change
        if (hallallocation.allocationtype_id.name !== oldHallAllocation.allocationtype_id.name) {
            updates += "Allocation Type changed: " + oldHallAllocation.allocationtype_id.name + " --> " + hallallocation.allocationtype_id.name + "\n";
        }

        // weekday change
        if (hallallocation.weekday_id.name !== oldHallAllocation.weekday_id.name) {
            updates += "Weekday changed: " + oldHallAllocation.weekday_id.name + " --> " + hallallocation.weekday_id.name + "\n";
        }

        // date change
        if (hallallocation.date !== oldHallAllocation.date) {
            updates += "Date changed: " + oldHallAllocation.date + " --> " + hallallocation.date + "\n";
        }

        // start time change
        if (hallallocation.starttime !== oldHallAllocation.starttime) {
            updates += "Start Time changed: " + oldHallAllocation.starttime + " --> " + hallallocation.starttime + "\n";
        }

        // end time change
        if (hallallocation.endtime !== oldHallAllocation.endtime) {
            updates += "End Time changed: " + oldHallAllocation.endtime + " --> " + hallallocation.endtime + "\n";
        }

        // allocation status change
        if (hallallocation.allocationstatus_id.name !== oldHallAllocation.allocationstatus_id.name) {
            updates += "Allocation Status changed: " + oldHallAllocation.allocationstatus_id.name + " --> " + hallallocation.allocationstatus_id.name + "\n";
        }
    }

    // return updates
    return updates;
}

// hall allocation update submission function
const buttonHallAllocationUpdate = () => {

    // common update function call
    updateWithConfirm(checkAllocationFormError, checkHallAllocationFormUpdate, hallallocation, "/hallallocation/update", () => {

        // success unama form reset + table reload
        loadHallAllocationForm();
        loadHallAllocationTable();
    });
}

//define delete function
const deleteHallAllocation = (dataOb) => {
    // data object eka local variable ekakata assign karanawa
    const hallallocation = dataOb;
    // SweetAlert eke pennanna one message eka hadanawa
    const message =
        "<b>Batch :</b> " + hallallocation.batch_id.batchname + "<br>" +
        "<b>Allocation Type :</b> " + hallallocation.allocationtype_id.name;

    // common delete function eka call karanawa
    deleteWithConfirm(hallallocation, message, "/hallallocation/delete", () => {
        // success unama passe form eka reset + table reload
        loadHallAllocationForm();
        loadHallAllocationTable();

    });
}

const allocationWithBatchDetails = () => {

    // batch select value empty da kiyala check karanawa
    if (!selectBatch.value) return;

    // batch object eka parse karanawa
    let batch = JSON.parse(selectBatch.value);

    // default type = Normal auto set karanawa
    let type = { id: 1, name: "Normal" };

    selectType.value = JSON.stringify(type);
    hallallocation.allocationtype_id = type;

    // batch data set karanawa
    startTime.value = batch.starttime;
    endTime.value = batch.endtime;
    selectWeekday.value = JSON.stringify(batch.weekday_id);

    hallallocation.batch_id = batch;
    hallallocation.starttime = batch.starttime;
    hallallocation.endtime = batch.endtime;
    hallallocation.weekday_id = batch.weekday_id;

    // UI green border (success)
    selectBatch.style.border = "2px solid green";
    selectType.style.border = "2px solid green";
    startTime.style.border = "2px solid green";
    endTime.style.border = "2px solid green";
    selectWeekday.style.border = "2px solid green";

    // date disable (Normal nisa)
    dateAllocate.disabled = true;
    dateAllocate.value = "";
};