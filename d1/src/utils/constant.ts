export const STATUS_SEED = [
    // Type 1 (YT → Article)
    { id: 1, name: "Extracting Youtube", type: 1, position: 1 },
    { id: 2, name: "Context review required", type: 1, position: 2 },
    { id: 3, name: "Generating article", type: 1, position: 3 },
    { id: 4, name: "Article review required", type: 1, position: 4 },

    // Type 2 (YT → Summary)
    { id: 5, name: "Extracting Youtube", type: 2, position: 1 },
    { id: 6, name: "Reviewing summary", type: 2, position: 2 },

    // Type 3 (Summary → Article)
    { id: 7, name: "Generating article", type: 3, position: 1 },
    { id: 8, name: "Article review required", type: 3, position: 2 },
];
// TODO: make this an actual seeding (currently not matching with actual seeding)

export const STATUSES = {
    GOING: 'Going',
    SUCCESS: 'Success',
    FAILED: 'Failed',
    STANDBY: 'Standby'
}
