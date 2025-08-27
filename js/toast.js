const containerId = "toastContainer";

// export function showToast(message, type = "info", duration = 3000) {
//     const container = getContainer();
//
//     const toast = document.createElement("div");
//     toast.className = `toast toast-${type}`;
//     toast.textContent = message;
//
//     container.appendChild(toast);
//
//     setTimeout(() => {
//         toast.classList.add("fade-out");
//         setTimeout(() => toast.remove(), 500);
//     }, duration);
// }
//
// function getContainer() {
//     let container = document.getElementById(containerId);
//     if (!container) {
//         container = document.createElement("div");
//         container.id = containerId;
//         container.className = "toast-container";
//         container.setAttribute("aria-live", "polite");
//         container.setAttribute("aria-atomic", "true");
//         document.body.appendChild(container);
//     }
//     return container;
// }
//


const Toast = (()=>{
    const containerId = "toastContainer";

    function getContainer(){
        let container = document.getElementById(containerId);
        if(!container){
            container = document.createElement("div");
            container.id = containerId;
            container.className="toast-container";
            container.setAttribute("aria-live", "polite");
            container.setAttribute("aria-atomic", "true");
            document.body.appendChild(container);
        }
        return container;
    }

    function showToast(message, type= "info", duration = 3000){
        const container = getContainer();

        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(()=>{
            toast.classList.add("fade-out");
            setTimeout(()=>toast.remove(), 500);
        }, duration);
    }

    return {showToast}
})();