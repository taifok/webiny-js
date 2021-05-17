export const registerServiceWorker = () => {
    // Check that service workers are supported
    if ("serviceWorker" in navigator) {
        // Use the window load event to keep the page load performant
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("/service-worker.js", { scope: "/" }).then(
                function(registration) {
                    console.log("registration", registration);
                    // Registration was successful
                    console.log(
                        "ServiceWorker registration successful with scope: ",
                        registration.scope
                    );
                },
                function(err) {
                    // registration failed :(
                    console.log("ServiceWorker registration failed: ", err);
                }
            );
        });
    }
};
