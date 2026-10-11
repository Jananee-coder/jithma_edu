//--------------------------------------
//-----------   Module hide/show--------
//--------------------------------------
// me function eken karanne main <li> element ekata adala
// sub menu okkoma hide wela nam main menu ekath hide karanawa.
// habai eka sub menu ekak hari display nam main menu eka show karanawa.
const toggleMainMenuVisibility = (mainLi) => {

    // element ekak nathnam function eken eliyata yanna
    if (!mainLi) return;

    // main <li> eka athule thiyena sub <li> elements ganna
    const subMenus = mainLi.querySelectorAll("ul > li");

    // sub menu nathnam monawath karanna epa
    // meka Dashboard wage submenu nathi menu walata
    if (subMenus.length === 0) {
        return;
    }

    // eka sub menu ekak hari display wela tiyanawada kiyala balanna
    const hasVisibleMenu = [...subMenus].some(menu =>
        window.getComputedStyle(menu).display !== "none"
    );

    // sub menu ekak hari display nam main menu eka show karanna
    // nathnam main menu eka hide karanna
    mainLi.style.display = hasVisibleMenu ? "block" : "none";
}


//--------------------------------------
//-----------   Report hide/show--------
//--------------------------------------
// Login wela inna userge role eka backend eken gannawa
loggedUserRole = getDataAjaxGetRequestForString("/rolecheck/whatisloggeduserrole");

// User role eka console eke balagannawa
console.log(loggedUserRole);

// Logged user role eka anuwa reports show/hide karanawa

if (loggedUserRole == "Manager") {

    // Manager ta siyalu reports pennanawa
    batchwisereport.style.display = "block";
    studentattreport.style.display = "block";
    batchattreport.style.display = "block";
    dailyreport.style.display = "block";
    monthlyreport.style.display = "block";
    yearlyreport.style.display = "block";
    rolewisecashreport.style.display = "block";
    managerreport.style.display = "block";

} else if (loggedUserRole == "Coordinator") {

    // Coordinator ta student saha attendance reports pennanawa
    batchwisereport.style.display = "block";
    studentattreport.style.display = "block";
    batchattreport.style.display = "block";
    rolewisecashreport.style.display = "block";

    // Analytics reports hide karanawa
    dailyreport.style.display = "none";
    monthlyreport.style.display = "none";
    yearlyreport.style.display = "none";
    managerreport.style.display = "none";

} else if (loggedUserRole == "Receptionist") {

    // Receptionist ta Batch-wise Student saha Receptionist Cash Collection report pennanawa
    batchwisereport.style.display = "block";
    rolewisecashreport.style.display = "block";

    // Anith reports hide karanawa
    studentattreport.style.display = "none";
    batchattreport.style.display = "none";
    dailyreport.style.display = "none";
    monthlyreport.style.display = "none";
    yearlyreport.style.display = "none";
    managerreport.style.display = "none";

} else if (loggedUserRole == "Card-Checker") {

    // Card-Checker ta student saha attendance reports pennanawa
    batchwisereport.style.display = "block";
    studentattreport.style.display = "block";
    batchattreport.style.display = "block";

    // Analytics saha cash collection reports hide karanawa
    dailyreport.style.display = "none";
    monthlyreport.style.display = "none";
    yearlyreport.style.display = "none";
    rolewisecashreport.style.display = "none";
    managerreport.style.display = "none";
}


//--------------------------------------
//----Main menu visibility check--------
//--------------------------------------
// Logged user ta adala modules load karanawa
let modulesByLoggedUser = getDataAjaxGetRequest("/loggedusermodule");

// Backend eken ena module list eka loop karanawa
for (const module of modulesByLoggedUser) {

    // Testing walata console eke balanna
    console.log(module);

    // Permission nathi module hide karanawa
    $("." + module.name).css("display", "none");
}

// Siyalu main menus check karala
// sub menu okkoma hide wela nam main menu ekath hide karanawa
document.querySelectorAll(".sidebar > ul > li").forEach(mainMenu => {
    toggleMainMenuVisibility(mainMenu);
});

