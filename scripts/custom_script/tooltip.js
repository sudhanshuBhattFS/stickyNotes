// Initialize tooltips for various buttons

// Tooltip for the 'Remove All Notes' button
tippy('.removeAll', {
    content: getDeleteAllNotesMessage(),
    placement: 'top',
    theme: 'clean'
});

// Tooltip for the 'Open Tab' button
tippy('#openTabButton', {
    content: getSettingsPreferencesMessage(),
    placement: 'top',
    theme: 'clean'
});

// Tooltip for the 'Add Note' button
tippy('#add-note', {
    content: getAddNewNoteMessage(),
    placement: 'top',
    theme: 'clean'
});

// Tooltip for the 'Refresh' button
tippy('#refresh', {
    content: getRefreshNotesMessage(),
    placement: 'bottom',
    theme: 'clean'
});

// Tooltip for the 'Grid View' button
tippy('.grid', {
    content: getGridViewMessage(),
    placement: 'bottom',
    theme: 'clean'
});
