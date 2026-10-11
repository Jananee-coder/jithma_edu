//browser refresh event – page eka reload wenakota db eken user data okkoma update wenawa.
//eka nisa user table eka refresh wenna reusable function ekak hadala use karanawa.
//me function eka submission, update, delete awasthawal di call karanawa.
//advantage – code reusability ekak tiyenawa, code eka simple wenawa.

//browser load event
window.addEventListener("load", () => {
    // Logged-in user ta USER module eka sambandha permissions ganna
    userPrivilege = getDataAjaxGetRequest("/userprivilegebymodule?modulename=USER");

    //call table refresh function
    loadUserTable();
    //call form refresh function
    loadUserForm();
});

let textRePassword = document.querySelector("#textRePassword");
let textPassword = document.querySelector("#textPassword");
let selectEmployee = document.querySelector("#selectEmployee");
let textUsername = document.querySelector("#textUsername");
let selectUserStatus = document.querySelector("#selectUserStatus");
let textEmail = document.querySelector("#textEmail");
let divRolesParent = document.querySelector("#divRolesParent");
let tabFormButton = document.querySelector("#tabFormButton");
let selectUserRoles = document.querySelector("#selectUserRoles");
let labelUserStatus = document.querySelector("#labelUserStatus");
let divSelectUserStatus = document.querySelector("#divSelectUserStatus");

selectEmployee.addEventListener("change", () => {
    // employee dropdown eka change wenakota run wenna event eka

    if (selectEmployee.value) {
        // employee kenek select karoth

        employee = JSON.parse(selectEmployee.value); // select karapu employee object eka gannawa
        textEmail.value = employee.email; // auto widihata employee ge email eka text field ekata fill wenawa

        user.employee_id = employee; // user object ekata employee set karanawa
        user.email = employee.email; // user object ekata email assign karanawa

        textEmail.style.border = '2px solid green'; // valid email nisa border green karanawa

    } else {
        // employee kenek select karala naththam

        textEmail.value = ""; // email field eka clear karanawa

        user.employee_id = null; // user object eken employee remove karanawa
        user.email = null;       // user object eken email remove karanawa

        textEmail.style.border = '2px solid red'; // invalid nisa border red karanawa
    }
});

//define all functions (properties)
const getEmployeeName = (dataOb) => {
    if (dataOb.employee_id != null) {
        return dataOb.employee_id.fullname;
    }
    return "-";
}
// Define user status function
const getUserStatus = (dataOb) => {
    const userStatus = dataOb.userstatus ? "Active" : "In-Active";

    if (userStatus === "Active") {
        return `<span style="color: green; font-weight: bold;">${userStatus}</span>`;
    }

    if (userStatus === "In-Active") {
        return `<span style="color: orange; font-weight: bold;">${userStatus}</span>`;
    }

    // Unknown status
    return `<span>${userStatus}</span>`;
}
//get roles
const getUserRoles = (dataOb) => {
    const userRoles = getDataAjaxGetRequest("/role/byuser/" + dataOb.id);
    return userRoles.map(role => role.name).join(", ");
}

// user table refresh function
const loadUserTable = () => {
    //create user array
    users = new Array();
    // backend eken user okkoma gannawa
    users = getDataAjaxGetRequest("/user/alldata");

    users.reverse();//decending kra

    //string-string, numbers, date
    //function-object, array, boolean, image
    //create property array
    let displayColumns = [
        { property: getEmployeeName, dataType: "function" },
        { property: "username", dataType: "string" },
        // { property: "email", dataType: "string" },
        { property: getUserRoles, dataType: "function" },
        { property: getUserStatus, dataType: "function" },
    ];

    // Call reusable table data fill function
    loadTableData(tableBodyUser, users, displayColumns, printUser, editUser, deleteUser);

    for (const index in users) {
        // Update permission naththm – update button hide karanawa
        if (!userPrivilege.privi_update) {
            tableBodyUser.children[index].children[5].children[1].style.display = "none";
        }
        // Delete permission naththm – delete button hide karanawa
        if (!userPrivilege.privi_delete) {
            tableBodyUser.children[index].children[5].children[2].style.display = "none";
        }
    }

    // Initialize DataTable
    $('#tableUser').dataTable();
}

