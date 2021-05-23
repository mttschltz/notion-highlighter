import OptionsSync from 'webext-options-sync';

export default new OptionsSync({
    defaults: {
        integrationToken: '',
        rootPageID: ''
    },
    logging: true
});