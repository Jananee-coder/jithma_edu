//browser refresh event – page eka reload wenakota db eken guardian data okkoma update wenawa.
//eka nisa guardian table eka refresh wenna reusable function ekak hadala use karanawa.
//me function eka submission, update, delete awasthawal di call karanawa.
//advantage – code reusability ekak tiyenawa, code eka simple wenawa.

//browser load event
window.addEventListener("load", () => {

    // Logged-in user ta CLASSDETAIL module eka sambandha permissions ganna
    userPrivilege = getDataAjaxGetRequest("/userprivilegebymodule?modulename=CLASSDETAIL")

    // call table refresh function
    loadClassDetailTable();
    // call form refresh function
    loadClassDetailForm();
    //classname auto  generate part 
    selectGrade.addEventListener("change", generateClassName);
    selectSubject.addEventListener("change", generateClassName);
    selectTeacher.addEventListener("change", generateClassName);

});

let selectGrade = document.querySelector("#selectGrade");
let selectSubject = document.querySelector("#selectSubject");
let selectTeacher = document.querySelector("#selectTeacher");
let textClassName = document.querySelector("#textClassName");
let selectClassStatus = document.querySelector("#selectClassStatus");
let classdetailStatusLabel = document.querySelector("#classdetailStatusLabel");
let classdetailStatusSelect = document.querySelector("#classdetailStatusSelect");
let tabFormButton = document.querySelector("#tabFormButton");


// generate class name using grade, subject, teacher
const generateClassName = () => {

    // check karanawa grade, subject, teacher thunama thiyenawada kiyala
    if (classdetail.grade_id && classdetail.subjectdetail_id && classdetail.teacher_id) {

        // thunam thiyenawanm, class name generate karanawa
        classname = classdetail.grade_id.name + " " +
            classdetail.subjectdetail_id.name + " - " +
            classdetail.teacher_id.fullname;

        // text input eka update karanawa
        textClassName.value = classname;

        // class name genarate unama border color change - green
        textClassName.style.border = '2px solid green';

        // classdetail object ekata assign karanawa
        classdetail.classname = classname;

    } else {

        // thunen ekak hri naththm empty krnawa
        textClassName.value = "";
        classdetail.classname = null;

        // optional: empty nm border color change-red
        // textClassName.style.border = '2px solid red';
    }
}

// Class Status display function 
const getClassStatus = (dataOb) => {
    const classdetailstatus = dataOb.classdetailstatus_id.name;

    if (classdetailstatus === "Active") {
        return `<span style="color: green; font-weight: bold;">${classdetailstatus}</span>`;
    }
    if (classdetailstatus === "In-active") {
        return `<span style="color: orange; font-weight: bold;">${classdetailstatus}</span>`;
    }
    if (classdetailstatus === "Completed") {
        return `<span style="color: blue; font-weight: bold;">${classdetailstatus}</span>`;
    }

    // unknown status
    return `<span>${classdetailstatus}</span>`;
}