// define function to load user form
const loadUserForm = () => {

    tabFormButton.innerText = "Add User";
    // Form eka reset karanawa (input walata dapu values okkoma clear wenawa)
    formUser.reset();

    // Empty object ekak hadanawa → data binding walata use wenna
    user = new Object();

    // Roles array ekak hadanawa
    user.roles = [];
    // Why: Valid value tika collect karala backend ekata pass karanna ona.
    // One by one pass karanawa wada object eka pass karana eka lesi.
    //employee List without user account
    let employeeListWithoutUserAccount = getDataAjaxGetRequest("/employee/listwithoutuseraccount");
    loadSelectOptions(selectEmployee, employeeListWithoutUserAccount, "Select Employees...!", "fullname");
    //User status set active
    user.userstatus = true;
    selectUserStatus.value = user.userstatus;

    // Hide User Status label and select
    labelUserStatus.style.display = "none";
    divSelectUserStatus.style.display = "none";

    // User ta insert privilege naththam form buttons hide karanawa
    if (!userPrivilege.privi_insert) {
        tabFormButton.style.display = "none";   // "Add New" button hide
        buttonSubmit.style.display = "none";    // "Save" button hide
    }
    // Buttons control karanawa
    buttonUpdate.style.display = "none"; // Update button hide
    buttonSubmit.style.display = "block"; // Submit button show

    // Form eke tiyena input, select, radio okkoma border colour / UI reset karanawa
    setUIColour([selectEmployee, textUsername, textPassword, textRePassword, textEmail, selectUserStatus]);

    // Table tab activate karanawa, form tab hide wenna epa
    let tableTab = new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabTableArea"]'));
    tableTab.show();

    user.roles = [];
    // Role list eka ganna
    let roles = getDataAjaxGetRequest("/role/alldatawithoutadmin");

    // divRole content eka clear karanawa
    divRole.innerHTML = "";

    // Roles tika forEach ekak use karala process karanna puluwan
    roles.forEach(role => {
        // Div ekak create karanawa inline checkbox ekak hadanna
        let div = document.createElement("div");
        div.className = "form-check form-check-inline";

        // Checkbox input element create karanawa
        let inputElement = document.createElement("input");
        inputElement.type = "checkbox"; // Checkbox type define karanawa
        inputElement.className = "form-check-input form-input";

        // Checkbox change wenakota user.roles update karanawa
        inputElement.onchange = () => {
            if (inputElement.checked) {
                // Tick unama role add karanawa
                user.roles.push(role);
            } else {
                // Untick unama role remove karanawa
                let extIndex = user.roles.map(rl => rl.name).indexOf(role.name);
                if (extIndex > -1) {
                    user.roles.splice(extIndex, 1);
                }
            }
        }

        // Label element create karanawa
        let labelElement = document.createElement("label");
        labelElement.className = "form-check-label";
        labelElement.innerText = role.name; // Role name display karanawa

        // Div ekata append karanawa input and label
        div.appendChild(inputElement);
        div.appendChild(labelElement);

        // Main container divRole ekata append karanawa
        divRole.appendChild(div);
    });

}

