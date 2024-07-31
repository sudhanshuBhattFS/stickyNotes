//import additional files required for background
try {
    importScripts(
        "scripts/custom_script/localdb.js",
        "scripts/custom_bgScripts/autoRef.js",
        "scripts/custom_bgScripts/mainBg.js",
    );
} catch (e) {
    console.log("Error Importing background scripts ", e);
}