//define loadClassDetailTable
const loadClassDetailTable = () => {
    // empty array ekak hadanawa classdetails hold karanna
    classdetails = new Array();

    // backend eken classdetail okkoma gannawa
    classdetails = getDataAjaxGetRequest("/classdetail/alldata");
    classdetails.reverse();//decending kra

    //string-string,numbers,date
    //function-object,array,boolean,image
    //create property array
    let displayColumns = [
        { property: "classname", dataType: "string" },
        { property: getClassStatus, dataType: "function" }
    ];
    // call loadTableData function
    loadTableData(tableClassDetailBody, classdetails, displayColumns, printClassDetail, editClassDetail, deleteClassDetail);
    $('#tableClassDetail').dataTable();

    for (const index in classdetails) {
        // Update permission naththm – update button hide karanawa
        if (!userPrivilege.privi_update) {
            tableClassDetailBody.children[index].children[3].children[1].style.display = "none";
        }
        // Delete permission naththm – delete button hide karanawa
        if (!userPrivilege.privi_delete) {
            tableClassDetailBody.children[index].children[3].children[2].style.display = "none";
        }
    }
}
// define function to load class detail form
const loadClassDetailForm = () => {

    tabFormButton.innerText = "Add Classdetail";

    // form eka reset karanawa(input walata dapu values okkoma clear wenawa)
    formClassDetail.reset();

    // empty object ekak hadanawa
    classdetail = new Object();
    // why -Vaild value tika collect krala backend ekata pass krnna ona.
    // one by one pass krnawata wada object eka pass krna eka lesi.

    // grade list 
    // DB eken okkoma grades ganna -> dropdown ekata load karanna
    let grades = getDataAjaxGetRequest("/grade/alldata");
    loadSelectOptions(selectGrade, grades, "Select Grade...!", "name");

    // subject list
    // DB eken okkoma subjectdetails ganna -> dropdown ekata load karanna
    let subjectdetails = getDataAjaxGetRequest("/subjectdetail/alldata");
    loadSelectOptions(selectSubject, subjectdetails, "Select Subject...!", "name");

    // teacher list 
    // DB eken okkoma teachers ganna -> dropdown ekata load karanna
    /* let teachers = getDataAjaxGetRequest("/teacher/alldata");
    loadSelectOptions(selectTeacher, teachers, "Select Teacher...!", "fullname"); */

    // class status
    // DB eken okkoma classdetailstatuses ganna -> dropdown ekata load karanna
    let classdetailstatuses = getDataAjaxGetRequest("/classdetailstatus/alldata");
    loadSelectOptions(selectClassStatus, classdetailstatuses, "Select Class Status..!", "name");

    //db ekata active widihata status eka pass krnawa
    classdetail.classdetailstatus_id = { id: 1, name: "Active" };
    selectClassStatus.value = JSON.stringify(classdetail.classdetailstatus_id);

    // Hide Class detail Status label and select
    classdetailStatusLabel.style.display = "none";
    classdetailStatusSelect.style.display = "none";

    // userta ta insert privilege naththam form buttons hide karanawa
    if (!userPrivilege.privi_insert) {
        tabFormButton.style.display = "none";   // "Add New" button hide
        buttonSubmit.style.display = "none";    // "Save" button hide
    }


    // buttons control karanawa
    buttonUpdate.style.display = "none"; // update button hide
    buttonSubmit.style.display = "block"; // submit button show

    // form eke tiyena input, select, radio okkoma border colour / UI reset karanawa
    setUIColour([selectGrade, selectSubject, selectTeacher, textClassName, selectClassStatus]);
    let tableTab = new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabTableArea"]'));
    tableTab.show(); // form tab hide karanna epa, table tab activate wenawa
}


// subject select change event
selectSubject.addEventListener("change", () => {

    // Selected subject object eka classdetail object ekata bind krnawa
    classdetail.subjectdetail_id = JSON.parse(selectSubject.value);

    // Selected subject ekata adala teachers load krnawa
    loadRelevantTeachers();

});

// Selected subject ekata adala teachers load krana function eka
const loadRelevantTeachers = () => {

    // Subject select karala naththam teacher dropdown eka clear krnawa
    if (classdetail.subjectdetail_id == null) {
        loadSelectOptions(selectTeacher, [], "Select Teacher...!", "fullname");
        return;
    }

    // Selected subject id eka gnnawa
    let subjectId = classdetail.subjectdetail_id.id;

    // Backend eken selected subject ekata adala teachers gnnawa
    let teachers = getDataAjaxGetRequest(`/teacher/bysubject/${subjectId}`);

    // Teacher dropdown ekata teachers load krnawa
    loadSelectOptions(selectTeacher, teachers, "Select Teacher...!", "fullname");
}

