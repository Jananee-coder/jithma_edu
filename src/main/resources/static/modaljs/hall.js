//browser load event – page eka reload wenakota db eken hall data okkoma update wenawa.
//eka nisa hall table eka refresh wenna reusable function ekak hadala use karanawa.
//me function eka submission, update, delete awasthawal di call karanawa.
//advantage – code reusability ekak tiyenawa, code eka simple wenawa.

//browser load event
window.addEventListener("load", () => {

    // Logged-in user ta HALL module eka sambandha permissions ganna
    userPrivilege = getDataAjaxGetRequest("/userprivilegebymodule?modulename=HALL")

    //call table refresh function
    loadHallTable();
    //call form refresh function
    loadHallForm();
});


let textHallName = document.querySelector("#textHallName");
let selectHallLocation = document.querySelector("#selectHallLocation");
let textMaxStuCount = document.querySelector("#textMaxStuCount");
let textMaxDeskCount = document.querySelector("#textMaxDeskCount");
let textAvailableDeskCount = document.querySelector("#textAvailableDeskCount");
let textMaxSeatCount = document.querySelector("#textMaxSeatCount");
let textAvailableSeatCount = document.querySelector("#textAvailableSeatCount");
let selectHallStatus = document.querySelector("#selectHallStatus");
let hallStatusLabel = document.querySelector("#hallStatusLabel");
let hallStatusSelect = document.querySelector("#hallStatusSelect");
let selectAllFeatures = document.querySelector("#selectAllFeatures");
let selectSelectedFeatures = document.querySelector("#selectSelectedFeatures");
let tabFormButton = document.querySelector("#tabFormButton");

let allfeatureslist = [];

//hall status color display karanna function eka
const getHallStatus = (dataOb) => {
    const hallstatus = dataOb.hallstatus_id.name;

    if (hallstatus === "Available") {
        return `<span style="color: green; font-weight: bold;">${hallstatus}</span>`;
    }
    if (hallstatus === "Unavailable") {
        return `<span style="color: orange; font-weight: bold;">${hallstatus}</span>`;
    }

    return `<span>${hallstatus}</span>`;
}

//feature list eka comma separated string ekakata convert karanawa
const getFeatureList = (dataOb) => {
    if (!dataOb.featureslist || dataOb.featureslist.length === 0) {
        return "-";
    }

    return dataOb.featureslist
        .map(features => features.name)
        .join(", ");
}

//hall table load karanna function eka
const loadHallTable = () => {
    // empty array ekak hadanawa halls hold karanna
    halls = new Array();

    // backend eken halls okkoma gannawa
    halls = getDataAjaxGetRequest("/hall/alldata");

    //string-string,numbers,date
    //function-object,array,boolean,image
    //create property array
    let displayColumns = [
        { property: "name", dataType: "string" },
        { property: "location", dataType: "string" },
        { property: getFeatureList, dataType: "function" },
        { property: getHallStatus, dataType: "function" },
    ];

    //reusable table load function eka call karanawa
    loadTableData(tableBodyHall, halls, displayColumns, printHall, editHall, deleteHall);

    //datatable activate karanawa (bootstrap/jquery)
    $("#tableHall").dataTable();

    for (const index in halls) {
        // Update permission naththm – update button hide karanawa
        if (!userPrivilege.privi_update) {
            tableBodyHall.children[index].children[5].children[1].style.display = "none";
        }
        // Delete permission naththm – delete button hide karanawa
        if (!userPrivilege.privi_delete) {
            tableBodyHall.children[index].children[5].children[2].style.display = "none";
        }
    }
}

