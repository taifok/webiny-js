module.exports = {
    type: "cli-command",
    name: "cli-command-login",
    create({ yargs, context }) {
        yargs.command("login", "Log in to the Webiny Control Panel.", async () => {
            console.log('moze')
        });

    }
};
