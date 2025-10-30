

export default function UserManager(){
    return (
        <div className="p-5 flex flex-col">
            <div className={"border text-center"}>
                User Management
            </div>
            <div className={"p-5 border flex flex-row justify-between content-center"}>
                <div className={"flex flex-col justify-center"}>
                    Username:
                    <input className={"border"}/>
                </div>
                <div className={"flex flex-col "}>
                    <BanButton label={"Unban"}/>
                    <BanButton label={"Ban"}/>
                </div>
            </div>
        </div>
    )
}

function BanButton({ onClick, label}){
    return (<button
        onClick= {onClick}
        className={"border rounded m-1 pl-2 pr-2 hover:bg-gray-200 transition-colors cursor-pointer"}>
        {label}
    </button>)
}