//define form load karanna function 
const loadHallForm = () => {
    tabFormButton.innerText = "Add Hall";

    // form eka reset karanawa(input walata dapu values okkoma clear wenawa)
    formHall.reset();

    //empty object ekak hadanwa
    hall = new Object();
    // why -Vaild value tika collect krala backend ekata pass krnna ona.
    // one by one pass krnawata wada object eka pass krna eka lesi.

    //hall has features list
    hall.featureslist = Array();

    // features list 
    // DB eken okkoma featureslist ganna -> dropdown ekata load karanna
    allfeatureslist = getDataAjaxGetRequest("/features/alldata");
    loadSelectOptions(selectAllFeatures, allfeatureslist, "", "name");

    loadSelectOptions(selectSelectedFeatures, hall.featureslist, "", "name");

    // hall status
    // DB eken okkoma hallstatuses ganna -> dropdown ekata load karanna
    let hallstatuses = getDataAjaxGetRequest("/hallstatus/alldata");
    loadSelectOptions(selectHallStatus, hallstatuses, "Select Hall Status..!", "name");

    //db ekata active widihata status eka pass krnawa
    hall.hallstatus_id = { id: 1, name: "Available" };
    selectHallStatus.value = JSON.stringify(hall.hallstatus_id);

    // Hide Hall Status label and select
    hallStatusLabel.style.display = "none";
    hallStatusSelect.style.display = "none";

    // userta ta insert privilege naththam form buttons hide karanawa
    if (!userPrivilege.privi_insert) {
        tabFormButton.style.display = "none";   // "Add New" button hide
        buttonSubmit.style.display = "none";    // "Save" button hide
    }
    // buttons control karanawa
    buttonUpdate.style.display = "none"; // update button hide
    buttonSubmit.style.display = "block"; // submit button show

    // form eke tiyena input, select, radio okkoma border colour / UI reset karanawa
    setUIColour([textHallName, selectHallLocation, textMaxStuCount, textMaxDeskCount, textAvailableDeskCount, textMaxSeatCount, textAvailableSeatCount, selectHallStatus, selectAllFeatures, selectSelectedFeatures]);
    let tableTab = new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabTableArea"]'));
    tableTab.show(); // form tab hide karanna epa, table tab activate wenawa

}