//define  function for classdetail form error check
const checkClassDetailFormError = () => {
    let errors = "";
    //grade area check
    if (classdetail.grade_id == null) {
        errors += "Grade can't be null...! \n";
        selectGrade.style.border = "1px solid red";
    }
    //subjet area check
    if (classdetail.subjectdetail_id == null) {
        errors += "Subject can't be null...! \n";
        selectSubject.style.border = "1px solid red";
    }
    //teacher area check
    if (classdetail.teacher_id == null) {
        errors += "Teacher can't be null...! \n";
        selectTeacher.style.border = "1px solid red";
    }
    //class name area check
    if (classdetail.classname == null) {
        errors += "Class Name can't be null...! \n";
        textClassName.style.border = "1px solid red";
    }
    //class status are check
    if (classdetail.classdetailstatus_id == null) {
        errors += "Class Status can't be null...! \n";
        selectClassStatus.style.border = "1px solid red";
    }

    return errors;// errors return karanawa
}
// define function for class detail form submission
const buttonClassDetailSubmit = () => {

    // check karanawa required fields okkoma valid da kiyala
    let errors = checkClassDetailFormError();

    if (errors === "") {
        // confirm msg ekak pennanawa userta
        let message = "Are you sure you want to submit the following Class Detail?";

        // SweetAlert2 confirm popup
        Swal.fire({
            title: "Confirm Submission",
            html: message,
            icon: "question",               // question mark icon
            showCancelButton: true,          // Cancel button pennanawa
            confirmButtonColor: "#3085d6",   // Confirm button color
            cancelButtonColor: "#d33",       // Cancel button color
            confirmButtonText: "Yes, submit!", // Confirm button text
            cancelButtonText: "Cancel"       // Cancel button text
        }).then((result) => {

            // user "Yes, submit!" click karoth
            if (result.isConfirmed) {

                // user "OK" kiwwama service ekata data yawanna
                // me line eka POST request ekak backend ekata yawanna
                // setDataAjaxGetRequest → API call eka karanawa (POST method ekin)
                const postResponse = setDataAjaxGetRequest("/classdetail/insert", "POST", classdetail);
                if (postResponse === "OK") {
                    // success SweetAlert popup
                    Swal.fire({
                        title: "Saved!",
                        text: "Class Detail saved successfully!",
                        icon: "success"
                    });

                    // page eka reload karanna epa, only form & table refresh karanawa
                    loadClassDetailForm(); // form area eka refresh karanawa
                    loadClassDetailTable(); // table area eka refresh karanawa

                } else {
                    // service error ekak nam error popup
                    Swal.fire({
                        title: "Error!",
                        html: "Save not completed. Some errors occurred:<br><br>" + postResponse,
                        icon: "error"
                    });
                }
            }
            // user Cancel click karoth → mokuth karanne na
        });

    } else {
        // validation error thiyenawanam error popup pennanawa
        Swal.fire({
            title: "Validation Error",
            html: "Save not completed. Some errors occurred:<br><br>" + errors,
            icon: "warning"
        });
    }
}

