
try {
    importScripts(
        "scripts/custom_script/localdb.js",
        "scripts/custom_bgScripts/autoRef.js",
        "scripts/custom_bgScripts/mainBg.js",
        "scripts/custom_bgScripts/tabListner.js"
    );
} catch (e) {
    console.log("Error Importing background scripts ", e);
}
