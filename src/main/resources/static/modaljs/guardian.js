//browser refresh event – page eka reload wenakota db eken guardian data okkoma update wenawa.
//eka nisa guardian table eka refresh wenna reusable function ekak hadala use karanawa.
//me function eka submission, update, delete awasthawal di call karanawa.
//advantage – code reusability ekak tiyenawa, code eka simple wenawa.

//browser load event
window.addEventListener("load", () => {

    // Logged-in user ta GUARDIAN module eka sambandha permissions ganna
    userPrivilege = getDataAjaxGetRequest("/userprivilegebymodule?modulename=GUARDIAN")

    //call table refresh function
    loadGuardianTable();
    //call form refresh function
    loadGuardianForm();
});


let textGuardianName = document.querySelector("#textGuardianName");
let textGuardianNic = document.querySelector("#textGuardianNic");
let selectGuardianType = document.querySelector("#selectGuardianType");
let selectGuardianStatus = document.querySelector("#selectGuardianStatus");
let otherTypeRow = document.querySelector("#otherTypeRow");
let tabFormButton = document.querySelector("#tabFormButton");
let guardianStatusLabel = document.querySelector("#guardianStatusLabel");
let guardianStatusSelect = document.querySelector("#guardianStatusSelect");
let otherGuardianType = document.querySelector("#otherGuardianType");

// Save typed "Other" guardian value
otherGuardianType.addEventListener("input", () => {
    guardian.otherguardian = otherGuardianType.value.trim();
});

const handleSelectedOtherGuardian = () => {

    // dropdown eken selected wena value eka JSON string nisa
    // eka object ekakata convert karagannawa
    const selectedValue = JSON.parse(selectGuardianType.value);

    // selected guardian type eka "Other" da kiyala check karanawa
    if (selectedValue.name === "Other") {

        // "Other" selected nam textbox eka show karanawa
        otherTypeRow.hidden = false;

        // textbox eka required karanawa (empty submit karanna ba)
        otherGuardianType.required = true;

        // guardian object ekata select karapu type eka assign karanawa
        guardian.guardiantype_id = selectedValue;

    } else {

        // "Other" naththam textbox eka hide karanawa
        otherTypeRow.hidden = true;

        // textbox eka required nathikara gannawa
        otherGuardianType.required = false;

        // textbox eka clear karanawa
        otherGuardianType.value = "";

        // guardian object ekata normal guardian type eka assign karanawa
        guardian.guardiantype_id = selectedValue;

        // "Other" value eka api use karanne nathi nisa null karanawa
        guardian.otherguardian = null;
    }
}

// Define Guardian Status Function
const getGuardianType = (dataOb) => {

    // guardian type "Other" da kiyala check karanawa
    // saha user type karapu otherguardian value ekak thiyenawada balala validate karanawa
    if (
        dataOb.guardiantype_id.name === "Other" &&
        dataOb.otherguardian != null &&
        dataOb.otherguardian !== ""
    ) {
        // nam type eka "Other" nam
        // user type karapu value eka (ex: Uncle) table eke show karanawa
        return dataOb.otherguardian;
    }

    // "Father", "Mother", "Grandfather" wage normal types walata
    // direct DB eken ena name eka show karanawa
    return dataOb.guardiantype_id.name;
}

// Define Guardian Status Function
const getGuardianStatus = (dataOb) => {
    const guardianstatus = dataOb.guardianstatus_id.name;

    if (guardianstatus === "Active") {
        return `<span style="color: green; font-weight: bold;">${guardianstatus}</span>`;
    }
    if (guardianstatus === "In-Active") {
        return `<span style="color: orange; font-weight: bold;">${guardianstatus}</span>`;
    }

    // Unknown guardianstatus
    return `<span>${guardianstatus}</span>`;
}

//define loadGuardianTable
const loadGuardianTable = () => {
    // create empty array for catch many objects 
    guardians = new Array();

    // backend eken guardian okkoma gannawa
    guardians = getDataAjaxGetRequest("/guardian/alldata");

    guardians.reverse();//decending kra

    //string-string,numbers,date
    //function-object,array,boolean,image
    //create property array
    let displayColumns = [
        { property: "guardianname", dataType: "string" },
        { property: "nic", dataType: "string" },
        { property: "mobileno", dataType: "string" },
        { property: getGuardianType, dataType: "function" },
        { property: getGuardianStatus, dataType: "function" },
    ];

    // Call loadTableData function
    loadTableData(tableBodyGuardian, guardians, displayColumns, printGuardian, editGuardian, deleteGuardian);

    for (const index in guardians) {
        // Update permission naththm – update button hide karanawa
        if (!userPrivilege.privi_update) {
            tableBodyGuardian.children[index].children[6].children[1].style.display = "none";
        }
        // Delete permission naththm – delete button hide karanawa
        if (!userPrivilege.privi_delete) {
            tableBodyGuardian.children[index].children[6].children[2].style.display = "none";
        }
    }
    $('#tableGuardaian').dataTable();
}