const editUser = (dataOb) => {
    // user = dataOb;
    // oldUser = dataOb;
    // mehema use krnna ba mokada methana reference variable wage hasirennne...
    // user, oldUser eke thiyenne ekama memory address ekane.
    // e nisa apita update wunu widiha hoyanna ba, dekama enne ekama value.
    // hodatama kiyanna nam — oba user object ekata changes karoth,
    // oldUser ekatath ehema change wenawa (eka object ekak nisa).

    // ithin e nisa reference eka galawanna ona.
    // mehema wela thiyenne object gaththa nisa (object type eke thiyenawa reference ekak).
    // eka string ekakata convert krgannwa (deep copy hadanna).
    // but string ekata convert karama access krnna ba,
    // e nisa eka aye object ekakata path krgnna JSON ekenma.
    // -> JSON.stringify() : object ekata string ekakata hadanawa.
    // -> JSON.parse() : string ekata object ekakata hadanawa.
    // mehema krama eken deep copy ekak hadanawa.
    new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabFormArea"]')).show();
    tabFormButton.innerText = "Update User";

    // Buttons control
    buttonSubmit.style.display = "none";  // submit button hide
    buttonUpdate.style.display = "block"; // update button show
    buttonClear.style.display = "none";  // clear button hide

    //user = getDataAjaxGetRequest("/user/byid/" + dataOb.id);
    //oldUser = getDataAjaxGetRequest("/user/byid/" + dataOb.id);

    user = JSON.parse(JSON.stringify(dataOb));
    oldUser = JSON.parse(JSON.stringify(dataOb));

    // Load employee list
    let employeeList = getDataAjaxGetRequest("/employee/listwithoutuseraccount");

    // Add current employee if missing
    if (user.employee_id) {
        let exists = employeeList.some(emp => emp.id === user.employee_id.id);
        if (!exists) {
            employeeList.push(user.employee_id);
        }
    }

    // Reload dropdown
    loadSelectOptions(selectEmployee, employeeList, "Select Employees...!", "fullname"
    );

    // Set selected employee
    selectEmployee.value = JSON.stringify(user.employee_id);

    textUsername.value = user.username;
    textPassword.disabled = true;
    textRePassword.disabled = true;
    textEmail.value = user.email;

    //user status visible
    labelUserStatus.style.display = "block";
    divSelectUserStatus.style.display = "block";
    selectUserStatus.value = user.userstatus;

    let assignedRoles = getDataAjaxGetRequest("/role/byuser/" + user.id);
    user.roles = Array.isArray(assignedRoles) ? assignedRoles : [];
    oldUser.roles = JSON.parse(JSON.stringify(user.roles)); // keep old roles for comparison

    // FIX: initialize roles array if missing
    /*   if (!user.roles) user.roles = [];
      if (!oldUser.roles) oldUser.roles = []; */
    // Role list eka ganna
    let roles = getDataAjaxGetRequest("/role/alldatawithoutadmin");

    // divRole content eka clear karanawa
    divRole.innerHTML = "";

    // Roles tika forEach ekak use karala process karanna puluwan
    roles.forEach(role => {
        // Div ekak create karanawa inline checkbox ekak hadanna
        let div = document.createElement("div");
        div.className = "form-check form-check-inline";

        // Checkbox input element create karanawa
        let inputElement = document.createElement("input");
        inputElement.type = "checkbox"; // Checkbox type define karanawa
        inputElement.className = "form-check-input form-input";

        // Checkbox change wenakota user.roles update karanawa
        inputElement.onchange = () => {
            if (inputElement.checked) {
                // Tick unama role add karanawa
                user.roles.push(role);
            } else {
                // Untick unama role remove karanawa
                let extIndex = user.roles.map(rl => rl.name).indexOf(role.name);
                if (extIndex > -1) {
                    user.roles.splice(extIndex, 1);
                }
            }
        }
        let extIndex = user.roles.map(rl => rl.name).indexOf(role.name);
        if (extIndex > -1) {
            inputElement.checked = true;
        }
        /*  inputElement.checked = user.roles.some(rl => rl.name === role.name); */

        // Label element create karanawa
        let labelElement = document.createElement("label");
        labelElement.className = "form-check-label";
        labelElement.innerText = role.name; // Role name display karanawa

        // Div ekata append karanawa input and label
        div.appendChild(inputElement);
        div.appendChild(labelElement);

        // Main container divRole ekata append karanawa
        divRole.appendChild(div);
    });


}

const printUser = (dataOb) => {
    const user = dataOb;

    //fill table cells inside the print modal
    tdEmployee.innerText = user.employee_id.fullname;
    tdUsername.innerText = user.username;
    tdEmail.innerText = user.email;
    // Fetch roles from backend before displaying
    const assignedRoles = getDataAjaxGetRequest("/role/byuser/" + user.id);
    const roles = Array.isArray(assignedRoles) && assignedRoles.length > 0
        ? assignedRoles.map(r => r.name).join(", ")
        : "-";

    document.querySelector("#tdRoles").innerText = roles;
    tdUserStatus.innerText = user.userstatus ? "Active" : "In-Active";;
    // Bootstrap modal eka open karanawa
    $("#modalUserPrint").modal("show");
}