// define form print
const printHall = (dataOb) => {
    hall = dataOb;
    // print details table fill karanawa (modal eka assume karanawa)
    tdHallname.innerText = hall.name;
    tdLocation.innerText = hall.location;
    tdMaxStusCount.innerText = hall.maxstucount;
    tdMaxDeskCount.innerText = hall.maxdeskcount;
    tdAvailableDesk.innerText = hall.availabledeskcount;
    tdMaxSeatCount.innerText = hall.maximumseats;
    tdAvailableSeat.innerText = hall.availableseats;
    tdHallStatus.innerText = hall.hallstatus_id.name;
    tdFeatures.innerText = hall.featureslist
        .map(f => f.name)
        .join(", ");


    $("#modalHallPrint").modal("show");
}
// Print button eka click karama call wenna function eka
const buttonPrint = () => {
    // Aluth tab ekak open karanawa
    const newTab = window.open();
    // Print page eka create karanawa
    newTab.document.writeln(
        "<html><head><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'><title>Print Hall Detail</title></head>" +
        "<body>" +
        "<h2>Print Hall Details</h2>" +
        tablePrintHall.outerHTML +
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
    $("#modalHallPrint").modal("hide");
}
//define edit function 
const editHall = (dataOb) => {
    // hall = dataOb;
    // oldHall = dataOb;
    // mehema use krnna ba mokada methana reference variable wage hasirennne...
    //  hall, oldHall eke thiyenne ekama memory address ekane.
    // e nisa apita update wunu widiha hoyanna ba, dekama enne ekama value.
    //  hall object ekata changes karoth,
    // oldHall ekatath ehema change wenawa (eka object ekak nisa).

    // ithin e nisa reference eka galawanna ona.
    // mehema wela thiyenne object gaththa nisa (object type eke thiyenawa reference ekak).
    // eka string ekakata convert krgannwa (deep copy hadanna).
    // but string ekata convert karama access krnna ba,
    // e nisa eka aye object ekakata path krgnna JSON ekenma.
    // -> JSON.stringify() : object ekata string ekakata hadanawa.
    // -> JSON.parse() : string ekata object ekakata hadanawa.
    // mehema krama eken deep copy ekak hadanawa.

    // open Add hall tab
    new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabFormArea"]')).show();
    tabFormButton.innerText = "Update Hall";

    hall = JSON.parse(JSON.stringify(dataOb));
    oldHall = JSON.parse(JSON.stringify(dataOb));

    //hall name refill
    textHallName.value = hall.name;
    //hall location refill
    selectHallLocation.value = hall.location;
    //hall maxiumumstudent count refill
    textMaxStuCount.value = hall.maxstucount;
    //hall available desk count
    textAvailableDeskCount.value = hall.availabledeskcount;
    //hall mxiumum desk count
    textMaxDeskCount.value = hall.maxdeskcount;
    //hall available seat count
    textAvailableSeatCount.value = hall.availableseats;
    //hall maxiumum seat count
    textMaxSeatCount.value = hall.maximumseats;


    //hall status visible and refill
    hallStatusLabel.style.display = "block";
    hallStatusSelect.style.display = "block";

    selectHallStatus.value = JSON.stringify(hall.hallstatus_id);

    //featurelist refill
    allfeatureslist = [];
    allfeatureslist = getDataAjaxGetRequest("/feature/listbyhallwithoutselect/" + hall.id);

    loadSelectOptions(selectAllFeatures, allfeatureslist, "", "name");

    loadSelectOptions(selectSelectedFeatures, hall.featureslist, "", "name");

    // Buttons control
    buttonSubmit.style.display = "none";  // submit button hide
    buttonUpdate.style.display = "block"; // update button show
    buttonClear.style.display = "none";  // clear button hide
}


// define checkHallFormError
const checkHallFormError = () => {

    let errors = "";

    // Hall Name check
    if (hall.name == null) {
        errors += "Please enter Hall Name. This field is required.<br>";
        textHallName.style.border = "1px solid red";
    }

    // Hall Location check
    if (hall.location == null) {
        errors += "Please select Hall Location. This field is required.<br>";
        selectHallLocation.style.border = "1px solid red";
    }

    // Max Student Count check
    if (hall.maxstucount == null) {
        errors += "Please enter Max Student Count. This field is required.<br>";
        textMaxStuCount.style.border = "1px solid red";
    }

    // Max Desk Count check
    if (hall.maxdeskcount == null) {
        errors += "Please enter Max Desk Count. This field is required.<br>";
        textMaxDeskCount.style.border = "1px solid red";
    }

    // Available Desk Count check
    if (hall.availabledeskcount == null) {
        errors += "Please enter Available Desk Count. This field is required.<br>";
        textAvailableDeskCount.style.border = "1px solid red";
    }

    // Max Seat Count check
    if (hall.maximumseats == null) {
        errors += "Please enter Max Seat Count. This field is required.<br>";
        textMaxSeatCount.style.border = "1px solid red";
    }

    // Available Seat Count check
    if (hall.availableseats == null) {
        errors += "Please enter Available Seat Count. This field is required.<br>";
        textAvailableSeatCount.style.border = "1px solid red";
    }

    // Hall Status check
    /*   if (hall.status == null) {
          errors += "Please select Hall Status. This field is required.<br>";
          selectHallStatus.style.border = "1px solid red";
      } */

    // Features list check
    if (hall.featureslist.length === 0) {
        errors += "Please select at least one Hall Feature. This field is required.<br>";
        selectSelectedFeatures.style.border = "1px solid red";
    }

    return errors; // errors return karanawa
}

//hall submission function
const buttonHallSubmit = () => {
    // common insert function eka call karanawa
    submitWithConfirm(checkHallFormError, hall, "/hall/insert", () => {
        // success unama passe form eka reset + table reload
        loadHallForm();
        loadHallTable();

    });
}
// define function to get the changes made in the Hall form
const checkHallFormUpdate = () => {
    let updates = "";

    // check karanawa hall object dekama null nadda kiyala
    if (hall != null && oldHall != null) {

        // Hall Name change unada
        if (hall.name !== oldHall.name) {
            updates += "Hall Name changed: " + oldHall.name + " --> " + hall.name + "\n";
        }

        // Hall Location change unada
        if (hall.location !== oldHall.location) {
            updates += "Location changed: " + oldHall.location + " --> " + hall.location + "\n";
        }

        // Max Student Count change
        if (hall.maxstucount !== oldHall.maxstucount) {
            updates += "Max Student Count changed: " + oldHall.maxstucount + " --> " + hall.maxstucount + "\n";
        }

        // Max Desk Count change
        if (hall.maxdeskcount !== oldHall.maxdeskcount) {
            updates += "Max Desk Count changed: " + oldHall.maxdeskcount + " --> " + hall.maxdeskcount + "\n";
        }

        // Available Desk Count change
        if (hall.availabledeskcount !== oldHall.availabledeskcount) {
            updates += "Available Desk Count changed: " + oldHall.availabledeskcount + " --> " + hall.availabledeskcount + "\n";
        }

        // Max Seat Count change
        if (hall.maximumseats !== oldHall.maximumseats) {
            updates += "Max Seat Count changed: " + oldHall.maximumseats + " --> " + hall.maximumseats + "\n";
        }

        // Available Seat Count change
        if (hall.availableseats !== oldHall.availableseats) {
            updates += "Available Seat Count changed: " + oldHall.availableseats + " --> " + hall.availableseats + "\n";
        }

        // Hall Status change
        if (hall.hallstatus_id.name !== oldHall.hallstatus_id.name) {
            updates += "Hall Status changed: " + oldHall.hallstatus_id.name + " --> " + hall.hallstatus_id.name + "\n";
        }


        // ================= Features list change check karanna =================

        // 1. Old hall features ids gannawa
        // map(f => f.id) use karanawa IDs  ganna
        // sort() use karanawa order ignore karanna, compare karanna easy wenna
        const oldFeatureIds = oldHall.featureslist.map(f => f.id).sort();

        // 2. New hall features ids gannawa
        // map(f => f.id) use karanawa IDs  ganna
        // sort() use karanawa order ignore karanna, compare karanna easy wenna
        const newFeatureIds = hall.featureslist.map(f => f.id).sort();

        // 3. Features add unoth detect karanna
        const addedFeatures = newFeatureIds.filter(id => !oldFeatureIds.includes(id));

        // 4. Features remove unoth detect karanna
        const removedFeatures = oldFeatureIds.filter(id => !newFeatureIds.includes(id));

        // 5. Added features length > 0 => hall ekata nava feature add una
        if (addedFeatures.length > 0) {

            // added feature IDs walata adala names tika ganna
            const addedFeatureNames = hall.featureslist
                .filter(f => addedFeatures.includes(f.id))
                .map(f => f.name);

            // feature names -change list
            updates += "Changed Features (Added): " + addedFeatureNames.join(", ") + "\n";
        }

        // 6. Removed features length > 0 => hall ekata feature remove una
        if (removedFeatures.length > 0) {

            // removed feature IDs walata adala names tika ganna
            const removedFeatureNames = oldHall.featureslist
                .filter(f => removedFeatures.includes(f.id))
                .map(f => f.name);

            // feature names - removed list
            updates += "Removed Features: " + removedFeatureNames.join(", ") + "\n";
        }

    }


    // all updates return karanawa
    return updates;
}
//Hall submission function
const buttonHallUpdate = () => {

    // common update function eka call karanawa
    updateWithConfirm(checkHallFormError, checkHallFormUpdate, hall, "/hall/update", () => {
        // success unama passe form eka reset + table reload
        loadHallForm();
        loadHallTable();

    });
}
//define delete function
const deleteHall = (dataOb) => {
    // data object eka local variable ekakata assign karanawa
    const hall = dataOb;
    // SweetAlert eke pennanna one message eka hadanawa
    const message =
        "<b>Hall Name:</b> " + hall.name;

    // common delete function eka call karanawa
    deleteWithConfirm(hall, message, "/hall/delete", () => {
        // success unama passe form eka reset + table reload
        loadHallForm();
        loadHallTable();

    });
}
//methods define for list trnsfer
const addSingleFeature = () => {
    // select eka empty da kiyala check karanawa
    if (selectAllFeatures.value !== "") {

        // select wela thiyena feature eka object ekakata convert karanawa
        let selectedFeature = JSON.parse(selectAllFeatures.value);

        // hall features list ekata feature eka add karanawa
        hall.featureslist.push(selectedFeature);

        // selected features dropdown eka reload karanawa
        loadSelectOptions(selectSelectedFeatures, hall.featureslist, "", "name");

        // allfeatureslist eke index eka hoyanawa
        let extIndex = allfeatureslist.map(feature => feature.id).indexOf(selectedFeature.id);

        // index eka thiyenawanam allfeatures list eken ain karanawa
        if (extIndex != -1) {
            allfeatureslist.splice(extIndex, 1);
        }

        // select options tika aye reload karanawa
        loadSelectOptions(selectAllFeatures, allfeatureslist, "", "name");

    } else {
        // feature ekak select karala naththan swal warning message eka pennanawa
        Swal.fire({
            icon: 'warning',
            title: 'Attention!',
            text: 'Please select a feature..!',
            confirmButtonText: 'OK'
        });
    }
    validateFeaturesList();
}
const addAllFeature = () => {
    // allfeatureslist eke thiyena okkoma features hall.features walata add karanawa
    allfeatureslist.forEach(feature => {
        hall.featureslist.push(feature);
    });

    // selected features dropdown eka reload karanawa
    loadSelectOptions(selectSelectedFeatures, hall.featureslist, "", "name");

    // allfeatureslist empty karanawa
    allfeatureslist = [];

    // all features dropdown eka aye reload karanawa
    loadSelectOptions(selectAllFeatures, allfeatureslist, "", "name");
    validateFeaturesList();

}
const removeSingleFeature = () => {

    // select eka empty da kiyala check karanawa
    if (selectSelectedFeatures.value !== "") {

        // select wela thiyena feature eka object ekakata convert karanawa
        let selectedFeature = JSON.parse(selectSelectedFeatures.value);

        // hall.features eken ain karana feature eka allfeatureslist walata add karanawa
        allfeatureslist.push(selectedFeature);

        // all features dropdown eka aye reload karanawa
        loadSelectOptions(selectAllFeatures, allfeatureslist, "", "name");

        // hall.features eke index eka hoyanawa
        let extIndex = hall.featureslist.map(feature => feature.id).indexOf(selectedFeature.id);

        // index eka thiyenawanam hall.features list eken ain karanawa
        if (extIndex != -1) {
            hall.featureslist.splice(extIndex, 1);
        }

        // selected features dropdown eka reload karanawa
        loadSelectOptions(selectSelectedFeatures, hall.featureslist, "", "name");

    } else {
        // feature ekak select karala naththan swal warning message eka pennanawa
        Swal.fire({
            icon: 'warning',
            title: 'Attention!',
            text: 'Please select a feature..!',
            confirmButtonText: 'OK'
        });
    }
    validateFeaturesList();
}

const removeAllFeature = () => {
    // hall.features eke thiyena okkoma features allfeatureslist walata add karanawa
    hall.featureslist.forEach(feature => {
        allfeatureslist.push(feature);
    });

    // all features dropdown eka aye reload karanawa
    loadSelectOptions(selectAllFeatures, allfeatureslist, "", "name");

    // hall.features empty karanawa (slected list)
    hall.featureslist = [];

    // selected features dropdown eka reload karanawa
    loadSelectOptions(selectSelectedFeatures, hall.featureslist, "", "name");
    validateFeaturesList();
}

const validateFeaturesList = () => {
    // Only validate the selected features (required field)
    if (hall.featureslist.length > 0) {
        selectSelectedFeatures.style.border = "2px solid green";
    } else {
        selectSelectedFeatures.style.border = "2px solid red";
    }

    // reset border for allFeatures dropdown
    selectAllFeatures.style.border = "1.5px solid rgb(164, 201, 232)";
}
