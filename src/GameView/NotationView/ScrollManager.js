
let ScrollManager = {
    scrollToActiveMove : () =>{
        let e = document.getElementsByClassName("move active");
        if(e.length > 0){
            e[0].scrollIntoView();
            return;
        }
        e = document.getElementsByClassName("subline-move active")
        if(e.length > 0){
            e[0].scrollIntoView();
            return;
        }
    }
};
export default ScrollManager;