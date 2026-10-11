//browser refresh event – page eka reload wenakota db eken privilege data okkoma update wenawa.
//eka nisa privilege table eka refresh wenna reusable function ekak hadala use karanawa.
//me function eka submission, update, delete awasthawal di call karanawa.
//advantage – code reusability ekak tiyenawa, code eka simple wenawa.

//browser load event 
window.addEventListener("load", () => {

    // Logged-in user ta PRIVILEGE module eka sambandha permissions ganna
    userPrivilege = getDataAjaxGetRequest("/userprivilegebymodule?modulename=PRIVILEGE");

    //call table refresh function
    loadPrivilegeTable();
    //call form refresh function
    loadPrivilegeForm();
});

let selectRole = document.getElementById("selectRole");
let selectModule = document.getElementById("selectModule");
let tabFormButton = document.getElementById("tabFormButton");

//define all functions (properties)
const getRole = (dataOb) => {
    return dataOb.role_id.name;
}
const getModule = (dataOb) => {
    return dataOb.module_id.name;
}
const getPrivSelect = (dataOb) => {
    if (dataOb.privi_select) {
        return '<i class="fa-solid fa-check text-success ms-1"></i>';
    } else {
        return '<i class="fa-solid fa-xmark text-danger ms-1"></i>';
    }
}
const getPrivInsert = (dataOb) => {
    if (dataOb.privi_insert) {
        return '<i class="fa-solid fa-check text-success ms-1"></i>';
    } else {
        return '<i class="fa-solid fa-xmark text-danger ms-1"></i>';
    }
}
const getPriUpdate = (dataOb) => {
    if (dataOb.privi_update) {
        return '<i class="fa-solid fa-check text-success ms-1"></i>';
    } else {
        return '<i class="fa-solid fa-xmark text-danger ms-1"></i>';
    }
}
const getPrivDelete = (dataOb) => {
    if (dataOb.privi_delete) {
        return '<i class="fa-solid fa-check text-success ms-1"></i>';
    } else {
        return '<i class="fa-solid fa-xmark text-danger ms-1"></i>';
    }
}
//define function for loadPrivilegeTable
const loadPrivilegeTable = () => {
    // empty array ekak hadanawa privileges catch karanna
    privileges = new Array();
    privileges = getDataAjaxGetRequest("/privilege/alldata");
    privileges.reverse();//decending kra

    //string-string,numbers,date
    //function-object,array,boolean,image

    //create property array
    let displayColumns = [
        { dataType: "function", property: getRole },
        { dataType: "function", property: getModule },
        { dataType: "function", property: getPrivSelect },
        { dataType: "function", property: getPrivInsert },
        { dataType: "function", property: getPriUpdate },
        { dataType: "function", property: getPrivDelete },

    ];
    loadTableData(tableBodyPrivilege, privileges, displayColumns, printPrivilegeRecord, editPrivilegeRecord, deletePrivilege);

    for (const index in privileges) {
        // Update permission naththm – update button hide karanawa
        if (!userPrivilege.privi_update) {
            tableBodyPrivilege.children[index].children[7].children[1].style.display = "none";
        }
        // Delete permission naththm – delete button hide karanawa
        if (!userPrivilege.privi_delete) {
            tableBodyPrivilege.children[index].children[7].children[2].style.display = "none";
        }
    }

    $('#tablePrivilege').dataTable();
}
//define funtion for print privilege records
const printPrivilegeRecord = (dataOb) => {
    //catch data Object
    privilege = dataOb;

    //fill tab;e cells inside the print modal

    tdRole.innerText = privilege.role_id.name;
    tdModule.innerText = privilege.module_id.name;

    if (privilege.privi_select) {
        tdSelect.innerText = "Granted";
    } else {
        tdSelect.innerText = "Not-Granted";
    }
    if (privilege.privi_insert) {
        tdInsert.innerText = "Granted";
    } else {
        tdInsert.innerText = "Not-Granted";
    }
    if (privilege.privi_update) {
        tdUpdate.innerText = "Granted";
    } else {
        tdUpdate.innerText = "Not-Granted";
    }
    if (privilege.privi_delete) {
        tdDelete.innerText = "Granted";
    } else {
        tdDelete.innerText = "Not-Granted";
    }
    // Bootstrap modal eka open karanawa
    $("#modalPrivilegePrint").modal("show");
}
//define button print
const buttonPrint = () => {
    // Aluth tab ekak open karanawa
    const newTab = window.open();

    newTab.document.writeln(
        "<html><head><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'><title>Print Privilege </title></head>" +
        "<body>" +
        "<h2>Print Privilege</h2>" +
        tablePrintPrivilege.outerHTML +
        "</body></html>"
    );
    // Document eka close karanawa (render wenna)
    newTab.document.close();

    // interval ekak set kara mili second 250 kin - print eka click karama 250ms thiyala tab eka open wenawa.
    // eeta passe print page eka close karama mulu new tab ekama close wenawa.
    setTimeout(() => {
        newTab.print();
        newTab.close();
    }, 250);
    // Bootstrap modal eka hide karanawa
    $("#modalPrivilegePrint").modal("hide");
}
//define funtion for edit privilege records
const editPrivilegeRecord = (dataOb) => {
    //privilege=dataOb;
    //oldPrivilege=dataOb;
    /* mehema use krnna ba mokada methna refrence variable wage hasirennne...privilege ,oldPrivilege eke thiyenne ekama memomry address ekane e nisa apita updte wunu widiha hoyanna ba dekatama enne ekam value..ithn e nisa meke refrence eka galawanna ona..mehema wela thiyenne object gththa nisa..eka string krgannwa..
    but ehemath acees krnna ba e nisa eka aye object ekkak bawata path krgnna json ekenma */
    // open Add Employee tab
    new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabFormArea"]')).show();
    tabFormButton.innerText = "Update Privilege";

    privilege = JSON.parse(JSON.stringify(dataOb));
    oldPrivilege = JSON.parse(JSON.stringify(dataOb));

    //dynamic element
    selectRole.value = JSON.stringify(privilege.role_id);
    selectModule.value = JSON.stringify(privilege.module_id);

    selectRole.disabled = "disabled";
    selectModule.disabled = "disabled";

    if (privilege.privi_select) {
        radioSelect1.checked = true;
    } else {
        radioSelect2.checked = true;
    }
    if (privilege.privi_insert) {
        radioInsert1.checked = true;
    } else {
        radioInsert2.checked = true;
    }
    if (privilege.privi_update) {
        radioUpdate1.checked = true;
    } else {
        radioUpdate2.checked = true;
    }
    if (privilege.privi_delete) {
        radioDelete1.checked = true;
    } else {
        radioDelete2.checked = true;
    }
    // Buttons control
    buttonSubmit.style.display = "none";  // submit button hide
    buttonUpdate.style.display = "block"; // update button show
    buttonClear.style.display = "none";  // clear button hide
}



