const AccountButton = document.getElementById("SignIn")
let currentPrivateCode = ''

function GetCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function SetCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

async function parseLoginCode_() {
    if (!currentPrivateCode) throw new Error('Private code not present');
    const req = await fetch(`https://pm-bapi.vercel.app/api/verifyToken?privateCode=${currentPrivateCode}`);
    const json = await req.json();
    this.loginInfo = {
        valid: json.valid,
        username: json.username
    };
    return this.loginInfo;
}

function Login(){
    // reset
    this.promptStatus = {
        inProgress: true,
        blocked: false,
        completed: false,
        userClosed: false,
    };
    this.loginInfo = {};

    const loginLocation = "SnowShare";
    const sanitizedName = encodeURIComponent(loginLocation.substring(0, 256).replace(/[^a-zA-Z0-9 _\-\.\[\]\(\)]+/gmi, ""));
    const waitingLink = `https://studio.penguinmod.com/scratchAuthExt.html?openLocation=${encodeURIComponent(window.origin)}`;

    // listen for events before opening
    let login;
    let finished = false;
    const listener = (event) => {
        if (event.origin !== (new URL(waitingLink)).origin) {
            return;
        }
        if (!(event.data && event.data.scratchauthd1)) {
            return;
        }

        const data = event.data.scratchauthd1;

        const privateCode = data.pv;
        currentPrivateCode = privateCode;

        // update status
        this.promptStatus.inProgress = false;
        this.promptStatus.completed = true;

        finished = true;
        window.removeEventListener("message", listener);
        login.close();

        console.log(parseLoginCode_())
        parseLoginCode_().then((Obj) => {
            console.log(Obj)
            localStorage.setItem("ScratchUsername", Obj.username)
            location.reload()
        })
        
    };
    window.addEventListener("message", listener);

    // open prompt
    login = window.open(
        `https://auth.itinerary.eu.org/auth/?redirect=${btoa(waitingLink)}${sanitizedName.length > 0 ? `&name=${sanitizedName}` : ""}`,
        "Scratch Authentication",
        `scrollbars=yes,resizable=yes,status=no,location=yes,toolbar=no,menubar=no,width=768,height=512,left=200,top=200`
    );
    if (!login) {
        // popup was blocked most likely
        this.promptStatus.inProgress = false;
        this.promptStatus.blocked = true;
        return;
    }

    // .onclose doesnt work on most platforms it seems
    // so just set interval
    const closedInterval = setInterval(() => {
        if (!login.closed) return;

        this.promptStatus.inProgress = false;
        if (!finished) {
            this.promptStatus.userClosed = true;
        }
        window.removeEventListener("message", listener);
        clearInterval(closedInterval);
    }, 500);
}

if (localStorage.getItem("ScratchUsername")) {
    AccountButton.id = "SignOut"
    AccountButton.textContent = "Sign out"
    AccountButton.style = ''

    AccountButton.addEventListener('click', () => {
        localStorage.removeItem("ScratchUsername")
        SetCookie("AccountUsr", '', 0)
        location.reload()
    });
} else {
    AccountButton.id = "SignIn"
    AccountButton.textContent = "Sign in"
    AccountButton.style = ''

    AccountButton.addEventListener('click', () => {
        Login()
    });
}