//define  function for guardian form error check
const checkGuardianFormError = () => {
    let errors = ""; // errors collect karanna empty string ekak hadanawa

    // Guardian Name check
    if (guardian.guardianname == null) {
        errors += "Please enter valid Guardian Name. This is a required field.\n";
        textGuardianName.style.border = "1px solid red"; // input field red border
    }
    // NIC check
    if (guardian.nic == null) {
        errors += "Please enter valid Guardian NIC. This is a required field.\n";
        textGuardianNic.style.border = "1px solid red";
    }
    // Mobile number check
    if (guardian.mobileno == null) {
        errors += "Please enter valid Mobile Number. This is a required field.\n";
        textGuardianMobile.style.border = "1px solid red";
    }
    // Guardian Type check
    if (guardian.guardiantype_id == null) {
        errors += "Please select a Guardian Type. This is a required field.\n";
        selectGuardianType.style.border = "1px solid red";
    } else if (guardian.guardiantype_id.name === "Other") {
        // Check 'Other' type value
        if (guardian.otherguardian == null) {
            errors += "Please enter custom Guardian Type. This is required when 'Other' is selected.\n";
            otherGuardianType.style.border = "1px solid red";
        }
    }
    // Address check
    if (guardian.address == null) {
        errors += "Please enter valid Guardian Address. This is a required field.\n";
        textGuAddress.style.border = "1px solid red";
    }
    // Status check
    if (guardian.guardianstatus_id == null) {
        errors += "Please select a Guardian Status. This is a required field.\n";
        selectGuardianStatus.style.border = "1px solid red";
    }

    return errors; // return all errors
}

// define function for guardian form submission
const buttonGuardianSubmit = () => {

    // common insert function eka call karanawa
    submitWithConfirm(checkGuardianFormError, guardian, "/guardian/insert", () => {
        // success unama passe form eka reset + table reload
        loadGuardianForm();
        loadGuardianTable();

    });
}

// Guardian print karanna hadapu function eka define karanawa
const printGuardian = (dataOb) => {
    guardian = dataOb;

    // Guardian details tika modal eke thiyena td walata danna
    tdGuardianName.innerText = guardian.guardianname;
    tdNic.innerText = guardian.nic;
    tdMobile.innerText = guardian.mobileno;
    tdAddress.innerText = guardian.address;
    // Guardian print modal eke type eka hariyata show karanna
    // Type = "Other" nam -> otherguardian value eka (ex: Uncle) show wenawa
    // naththan -> normal guardiantype name eka show wenawa
    tdGuardianType.innerText =
        guardian.guardiantype_id.name === "Other"
            ? guardian.otherguardian
            : guardian.guardiantype_id.name;

    tdGuardianStatus.innerText = guardian.guardianstatus_id.name;

    // Bootstrap modal eka open karanawa
    $("#modalGuardianPrint").modal("show");
}