//define check privilege form updates
const checkPrivileFormUpdate = () => {
    let updates = "";

    if (privilege != null && oldPrivilege != null) {

        if (privilege.role_id.id != oldPrivilege.role_id.id) {
            updates = updates + "Role is changed. " + oldPrivilege.role_id.name + " --> " + privilege.role_id.name + "\n";
        }
        if (privilege.module_id.id != oldPrivilege.module_id.id) {
            updates = updates + "Module is changed. " + oldPrivilege.module_id.name + " --> " + privilege.module_id.name + "\n";
        }
        if (privilege.privi_select != oldPrivilege.privi_select) {
            updates = updates + "SSelect Permission is changed. "
                + (oldPrivilege.privi_select ? "Granted" : "Not-Granted")
                + " --> "
                + (privilege.privi_select ? "Granted" : "Not-Granted")
                + "\n";
        }

        if (privilege.privi_insert != oldPrivilege.privi_insert) {
            updates = updates + "Insert Permission is changed. "
                + (oldPrivilege.privi_insert ? "Granted" : "Not-Granted")
                + " --> "
                + (privilege.privi_insert ? "Granted" : "Not-Granted")
                + "\n";
        }

        if (privilege.privi_update != oldPrivilege.privi_update) {
            updates = updates + "Update Permission is changed. "
                + (oldPrivilege.privi_update ? "Granted" : "Not-Granted")
                + " --> "
                + (privilege.privi_update ? "Granted" : "Not-Granted")
                + "\n";
        }

        if (privilege.privi_delete != oldPrivilege.privi_delete) {
            updates = updates + "Delete Permission is changed. "
                + (oldPrivilege.privi_delete ? "Granted" : "Not-Granted")
                + " --> "
                + (privilege.privi_delete ? "Granted" : "Not-Granted")
                + "\n";
        }
    }

    return updates;
}
//define function form update
const buttonPrivilegeUpdate = () => {
    // call common update function with error & update check
    updateWithConfirm(checkPrivilegeFormError, checkPrivileFormUpdate, privilege, "/privilege/update", () => {
        // success → reset form + reload table
        loadPrivilegeForm();
        loadPrivilegeTable();
    });
}

