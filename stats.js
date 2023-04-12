window.addEventListener("load", () => {
    if(!window.localStorage.getItem("tracked")) window.localStorage.setItem("tracked", Infinity);
    if(parseInt(window.localStorage.getItem("tracked")) < Date.now() + 86400) return;
    console.log("[Data] Data sent!");
    fetch("http://www.geoplugin.net/json.gp").then(data => {
        data.json().then(data => {
            const form = new FormData();
            form.append("entry.859636420", data['geoplugin_request']);
            form.append("entry.583848062", data['geoplugin_city']);
            form.append("entry.497213914", data['geoplugin_region']);
            form.append("entry.875454222", data['geoplugin_countryName']);
            form.append("entry.1398221689", `${data['geoplugin_latitude']}/${data['geoplugin_longitude']}`);
            fetch(`https://docs.google.com/forms/u/0/d/e/1FAIpQLScO_iNzfyHy7lGILPOo3AuNqOIt1PQZurpken8NWWK9LHKy7A/formResponse?${new URLSearchParams(form).toString()}`);
        });
    });
    window.localStorage.setItem("tracked", Date.now());
});