let selectGrade = document.querySelector("#selectGrade");
let selectTeacher = document.querySelector("#selectTeacher");
let selectBatch = document.querySelector("#selectBatch");

// grade list 
// DB eken okkoma grades ganna -> dropdown ekata load karanna
let grades = getDataAjaxGetRequest("/grade/alldata");
loadSelectOptions(selectGrade, grades, "Select Grade...!", "name");

// define loadBatch function
function loadBatch() {

    // grade ho teacher select karala nathnam function eka nawathanna
    if (selectGrade.value === "" || selectTeacher.value === "") {
        return;
    }

    // selected grade id eka ganna
    let gradeId = JSON.parse(selectGrade.value).id;

    // selected teacher id eka ganna
    let teacherId = JSON.parse(selectTeacher.value).id;

    // selected grade saha teacher ta adala batches DB eken ganna
    let batches = getDataAjaxGetRequest(
        "/batch/bygradeandteacher/" + gradeId + "/" + teacherId
    );

    // batch list eka dropdown ekata load karanna
    loadSelectOptions(selectBatch, batches, "Select Batch...!", "batchname");
}

// grade change unama
// selected grade ekata adala teachers load karanna
selectGrade.addEventListener("change", () => {

    // teacher dropdown eka clear karanna
    selectTeacher.innerHTML = "";

    // batch dropdown eka clear karanna
    selectBatch.innerHTML = "";

    // grade ekak select karala nathnam function eka nawathanna
    if (selectGrade.value === "") {
        return;
    }

    // selected grade id eka ganna
    let gradeId = JSON.parse(selectGrade.value).id;

    // selected grade ekata adala teachers DB eken ganna
    let teachers = getDataAjaxGetRequest("/teacher/bygrade/" + gradeId);

    // teacher list eka dropdown ekata load karanna
    loadSelectOptions(
        selectTeacher,
        teachers,
        "Select Teacher...!",
        "fullname"
    );
});

// teacher change unama batch load karanna
selectTeacher.addEventListener("change", loadBatch);

// define generateBatchWiseStudentReport function
const generateBatchWiseStudentReport = () => {

    // batch ekak select karala nathnam message ekak pennanna
    if (selectBatch.value === "") {
        alert("Please Select a Batch");
        return;
    }

    // selected batch id eka ganna
    let batchId = JSON.parse(selectBatch.value).id;

    // selected batch ekata adala student list eka DB eken ganna
    let studentList = getDataAjaxGetRequest(
        "/report/batchwisestudentreport/" + batchId
    );

    // display karana columns define karanna
    let displayColumns = [
        { dataType: "string", property: "regno" },
        { dataType: "string", property: "fullname" },
        { dataType: "string", property: "whatsapno" }
    ];

    // table body ekata data load karanna
    loadTableDataInner(
        tableBodyBatchWiseStudent,
        studentList,
        displayColumns
    );

    // datatable active karanna
    $('#tableBatchWiseStudent').DataTable();
}

// define button print
const buttonPrint = () => {

    // aluth tab ekak open karanna
    const newTab = window.open();

    // print page content eka generate karanna
    newTab.document.writeln(
        "<html>" +
        "<head>" +
        "<link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'>" +
        "<title>Jithma Institute - Batch-wise Student Report</title>" +
        "</head>" +
        "<body class='p-4'>" +
        "<div class='text-center mb-4'>" +
        "<h2>Jithma Institute</h2>" +
        "<h4>Batch-wise Student Report</h4>" +
        "</div>" +
        tableBatchWiseStudent.outerHTML +
        "</body>" +
        "</html>"
    );

    // page eka render wenakan balan innawa
    newTab.document.close();

    // print dialog eka open karanna saha tab eka wahanna
    setTimeout(() => {
        newTab.print();
        newTab.close();
    }, 250);
}