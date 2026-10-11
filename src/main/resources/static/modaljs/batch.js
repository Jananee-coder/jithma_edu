//browser load event – page eka reload wenakota db eken batch data okkoma update wenawa.
//eka nisa batch table eka refresh wenna reusable function ekak hadala use karanawa.
//me function eka submission, update, delete awasthawal di call karanawa.
//advantage – code reusability ekak tiyenawa, code eka simple wenawa.

//browser load event
window.addEventListener("load", () => {

    $('.js-example-basic-single').select2({
        theme: "bootstrap-5",
        width: '100%'
    });


    // Logged-in user ta BATCH module eka sambandha permissions ganna
    userPrivilege = getDataAjaxGetRequest("/userprivilegebymodule?modulename=BATCH")
    //call table refresh function
    loadBatchTable();
    //call form refresh function
    loadBatchForm();

    // function call yeardropdown
    yearGenerate();

    yearDropdown.addEventListener("change", generateBatchName);
    selectClassName.addEventListener("change", generateBatchName);
    selectWeekday.addEventListener("change", generateBatchName);
    selectClassType.addEventListener("change", generateBatchName);

    radioSc20.addEventListener("change", () => {
        calculateServiceCharge(20);
    });

    radioSc25.addEventListener("change", () => {
        calculateServiceCharge(25);
    });
    radioSc30.addEventListener("change", () => {
        calculateServiceCharge(30);
    });
});

let textBatchName = document.querySelector("#textBatchName");
let yearDropdown = document.querySelector("#yearDropdown");
let selectClassName = document.querySelector("#selectClassName");
let selectClassType = document.querySelector("#selectClassType");
let textMonthlyFee = document.querySelector("#textMonthlyFee");
let textServiceCharge = document.querySelector("#textServiceCharge");
let textFreeCard = document.querySelector("#textFreeCard");
let textDuration = document.querySelector("#textDuration");
let selectWeekday = document.querySelector("#selectWeekday");
let dateStart = document.querySelector("#dateStart");
let timeStart = document.querySelector("#timeStart");
let timeEnd = document.querySelector("#timeEnd");
let selectBatchStatus = document.querySelector("#selectBatchStatus");
let batchStatusLabel = document.querySelector("#batchStatusLabel");
let batchStatusSelect = document.querySelector("#batchStatusSelect");
let tabFormButton = document.querySelector("#tabFormButton");
let radioSc25 = document.querySelector("#radioSc25");
let radioSc30 = document.querySelector("#radioSc30");
let radioSc20 = document.querySelector("#radioSc20");


// batch status eka color ekakin display karanna function eka
const getBatchStatus = (dataOb) => {
    const batchstatus = dataOb.batchstatus_id.name;

    if (batchstatus === "Active") {
        return `<span style="color: green; font-weight: bold;">${batchstatus}</span>`;
    }
    if (batchstatus === "In-Active") {
        return `<span style="color: orange; font-weight: bold;">${batchstatus}</span>`;
    }
    if (batchstatus === "Completed") {
        return `<span style="color: gray; font-weight: bold;">${batchstatus}</span>`;
    }

    return `<span>${batchstatus}</span>`;
}

const yearGenerate = () => {
    const currentYear = new Date().getFullYear(); //current year

    const startYear = currentYear;
    const endYear = currentYear + 4; //next 4 years

    yearDropdown.innerHTML = ""; // clear old options

    for (let year = startYear; year <= endYear; year++) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;

        //auto select current year
        if (year === currentYear) {
            option.selected = true;
        }
        yearDropdown.appendChild(option);
    }
    batch.currentyear = currentYear;   // bind default value
    // initial validation - green border
    yearDropdown.style.border = "2px solid green"; // valid kiyana border
}


