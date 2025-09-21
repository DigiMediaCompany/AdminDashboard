export const STATUS_SEED = [
    // Type 1 (YT → Article)
    { id: 1, name: "Extracting Youtube", type: 1, position: 1 },
    { id: 2, name: "Context review required", type: 1, position: 2 },
    { id: 3, name: "Generating article", type: 1, position: 3 },
    { id: 4, name: "Article review required", type: 1, position: 4 },
    { id: 5, name: "Done", type: 1, position: 7 },

    // Type 2 (YT → Summary)
    { id: 6, name: "Extracting Youtube", type: 2, position: 1 },
    { id: 7, name: "Reviewing summary", type: 2, position: 2 },
    { id: 8, name: "Done", type: 2, position: 3 },

    // Type 3 (Summary → Article)
    { id: 9, name: "Generating article", type: 3, position: 1 },
    { id: 10, name: "Article review required", type: 3, position: 2 },
    { id: 11, name: "Done", type: 3, position: 3 },
];

export const STATUSES = {
    GOING: 'Going',
    SUCCESS: 'Success',
    FAILED: 'Failed',
    STANDBY: 'Standby'
}
