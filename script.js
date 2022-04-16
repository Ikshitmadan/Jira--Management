
let addbtn=document.querySelector(".add-btn");
let removebtn=document.querySelector(".remove-btn");
let colors=["lightblue","lightgreen","black","lightpink"];
let modalbtn=document.querySelector(".modal-cont")
let maincont=document.querySelector(".main-cont");
let textarea=document.querySelector(".textarea-cont")
let flag=false;
let prioritycolor=document.querySelectorAll(".priority-color");
let ticketcolor="";
let removeflag=false;
let lockclass="fa-lock";
let Unlockclass="fa-lock-open";
let ticketArr = [];
let Ticketarr=[];
let toolboxColors=document.querySelectorAll(".color");
let removeFlag=false;
if (localStorage.getItem("jira_tickets")) {
    // Retrive and display tickets
    ticketArr = JSON.parse(localStorage.getItem("jira_tickets"));
    // Create the existing tickets
    ticketArr.forEach((ticketObj) => {
        createticket(ticketObj.ticketcolor, ticketObj.ticketid, ticketObj.tickettext);
    })
}
for (let i = 0; i < toolboxColors.length; i++) {
    let selectedToolBoxColor = toolboxColors[i].classList[0];

    toolboxColors[i].addEventListener("click", (e) => {
        let allTickets = document.querySelectorAll(".ticket-cont");
        let allTicketsColor = document.querySelectorAll(".ticket-color");

        for (let j = 0; j < allTickets.length; j++) {
            if (selectedToolBoxColor !== allTicketsColor[j].classList[1]) {
                allTickets[j].style.display = "none";
            } else {
                allTickets[j].style.display = "block";
            }
        }

    })

    

    toolboxColors[i].addEventListener("dblclick", (e) => {
        let allTickets = document.querySelectorAll(".ticket-cont");
        let allTicketsColor = document.querySelectorAll(".ticket-color");

        for (let j = 0; j < allTickets.length; j++) {
            allTickets[j].style.display = "block";
        }
    })




}















prioritycolor.forEach(colorele => {
  colorele.addEventListener("click",()=>{
      prioritycolor.forEach(colorems=>{
          colorems.classList.remove("border");
      })
      colorele.classList.add("border");
      ticketcolor=colorele.classList[0];
    //   console.log(textcolor);
  })
    
});

removebtn.addEventListener("click", (e) => {
    removeFlag = !removeFlag;
})


    

 


addbtn.addEventListener("click",()=>{
   flag=!flag;
   if(flag)
   {
       modalbtn.style.display="flex";
   }
   else{
       modalbtn.style.display="none"
   }
})

modalbtn.addEventListener("keydown",(e)=>{
    let keyval=e.key;
    console.log(e.key);
    if(keyval=="Shift")
    {
        let text=textarea.value;
        textarea.value = '';
        modalbtn.style.display="none";

        
        createticket(ticketcolor,shortid(),text);
    }
})

function createticket(ticketcolor,ticketid,tickettext)
{
    console.log(ticketcolor);
    let ticketcont=document.createElement("div");
    ticketcont.setAttribute("class","ticket-cont");
    ticketcont.innerHTML=`  <div class="ticket-color  ${ticketcolor}"></div>
    <div class="ticket-id">${ticketid}</div>
    <div class="task-area">${tickettext}
    
    </div>
    <div class="lock"><i class="fa-solid fa-lock"></i>
    </div>
    
    
    `;
    let ticketIdx = getTicketIdx(ticketid);
    if (ticketIdx === -1) {
        //*️⃣Creating an object of ticket and pushing in the ticket array
        ticketArr.push({ ticketcolor, tickettext, ticketid });
        //*️⃣Creating a local storage and adding array as a object
        localStorage.setItem("jira_tickets", JSON.stringify(ticketArr));
    }

       maincont.appendChild(ticketcont);
     
       
      

       handleRemoval(ticketcont,ticketid);
       handleLock(ticketcont,ticketid);
       handlecolor(ticketcont,ticketid);
}



function   handleLock(ticket,id) {
    let ticketLockEle=ticket.querySelector(".lock");
    let ticketLock=ticketLockEle.children[0];
    let TicketTaskArea=ticket.querySelector(".task-area");
    ticketLock.addEventListener("click",()=>{

        if(ticketLock.classList.contains(lockclass)){
            ticketLock.classList.remove(lockclass);
            ticketLock.classList.add(Unlockclass);
            TicketTaskArea.setAttribute("contenteditable", "true");
        }
        else{
            ticketLock.classList.remove(Unlockclass);
            ticketLock.classList.add(lockclass);
           TicketTaskArea.setAttribute("contenteditable", "false");


        }
        let ticketIdx=getTicketIdx(id);
        ticketArr[ticketIdx].tickettext = TicketTaskArea.innerText;
        localStorage.setItem("jira_tickets", JSON.stringify(ticketArr));
    })

}


function handlecolor(ticket,ticketid) 
{
let togglecolor=ticket.querySelector(".ticket-color");
togglecolor.addEventListener("click",()=>{
    let currcoloridx=0;
    let currcolor=(togglecolor.classList)[1];
    console.log(`the color of toggle is${currcolor}`);
     currcoloridx=colors.findIndex((color)=>{
    
        return  currcolor===color;
     })
     currcoloridx=(currcoloridx+1)%colors.length;
    console.log(currcoloridx);
    let newTicketcolor=colors[currcoloridx];
    
    togglecolor.classList.remove(currcolor);
    togglecolor.classList.add(newTicketcolor);

    
    let ticketIdx = getTicketIdx(ticketid);
    ticketArr[ticketIdx].ticketcolor = newTicketcolor;
        localStorage.setItem("jira_tickets", JSON.stringify(ticketArr));
});

}

function getTicketIdx(id) {
    let ticketIdx = ticketArr.findIndex((ticketObj) => {
        return ticketObj.ticketid=== id;
    });
    return ticketIdx;
}


function handleRemoval(ticket, id) {
    ticket.addEventListener("click", (e) => {
        // removeFlag -> True, remove the ticket
        if (removeFlag) {
            //Get ticket index from ticket array : so that we can update the data after deletion of some tickets in local storage
            let ticketIdx = getTicketIdx(id);
            
            //* Modify data in local storage and ticket array : (Some tickets Deleted)
            ticketArr.splice(ticketIdx, 1);
            localStorage.setItem("jira_tickets", JSON.stringify(ticketArr));
            ticket.remove();
        }
    })
}