const generateBatchName = () => {
    // check karanawa year, classname,weekday,class type thiynawada kiyala
    if (batch.currentyear && batch.classdetail_id && batch.weekday_id && batch.classtype_id) {

        // hatharam thiyenawanm, batch name generate karanawa
        batchname = batch.currentyear + " " +
            batch.classdetail_id.classname + " " + batch.weekday_id.name + " " +
            batch.classtype_id.name;

        // text input eka update karanawa
        textBatchName.value = batchname;

        // batch name genarate unama border color change - green
        textBatchName.style.border = '2px solid green';

        // batch object ekata assign karanawa
        batch.batchname = batchname;

    } else {

        // hathren ekak hri naththm empty krnawa
        textBatchName.value = "";
        batch.batchname = null;
    }
}
const calculateServiceCharge = (percentage) => {

    // Monthly Fee value eka gannawa
    let monthlyFee = Number(textMonthlyFee.value);

    // Monthly Fee thiyenawanam calculate karanawa
    if (monthlyFee > 0) {
        let servicecharge = (monthlyFee * percentage) / 100;

        // input value set
        textServiceCharge.value = servicecharge;
        // batch object bind
        batch.servicecharge = servicecharge;
        // validation border
        textServiceCharge.style.border = "2px solid green";

    }
}
// batch table load karanna function eka
const loadBatchTable = () => {
    // sample batch data hadanawa (db eken ganna eka simulate karanawa)
    batches = new Array();
    // backend eken batche okkoma gannawa
    batches = getDataAjaxGetRequest("/batch/alldata");
    batches.reverse();//decending kra

    //string-string,numbers,date
    //function-object,array,boolean,image
    //create property array
    // table display karanna columns define karanawa
    let displayColumns = [
        { property: "batchname", dataType: "string" },
        { property: "monthfee", dataType: "string" },
        { property: getBatchStatus, dataType: "function" },
    ];

    // reusable table load function eka call karanawa
    loadTableData(tableBodyBatch, batches, displayColumns, printBatch, editBatch, deleteBatch);

    // datatable activate karanawa
    $("#tableBatch").dataTable();

    for (const index in batches) {
        // Update permission naththm – update button hide karanawa
        if (!userPrivilege.privi_update) {
            tableBodyBatch.children[index].children[4].children[1].style.display = "none";
        }
        // Delete permission naththm – delete button hide karanawa
        if (!userPrivilege.privi_delete) {
            tableBodyBatch.children[index].children[4].children[2].style.display = "none";
        }
    }
}

//show batch form tab
const showBatchFormTab = () => {

    new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabFormArea"]')).show();
    // tab eke button text set karanna
    tabFormButton.innerText = "Add Batch";
    loadBatchForm();

}

// batch form define
const loadBatchForm = () => {
    //tab button
    tabFormButton.innerText = "Add Batch";

    // form eka reset karanawa(input walata dapu values okkoma clear wenawa)
    formBatch.reset();

    // enable all disabled fields when opening Add Batch form
    yearDropdown.disabled = false;
    selectClassName.disabled = false;
    selectWeekday.disabled = false;
    selectClassType.disabled = false;

    // radio buttons enable
    radioSc20.disabled = false;
    radioSc25.disabled = false;
    radioSc30.disabled = false;

    // empty object ekak hadanawa
    batch = new Object();
    // why -Vaild value tika collect krala backend ekata pass krnna ona.
    // one by one pass krnawata wada object eka pass krna eka lesi.

    // Allow only today and future dates
    dateStart.min = new Date().toISOString().split("T")[0];

    //active classdetailnames  list- classdetail/activeclassdetailnames
    activeclassnameList = getDataAjaxGetRequest("/classdetail/activeclassdetailnames");
    loadSelectOptions(selectClassName, activeclassnameList, "Select Class Name...!", "classname");

    // weekday list 
    // DB eken okkoma weekdays ganna -> dropdown ekata load karanna
    let weekdays = getDataAjaxGetRequest("/weekday/alldata");
    loadSelectOptions(selectWeekday, weekdays, "Select Weekday...!", "name");

    // classtype list
    // DB eken okkoma classtypes ganna -> dropdown ekata load karanna
    let classtypes = getDataAjaxGetRequest("/classtype/alldata");
    loadSelectOptions(selectClassType, classtypes, "Select Class Type...!", "name");

    // batch status
    // DB eken okkoma batchstatuses ganna -> dropdown ekata load karanna
    let batchstatuses = getDataAjaxGetRequest("/batchstatus/alldata");
    loadSelectOptions(selectBatchStatus, batchstatuses, "Select Batch Status..!", "name");

    //db ekata active widihata status eka pass krnawa
    batch.batchstatus_id = { id: 1, name: "Active" };
    selectBatchStatus.value = JSON.stringify(batch.batchstatus_id);

    // Hide Batch Status label and select
    batchStatusLabel.style.display = "none";
    batchStatusSelect.style.display = "none";

    // userta ta insert privilege naththam form buttons hide karanawa
    if (!userPrivilege.privi_insert) {
        tabFormButton.style.display = "none";   // "Add New" button hide
        buttonSubmit.style.display = "none";    // "Save" button hide
    }
    // buttons control karanawa
    buttonUpdate.style.display = "none"; // update button hide
    buttonSubmit.style.display = "block"; // submit button show


    // form eke tiyena input, select, radio okkoma border colour / UI reset karanawa
    setUIColour([textBatchName, yearDropdown, selectClassName, selectWeekday, selectClassType, textMonthlyFee, radioSc20, radioSc25, radioSc30, textServiceCharge, textFreeCard, textDuration, dateStart, timeStart, timeEnd, selectBatchStatus]);
    let tableTab = new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabTableArea"]'));
    tableTab.show(); // form tab hide karanna epa, table tab activate wenawa
}

