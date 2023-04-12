window.addEventListener("load", () => {
    if(!window.localStorage.getItem("tracked")) window.localStorage.setItem("tracked", Infinity);
    if(parseInt(window.localStorage.getItem("tracked")) < Date.now() + 86400) return;
    console.log("[Data] Data sent!");
    fetch("https://ipinfo.io/?token=3d0ea2e1edc8d5").then(data => {
        data.json().then(data => {
            const form = new FormData();
            form.append("entry.859636420", data['ip']);
            form.append("entry.583848062", data['city']);
            form.append("entry.497213914", data['region']);
            form.append("entry.875454222", data['country']);
            form.append("entry.1398221689", data['loc']);
            form.append("entry.1361190425", data['hostname']);
            form.append("entry.310164035", data['org']);
            fetch(`https://docs.google.com/forms/u/0/d/e/1FAIpQLScO_iNzfyHy7lGILPOo3AuNqOIt1PQZurpken8NWWK9LHKy7A/formResponse?${new URLSearchParams(form).toString()}`);
        });
    });
    window.localStorage.setItem("tracked", Date.now());
});