// class detail print karanna hadapu function eka define karanawa
const printClassDetail = (dataOb) => {
    classdetail = dataOb;

    // print details table fill karanawa (modal eka assume karanawa)
    tdGrade.innerText = classdetail.grade_id.name;
    tdSubject.innerText = classdetail.subjectdetail_id.name;
    tdTeacher.innerText = classdetail.teacher_id.fullname;
    tdClassName.innerText = classdetail.classname;
    tdStatus.innerText = classdetail.classdetailstatus_id.name;

    $("#modalClassDetailPrint").modal("show");
}
// Print button eka click karama call wenna function eka
const buttonPrint = () => {
    // Aluth tab ekak open karanawa
    const newTab = window.open();
    // Print page eka create karanawa
    newTab.document.writeln(
        "<html><head><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'><title>Print Class Detail</title></head>" +
        "<body>" +
        "<h2>Print Class Detail</h2>" +
        tablePrintClassDetail.outerHTML +
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
    $("#modalClassDetailPrint").modal("hide");
}

// define function to edit class detail records
const editClassDetail = (dataOb) => {
    // classdetail = dataOb;
    // oldClassDetail = dataOb;
    // mehema use krnna ba mokada methana reference variable wage hasirennne...
    //  classdetail, oldClassDetail eke thiyenne ekama memory address ekane.
    // e nisa apita update wunu widiha hoyanna ba, dekama enne ekama value.
    //  classdetail object ekata changes karoth,
    // oldClassDetail ekatath ehema change wenawa (eka object ekak nisa).

    // ithin e nisa reference eka galawanna ona.
    // mehema wela thiyenne object gaththa nisa (object type eke thiyenawa reference ekak).
    // eka string ekakata convert krgannwa (deep copy hadanna).
    // but string ekata convert karama access krnna ba,
    // e nisa eka aye object ekakata path krgnna JSON ekenma.
    // -> JSON.stringify() : object ekata string ekakata hadanawa.
    // -> JSON.parse() : string ekata object ekakata hadanawa.
    // mehema krama eken deep copy ekak hadanawa.

    // open Add Classdetail tab
    new bootstrap.Tab(document.querySelector('button[data-bs-target="#tabFormArea"]')).show();
    tabFormButton.innerText = "Update Classdetail";

    classdetail = JSON.parse(JSON.stringify(dataOb));
    oldClassDetail = JSON.parse(JSON.stringify(dataOb));

    // classdetail Name input eka fill karanawa
    textClassName.value = classdetail.classname;

    // Dynamic select elements
    // object eka string format eken assign karanawa
    selectGrade.value = JSON.stringify(classdetail.grade_id);
    selectGrade.disabled = true;
    selectSubject.value = JSON.stringify(classdetail.subjectdetail_id);
    selectSubject.disabled = true;
    selectTeacher.value = JSON.stringify(classdetail.teacher_id);
    selectTeacher.disabled = true;

    classdetailStatusLabel.style.display = "block";
    classdetailStatusSelect.style.display = "block";

    selectClassStatus.value = JSON.stringify(classdetail.classdetailstatus_id);


    // Buttons control
    buttonSubmit.style.display = "none";  // submit button hide
    buttonUpdate.style.display = "block"; // update button show
    buttonClear.style.display = "none";  // clear button hide
}

// define function to get the changes made in the classdetail form
const checkClassDetailFormUpdate = () => {
    let updates = "";

    // check karanawa classdetail object dekama null nadda kiyala
    if (classdetail != null && oldClassDetail != null) {

        //class name change unada kiyala check karanawa
        /* if (classdetail.classname != oldClassDetail.classname) {
            updates += "Class Name changed: " + oldClassDetail.classname + " --> " + classdetail.classname + "\n";
        } */
        //grade change unada kiyala check karanawa
        /* if (classdetail.grade_id.name != oldClassDetail.grade_id.name) {
            updates += "Grade changed: " + oldClassDetail.grade_id.name + " --> " + classdetail.grade_id.name + "\n";
        } */
        //subject change unada kiyala check karanawa
        /* if (classdetail.subjectdetail_id.name != oldClassDetail.subjectdetail_id.name) {
            updates += "Subject changed: " + oldClassDetail.subjectdetail_id.name + " --> " + classdetail.subjectdetail_id.name + "\n";
        } */
        //teacher change unada kiyala check karanawa
        /* if (classdetail.teacher_id.fullname != oldClassDetail.teacher_id.fullname) {
            updates += "Teacher changed: " + oldClassDetail.teacher_id.fullname + " --> " + classdetail.teacher_id.fullname + "\n";
        } */
        // status change unada kiyala check karanawa
        if (classdetail.classdetailstatus_id.name != oldClassDetail.classdetailstatus_id.name) {
            updates += "Status changed: " + oldClassDetail.classdetailstatus_id.name + " --> " + classdetail.classdetailstatus_id.name + "\n";
        }
    }
    // all updates return karanawa
    return updates;
}

// define function for update classdetail records
const buttonClassDetailUpdate = () => {

    console.log(classdetail); // console ekata classdetail object eka print karanawa

    // form eke validation errors thiyenawada kiyala check karanawa
    let errors = checkClassDetailFormError();

    // errors naththam update process ekata yanna
    if (errors === "") {

        // form eke changes thiyenawada kiyala check karanawa
        let updates = checkClassDetailFormUpdate();

        // changes naththam
        if (updates === "") {

            // form eke changes nathi nisa info msg ekak pennanawa
            Swal.fire({
                title: "No Changes",
                text: "Form hasn't any changes!",
                icon: "info",
                allowOutsideClick: false
            });

        } else {

            // user ta confirm msg ekak pennanawa (update details tika pennala)
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

                // user "Yes, update" click karoth
                if (result.isConfirmed) {

                    // backend ekata PUT request ekak yawanne classdetail object ekath ekka
                    let updateResponse = setDataAjaxGetRequest("/classdetail/update", "PUT", classdetail);

                    // update success nam
                    if (updateResponse === "OK") {

                        // success msg ekak pennanawa
                        Swal.fire({
                            title: "Updated!",
                            text: "Class Detail updated successfully!",
                            icon: "success"
                        });

                        loadClassDetailForm();   // form eka clear karanawa
                        loadClassDetailTable();  // table eka refresh karanawa

                    } else {

                        // update fail nam error msg ekak pennanawa
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

        // validation errors thiyenawanam warning msg ekak pennanawa
        Swal.fire({
            title: "Validation Error!",
            html: "Update not completed.<br><br>" +
                errors.replace(/\n/g, "<br>"),
            icon: "warning"
        });
    }
}

// define method for classdetail delete
const deleteClassDetail = (dataOb) => {

    // data object eka local variable ekakata assign karanawa
    const classdetail = dataOb;
    // SweetAlert eke pennanna one message eka hadanawa
    const message =
        "<b>Class Name:</b> " + classdetail.classname;

    // common delete function eka call karanawa
    deleteWithConfirm(classdetail, message, "/classdetail/delete", () => {
        // success unama passe form eka reset + table reload
        loadClassDetailForm();
        loadClassDetailTable();

    });
}