// form print karanna function eka
const printBatch = (dataOb) => {
    batch = dataOb;
    // print details table fill karanawa (modal eka assume karanawa)
    tdBatchname.innerText = batch.batchname;
    tdYear.innerText = batch.currentyear;
    tdClassname.innerText = batch.classdetail_id.classname;
    tdWeekday.innerText = batch.weekday_id.name;
    tdClassType.innerText = batch.classtype_id.name;
    tdMonthlyFee.innerText = batch.monthfee;
    tdServiceCharge.innerText = batch.servicecharge;
    tdFreeCard.innerText = batch.freecardp;
    tdDuration.innerText = batch.duration
    tdStartDate.innerText = batch.startdate;
    tdStartTime.innerText = batch.starttime;
    tdEndTime.innerText = batch.endtime;
    tdBatchStatus.innerText = batch.batchstatus_id.name;

    $("#modalBatchPrint").modal("show");
}
// Print button eka click karama call wenna function eka
const buttonPrint = () => {
    // Aluth tab ekak open karanawa
    const newTab = window.open();
    // Print page eka create karanawa
    newTab.document.writeln(
        "<html><head><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'><title>Print Batch Detail</title></head>" +
        "<body>" +
        "<h2>Print Batch Details</h2>" +
        tablePrintBatch.outerHTML +
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
    $("#modalBatchPrint").modal("hide");
}

// batch edit karanna function eka
// define function to edit batch records
const editBatch = (dataOb) => {
    // batch = dataOb;
    // oldBatch = dataOb;
    // mehema use krnna ba mokada methana reference variable wage hasirennne...
    // batch, oldBatch dekama thiyenne ekama memory address eka.
    // e nisa update wunu de hoyaganna ba, dekama enne ekama value.
    // batch object ekata changes karoth,
    // oldBatch ekatath ehema change wenawa (eka object ekak nisa).

    // ithin e nisa reference eka galawanna ona.
    // mehema wela thiyenne object gaththa nisa (object type eke thiyenawa reference ekak).
    // eka string ekakata convert krgannwa (deep copy hadanna).
    // but string ekata convert karama access krnna ba,
    // e nisa eka aye object ekakata path krgnna JSON ekenma.
    // -> JSON.stringify() : object ekata string ekakata hadanawa.
    // -> JSON.parse() : string ekata object ekakata hadanawa.
    // mehema krama eken deep copy ekak hadanawa.

    // open Add Batch tab
    new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabFormArea"]')).show();

    tabFormButton.innerText = "Update Batch";

    batch = JSON.parse(JSON.stringify(dataOb));
    oldBatch = JSON.parse(JSON.stringify(dataOb));


    textBatchName.value = batch.batchname;

    // year dropdown eka fill karanawa
    yearDropdown.value = batch.currentyear;
    yearDropdown.style.border = "1.5px solid rgb(164, 201, 232)";
    yearDropdown.disabled = true;

    // Dynamic select elements
    // object eka string format eken assign karanawa
    //selectClassName.value = batch.classdetail_id.classname;

    loadSelectOptions(selectClassName, activeclassnameList, "Select Class Name...!", "classname", batch.classdetail_id.id);

    //selectClassName.disabled = true;
    selectWeekday.value = JSON.stringify(batch.weekday_id);
    selectWeekday.disabled = true;
    selectClassType.value = JSON.stringify(batch.classtype_id);
    selectClassType.disabled = true;

    // fee related fields fill karanawa
    textMonthlyFee.value = batch.monthfee;

    textMonthlyFee.value = batch.monthfee;
    textServiceCharge.value = batch.servicecharge;


    // calculate UI percentage
    let servicepercentage =
        (batch.servicecharge / batch.monthfee) * 100;


    // select radio button
    if (servicepercentage === 20) {

        radioSc20.checked = true;

    } else if (servicepercentage === 25) {

        radioSc25.checked = true;

    } else if (servicepercentage === 30) {

        radioSc30.checked = true;

    }
    textFreeCard.value = batch.freecardp;
    textDuration.value = batch.duration;

    // date & time fields fill karanawa
    dateStart.value = batch.startdate;
    timeStart.value = batch.starttime;
    timeEnd.value = batch.endtime;



    batchStatusLabel.style.display = "block";
    batchStatusSelect.style.display = "block";

    selectBatchStatus.value = JSON.stringify(batch.batchstatus_id);

    // Buttons control
    buttonSubmit.style.display = "none";  // submit button hide
    buttonUpdate.style.display = "block"; // update button show
    buttonClear.style.display = "none";  // clear button hide
}



// define checkBatchFormError
const checkBatchFormError = () => {

    let errors = "";

    // batchname check
    if (batch.batchname == null) {
        errors += "Batch Name is required..<br>";
        yearDropdown.style.border = "1px solid red";
    }
    // Year dropdown check
    if (batch.currentyear == null) {
        errors += "Please select a valid Year. This field is required.<br>";
        yearDropdown.style.border = "1px solid red";
    }
    // Class selection check
    if (batch.classdetail_id == null) {
        errors += "Please select a Class. This field is required.<br>";
        selectClassName.style.border = "1px solid red";
    }
    // Weekday selection check
    if (batch.weekday_id == null) {
        errors += "Please select a Weekday. This field is required.<br>";
        selectWeekday.style.border = "1px solid red";
    }
    // Class Type selection check
    if (batch.classtype_id == null) {
        errors += "Please select a Class Type. This field is required.<br>";
        selectClassType.style.border = "1px solid red";
    }
    // Monthly Fee check
    if (batch.monthfee == null) {
        errors += "Please enter Monthly Fee. This field is required.<br>";
        textMonthlyFee.style.border = "1px solid red";
    }
    // Service Charge check
    if (batch.servicecharge == null) {
        errors += "Please enter Service Charge. This field is required.<br>";
        textServiceCharge.style.border = "1px solid red";
    }
    // Service Charge Percentage check

    let selectedServiceChargePercentage = document.querySelector(
        "input[name='servicechragep']:checked"
    );

    if (selectedServiceChargePercentage == null) {

        errors += "Please select Service Charge Percentage.<br>";

    }
    // Free Card Percentage check (optional but validate if entered)
    if (batch.freecardp == null) {
        errors += "Please enter free card precentage. This field is required.<br>";
        textFreeCard.style.border = "1px solid red";
    }
    // Duration check
    if (batch.duration == null) {
        errors += "Please enter Duration (Months). This field is required.<br>";
        textDuration.style.border = "1px solid red";
    }
    // Start Date check
    if (batch.startdate == null) {
        errors += "Please select Start Date. This field is required.<br>";
        dateStart.style.border = "1px solid red";
    }
    // Start Time check
    if (batch.starttime == null) {
        errors += "Please select Start Time. This field is required.<br>";
        timeStart.style.border = "1px solid red";
    }
    // End Time check
    if (batch.endtime == null) {
        errors += "Please select End Time. This field is required.<br>";
        timeEnd.style.border = "1px solid red";
    }

    return errors;// errors return karanawa
}
//batch submission function
const buttonBatchSubmit = () => {
    let freeCardInput = parseFloat(textFreeCard.value); // e.g., 25%
    batch.freecardp = freeCardInput / 100; // 25 → 0.25 stored in DB

    // common insert function eka call karanawa
    submitWithConfirm(checkBatchFormError, batch, "/batch/insert", () => {
        // success unama passe form eka reset + table reload
        loadBatchForm();
        loadBatchTable();

    });
}
//define fuction chek updates
const checkBatchFormUpdate = () => {

    let updates = "";

    // check whether both batch objects are not null
    if (batch != null && oldBatch != null) {

        /*  // batch name change check
         if (batch.batchname != oldBatch.batchname) {
             updates += "Batch Name changed: " + oldBatch.batchname + " --> " + batch.batchname + "\n";
         }
         // year change check
         if (batch.currentyear != oldBatch.currentyear) {
             updates += "Year changed: " + oldBatch.currentyear + " --> " + batch.currentyear + "\n";
         }
         // class change check
         if (batch.classdetail_id.classname != oldBatch.classdetail_id.classname) {
             updates += "Class changed: " + oldBatch.classdetail_id.classname + " --> " + batch.classdetail_id.classname + "\n";
         }
         // weekday change check
         if (batch.weekday_id.name != oldBatch.weekday_id.name) {
             updates += "Weekday changed: " + oldBatch.weekday_id.name + " --> " + batch.weekday_id.name + "\n";
         }
         // class type change check
         if (batch.classtype_id.name != oldBatch.classtype_id.name) {
             updates += "Class Type changed: " + oldBatch.classtype_id.name + " --> " + batch.classtype_id.name + "\n";
         } */
        // monthly fee change check
        if (batch.monthfee != oldBatch.monthfee) {
            updates += "Monthly Fee changed: " + oldBatch.monthfee + " --> " + batch.monthfee + "\n";
        }
        // service charge change check
        if (batch.servicecharge != oldBatch.servicecharge) {
            updates += "Service Charge changed: " + oldBatch.servicecharge + " --> " + batch.servicecharge + "\n";
        }
        // free card percentage change check
        if (batch.freecardp != oldBatch.freecardp) {
            updates += "Free Card Percentage changed: " + oldBatch.freecardp + " --> " + batch.freecardp + "\n";
        }
        // duration change check
        if (batch.duration != oldBatch.duration) {
            updates += "Duration changed: " + oldBatch.duration + " --> " + batch.duration + "\n";
        }
        // start date change check
        if (batch.startdate != oldBatch.startdate) {
            updates += "Start Date changed: " + oldBatch.startdate + " --> " + batch.startdate + "\n";
        }
        // start time change check
        if (batch.starttime != oldBatch.starttime) {
            updates += "Start Time changed: " + oldBatch.starttime + " --> " + batch.starttime + "\n";
        }
        // end time change check
        if (batch.endtime != oldBatch.endtime) {
            updates += "End Time changed: " + oldBatch.endtime + " --> " + batch.endtime + "\n";
        }
        // batch status check
        if (batch.batchstatus_id.name != oldBatch.batchstatus_id.name) {
            updates += "Status changed: " +
                oldBatch.batchstatus_id.name + " --> " +
                batch.batchstatus_id.name + "\n";
        }
    }
    // return all update messages
    return updates;
}
//batch submission function
const buttonBatchUpdate = () => {

    // common update function eka call karanawa
    updateWithConfirm(checkBatchFormError, checkBatchFormUpdate, batch, "/batch/update", () => {
        // success unama passe form eka reset + table reload
        loadBatchForm();
        loadBatchTable();

    });
}
// batch delete karanna function eka
const deleteBatch = (dataOb) => {
    // data object eka local variable ekakata assign karanawa
    const batch = dataOb;
    // SweetAlert eke pennanna one message eka hadanawa
    const message =
        "<b>Batch Name:</b> " + batch.batchname;

    // common delete function eka call karanawa
    deleteWithConfirm(batch, message, "/batch/delete", () => {
        // success unama passe form eka reset + table reload
        loadBatchForm();
        loadBatchTable();

    });
}

