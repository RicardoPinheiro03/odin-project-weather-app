// Sidebar animation
document.addEventListener("DOMContentLoaded", () => {
    const navbar:HTMLElement = document.getElementById("navbar")!;
    const sidebar:HTMLElement = document.getElementById("sidebar")!;
    const btnSidebarToggler:HTMLElement = document.getElementById("btnSidebarToggler")!;
    const navClosed:HTMLElement = document.getElementById("navClosed")!;
    const navOpen:HTMLElement = document.getElementById("navOpen")!;

    btnSidebarToggler.addEventListener("click", (e) => {
        e.preventDefault();
        sidebar.classList.toggle("show");
        navClosed.classList.toggle("hidden");
        navOpen.classList.toggle("hidden");
    });

    sidebar.style.top = navbar.clientHeight - 1 + "px";
});