//create funcation for check errors
const checkPrivilegeFormError = () => {
    let errors = '';
    //need to check all required fields

    if (privilege.role_id == null) {
        errors = errors + "Please select Role..This is a required field. <br>";
        selectRole.style.border = "1px solid red";
    }
    if (privilege.module_id == null) {
        errors = errors + "Please fill User Module..This is a required field. <br>";
        selectModule.style.border = "1px solid red";
    }
    if (privilege.privi_select == null) {
        errors = errors + "Please checked select permission area..This is a required field. <br>";
    }
    if (privilege.privi_insert == null) {
        errors = errors + "Please checked insert permission area..This is a required field. <br>"
    }
    if (privilege.privi_update == null) {
        errors = errors + "Please checked update permission area..This is a required field. <br>";
    }
    if (privilege.privi_delete == null) {
        errors = errors + "Please checked delete permission area..This is a required field. <br>";
    }
    return errors;
}

// define function for privilege form submit
const buttonPrivilegeSubmit = () => {
    //call common submit function
    submitWithConfirm(checkPrivilegeFormError, privilege, "/privilege/insert", () => {
        // success → reset form + reload table
        loadPrivilegeForm();
        loadPrivilegeTable();

    });
}

//define funtion for delete privilege records
const deletePrivilege = (dataOb) => {

    // Data object eka assign karanawa local variable ekakata
    const privilege = dataOb;

    // SweetAlert eke pennanna one message eka hadanawa
    const message =
        "<b>Module Name:</b> " + privilege.module_id.name + "<br>" +
        "<b>Role Name:</b>   " + privilege.role_id.name;

    // common delete function eka call karanawa
    deleteWithConfirm(privilege, message, "/privilege/delete", () => {
        // success unama passe form eka reset + table reload
        loadPrivilegeForm();
        loadPrivilegeTable();
    });
}

// define function for user form
const loadPrivilegeForm = () => {

    tabFormButton.innerText = "Add Privilege";

    // form eka reset karanawa — meken static fields okkoma empty wenawa
    formPrivilege.reset();

    // valid form values store karanna empty object ekak hadanawa
    privilege = new Object();

    selectRole.disabled = "";
    selectModule.disabled = "";

    //  Dynamic dropdown load karanawa

    // DB eken okkoma roles ganna -> dropdown ekata load karanna
    let roles = getDataAjaxGetRequest("/role/alldatawithoutadmin");
    loadSelectOptions(selectRole, roles, "Select Roles", "name");

    // DB eken okkoma modules ganna -> module dropdown eka fill karanna
    let modules = getDataAjaxGetRequest("/module/alldata");
    loadSelectOptions(selectModule, modules, "Select Modules", "name");

    // form eke input / select fields okkoma UI reset karanawa (border colours)
    setUIColour([selectRole, selectModule]);

    // userta ta insert privilege naththam form buttons hide karanawa
    if (!userPrivilege.privi_insert) {
        tabFormButton.style.display = "none";   // "Add New" button hide
        buttonSubmit.style.display = "none";    // "Save" button hide
    }
    // Submit button eka pennanawa (add mode)
    // Update button eka hide karanawa
    buttonSubmit.classList.remove("d-none");
    buttonUpdate.classList.add("d-none");

    radioSelect1.checked = false;
    radioSelect2.checked = false;

    radioInsert1.checked = false;
    radioInsert2.checked = false;

    radioUpdate1.checked = false;
    radioUpdate2.checked = false;

    radioDelete1.checked = false;
    radioDelete2.checked = false;

    let tableTab = new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabTableArea"]'));
    tableTab.show(); // form tab hide karanna epa, table tab activate wenawa
}