// Print button eka click karama call wenna function eka
const buttonPrint = () => {

    // Aluth tab ekak open karanawa
    const newTab = window.open();

    // Print page eka create karanawa
    newTab.document.writeln(
        "<html><head><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'><title>Print Guardian</title></head>" +
        "<body>" +
        "<h2>Print Guardian</h2>" +
        tablePrintGuardian.outerHTML +
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
    $("#modalGuardianPrint").modal("hide");
}

// define function to edit guardian records
const editGuardian = (dataOb) => {

    // open Add Guardian tab
    new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabFormArea"]')).show();
    tabFormButton.innerText = "Update Guardian";

    // guardian, oldGuardian direct assign karanna ba.
    // mokada dekama point wenne ekama memory address ekata.
    // e nisa guardian object eka change karama,
    // oldGuardian ekath auto change wenawa.

    // ithin update eka compare karanna ba.
    // e nisa reference eka galawala deep copy ekak hadanawa.

    // JSON.stringify() -> object eka string ekakata convert karanawa.
    // JSON.parse() -> string eka aye object ekakata convert karanawa.
    // deep copy krnna dataOb eka (guardian & oldGuardian)
    guardian = JSON.parse(JSON.stringify(dataOb));
    oldGuardian = JSON.parse(JSON.stringify(dataOb));

    // Guardian Name input eka fill karanawa
    textGuardianName.value = guardian.guardianname;

    // NIC fill karanawa
    textGuardianNic.value = guardian.nic;

    // Mobile number fill karanawa
    textGuardianMobile.value = guardian.mobileno;

    // Address fill karanawa
    textGuAddress.value = guardian.address;

    // Note fill karanawa (optional)
    /* if (guardian.note == null || guardian.note == undefined) {
        textNote.value = "";
    } else {
        textNote.value = guardian.note;
    } */

    // Edit mode eke "Other" type load karanna
    if (guardian.guardiantype_id.name === "Other") {

        // Other input row eka show karanawa
        otherTypeRow.hidden = false;

        // Dropdown eka lock karanawa
        selectGuardianType.readOnly = true;

        // Other input eka required karanawa
        otherGuardianType.required = true;

        // DB eken ena typed value eka input eke load karanawa
        otherGuardianType.value = guardian.otherguardian;
    }

    // Dynamic select elements
    // object eka string format eken assign karanawa
    selectGuardianType.value = JSON.stringify(guardian.guardiantype_id);      // guardian type

    guardianStatusLabel.style.display = "block";
    guardianStatusSelect.style.display = "block";

    // Set the current value from the guardian data
    selectGuardianStatus.value = JSON.stringify(guardian.guardianstatus_id);

    // Buttons control
    buttonSubmit.style.display = "none";  // submit button hide
    buttonUpdate.style.display = "block"; // update button show
    buttonClear.style.display = "none";  // clear button hide
}

// define function to get the changes made in the guardian form
const checkGuardianFormUpdate = () => {
    let updates = "";

    // check karanawa guardian object dekama null nadda kiyala
    if (guardian != null && oldGuardian != null) {

        // guardian name change unada kiyala check karanawa
        if (guardian.guardianname != oldGuardian.guardianname) {
            updates += "Name changed: " + oldGuardian.guardianname + " --> " + guardian.guardianname + "\n";
        }
        // NIC change unada kiyala check karanawa
        if (guardian.nic != oldGuardian.nic) {
            updates += "NIC changed: " + oldGuardian.nic + " --> " + guardian.nic + "\n";
        }
        // mobile number change unada kiyala check karanawa
        if (guardian.mobileno != oldGuardian.mobileno) {
            updates += "Mobile Number changed: " + oldGuardian.mobileno + " --> " + guardian.mobileno + "\n";
        }
        // guardian type change unada kiyala check karanawa
        if (guardian.guardiantype_id.name !== oldGuardian.guardiantype_id.name ||
            (guardian.guardiantype_id.name === "Other" && guardian.otherguardian !== oldGuardian.otherguardian)) {

            let oldType = oldGuardian.guardiantype_id.name === "Other" ? oldGuardian.otherguardian : oldGuardian.guardiantype_id.name;
            let newType = guardian.guardiantype_id.name === "Other" ? guardian.otherguardian : guardian.guardiantype_id.name;

            updates += "Guardian Type changed: " + oldType + " --> " + newType + "\n";
        }
        // address change unada kiyala check karanawa
        if (guardian.address != oldGuardian.address) {
            updates += "Address changed: " + oldGuardian.address + " --> " + guardian.address + "\n";
        }
        // guardian status change unada kiyala check karanawa
        if (guardian.guardianstatus_id.name != oldGuardian.guardianstatus_id.name) {
            updates += "Status changed: " + oldGuardian.guardianstatus_id.name + " --> " + guardian.guardianstatus_id.name + "\n";
        }
    }
    // all updates return karanawa
    return updates;
}

// define function for update guardian records
const buttonGuardianUpdate = () => {
    console.log(guardian); // console ekata guardian object eka print karanawa

    // common update function eka call karanawa
    updateWithConfirm(checkGuardianFormError, checkGuardianFormUpdate, guardian, "/guardian/update", () => {
        // success unama passe form eka reset + table reload
        loadGuardianForm();
        loadGuardianTable();
    });
}

//show Guardian form tab
const showGuardianFormTab = () => {

    new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabFormArea"]')).show();
    // tab eke button text set karanna
    tabFormButton.innerText = "Add Guardian";
    loadGuardianForm();

}

// define method for guardian delete 
const deleteGuardian = (dataOb) => {

    // data object eka local variable ekakata assign karanawa
    const guardian = dataOb;

    // delete confirm msg ekak hadanawa (guardian details tika pennanna)
    const message =
        "<b>Name:</b> " + guardian.guardianname + "<br>" +
        "<b>NIC:</b> " + guardian.nic + "<br>" +
        "<b>Mobile:</b> " + guardian.mobileno + "<br>" +
        "<b>Type:</b> " + guardian.guardiantype_id.name;

    // common delete function eka call karanawa
    deleteWithConfirm(guardian, message, "/guardian/delete", () => {
        // success unama passe form eka reset + table reload
        loadGuardianForm();  // Form eka clear karanawa
        loadGuardianTable(); // Table eka refresh karanawa

    });
}

// define function to load guardian form
const loadGuardianForm = () => {

    tabFormButton.innerText = "Add Guardian";

    // form eka reset karanawa (input walata dapu values okkoma clear wenawa)
    formGuardian.reset();

    // empty object ekak hadanawa → data binding walata use wenna
    guardian = new Object();
    // why -Vaild value tika collect krala backend ekata pass krnna ona.
    // one by one pass krnawata wada object eka pass krna eka lesi.

    // guardiantypes list ekak hadanawa (array of objects)
    // DB eken okkoma guardiantypes ganna -> dropdown ekata load karanna
    let guardiantypes = getDataAjaxGetRequest("/guardiantype/alldata");
    loadSelectOptions(selectGuardianType, guardiantypes, "Select Guardian Type...!", "name");

    // guardianstatuses list ekak hadanawa (array of objects)
    // DB eken okkoma guardianstatuses ganna -> dropdown ekata load karanna
    let guardianstatuses = getDataAjaxGetRequest("/guardianstatus/alldata");
    loadSelectOptions(selectGuardianStatus, guardianstatuses, "Select Guardian Status...!", "name");

    guardian.guardianstatus_id = { id: 1, name: "Active" };
    selectGuardianStatus.value = JSON.stringify(guardian.guardianstatus_id);

    // Hide Guardian Status label and select
    guardianStatusLabel.style.display = "none";
    guardianStatusSelect.style.display = "none";

    // userta ta insert privilege naththam form buttons hide karanawa
    if (!userPrivilege.privi_insert) {
        tabFormButton.style.display = "none";   // "Add New" button hide
        buttonSubmit.style.display = "none";    // "Save" button hide
    }

    // buttons control karanawa
    buttonUpdate.style.display = "none"; // update button hide
    buttonSubmit.style.display = "block"; // submit button show

    // form eke tiyena input, select, radio okkoma border colour / UI reset karanawa
    setUIColour([textGuardianName, textGuardianNic, textGuardianMobile, selectGuardianType, textGuAddress, selectGuardianStatus]);
    let tableTab = new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabTableArea"]'));
    tableTab.show(); // form tab hide karanna epa, table tab activate wenawa

}

// Guardian NIC validate karana function eka define karanawa
const guardianNicValidator = () => {

    // User enter karana Guardian NIC eka gannawa
    let nic = textGuardianNic.value;

    // NIC format validate karana regex
    let regPattern = new RegExp("^((([6][56789][0-9]{7}[VvXxSs])|([7-9][0-9]{8}[VvXxSs]))|([0-9]{12}))$");

    // NIC valid nam
    if (regPattern.test(nic)) {

        // valid → green border
        textGuardianNic.style.border = "2px solid green";

        // Guardian object ekata NIC eka bind karanawa
        guardian.nic = nic;

        // birth year saha day count gannawa
        let birthYear = "";
        let dayCount = "";

        if (nic.length == 10) {
            // old NIC
            birthYear = "19" + nic.substring(0, 2);
            dayCount = nic.substring(2, 5);

        } else {
            // new NIC
            birthYear = nic.substring(0, 4);
            dayCount = nic.substring(4, 7);
        }
        // day count integer ekakata convert karanawa
        let dayNumber = parseInt(dayCount);

        // female nam
        if (dayNumber > 500) {
            dayNumber -= 501;
        }
        // DOB calculate karanawa
        let dob = new Date(birthYear, 0);
        dob.setDate(dayNumber);

        // age calculate karanawa
        let today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        if (
            today.getMonth() < dob.getMonth() ||
            (today.getMonth() == dob.getMonth() &&
                today.getDate() < dob.getDate())
        ) {
            age--;
        }
        // Guardian age eka 18 ta adu nam invalid
        if (age < 18) {

            textGuardianNic.style.border = "2px solid red";

            guardian.nic = null;

            alert("Guardian age must be 18 years or above.");
            return;
        }
    } else {
        // NIC invalid nam
        textGuardianNic.style.border = "2px solid red";

        guardian.nic = null;
    }
}