const buttonPrint = () => {
    // Aluth tab ekak open karanawa
    const newTab = window.open();

    newTab.document.writeln(
        "<html><head><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'><title>Print User </title></head>" +
        "<body>" +
        "<h2>Print User</h2>" +
        tablePrintUser.outerHTML +
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
    $("#modalUserPrint").modal("hide");
}
//create funcation for check errors
const checkUserFormError = () => {
    let errors = '';
    //need to check all required fields

    if (user.employee_id == null) {
        errors = errors + "Please select employee..This is a required field. <br>";
        selectEmployee.style.border = "1px solid red";
    }
    if (user.username == null) {
        errors = errors + "Please fill username..This is a required field. <br>";
        textUsername.style.border = "1px solid red";
    }
    if (!textPassword.disabled && (user.password == null || user.password === "")) {
        errors += "Please enter valid password..This is a required field. <br>";
        textPassword.style.border = "1px solid red";
    }
    if (!textRePassword.disabled && (user.repassword == null || user.repassword === "")) {
        errors += "Please re-enter password..This is a required field. <br>";
        textRePassword.style.border = "1px solid red";
    }
    if (user.email == null) {
        errors = errors + "Please fill valid email..This is a required field. <br>";
        textEmail.style.border = "1px solid red";
    }
    if (user.roles.length === 0) {
        errors = errors + "Please select at least one role..This is a required field. <br>";

    }
    return errors;
}

// user form submit karanna function eka
const buttonUserSubmit = () => {
    //call common submit function
    submitWithConfirm(checkUserFormError, user, "/user/insert", () => {
        // success → reset form + reload table
        loadUserForm();
        loadUserTable();

    });
}
// define function for get user form updates
const checkUserFormUpdate = () => {

    let updates = "";

    if (user != null && oldUser != null) {
        // Username
        if (user.username != oldUser.username) {
            updates = updates + "Username is changed. "
                + oldUser.username + " --> " + user.username + "\n";
        }
        // Email
        if (user.email != oldUser.email) {
            updates = updates + "Email is changed. "
                + oldUser.email + " --> " + user.email + "\n";
        }
        // User Status
        if (user.userstatus != oldUser.userstatus) {
            updates = updates + "Status is changed. "
                + (oldUser.userstatus ? "Active" : "In-Active")
                + " --> "
                + (user.userstatus ? "Active" : "In-Active")
                + "\n";
        }
        // Roles comparison
        const oldRoles = oldUser.roles.map(function (r) { return r.name; }).sort();
        const newRoles = user.roles.map(function (r) { return r.name; }).sort();

        if (oldRoles.length != newRoles.length ||
            !oldRoles.every(function (val, index) { return val == newRoles[index]; })) {

            updates = updates + "Roles are changed. "
                + oldRoles.join(", ") + " --> "
                + newRoles.join(", ") + "\n";
        }
    }

    return updates;
}

// define function for update user records
const buttonUserUpdate = () => {
    // call common update function with error & update check
    updateWithConfirm(checkUserFormError, checkUserFormUpdate, user, "/user/update", () => {
        // success → reset form + reload table
        loadUserForm();
        loadUserTable();
    });
}

// define method for user delete
const deleteUser = (dataOb) => {
    // Data object eka assign karanawa local variable ekakata
    const user = dataOb;

    // SweetAlert eke pennanna one message eka hadanawa
    const message =
        "<b>Username :</b> " + user.username + "<br>" +
        "<b>Email :</b> " + user.email;

    // common delete function eka call karanawa
    deleteWithConfirm(user, message, "/user/delete", () => {
        // success unama passe form eka reset + table reload
        loadUserForm();
        loadUserTable();
    });
}

textRePassword.addEventListener("keyup", () => {
    let elementValue = textRePassword.value;

    user.repassword = elementValue; // store retype password

    if (elementValue === textPassword.value) {
        user.password = elementValue; // both match
        textRePassword.style.border = "2px solid green";
    } else {
        textRePassword.style.border = "2px solid red";
    }
});