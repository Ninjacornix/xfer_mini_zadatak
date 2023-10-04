import React, {useState} from "react";

export default function NewGame({user}: {user: any}) {

    const [name, setName] = useState("")

    const handleClick = () => {
        if(name == "") return
        user.resetScore()
        user.removeData()
        user.enteredUser(name)
    }

    const handleChanged = (e: any) => {
        setName(e.target.value)
    }

    return(
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "15px",
                width: "90%",
                height: "90%",
                backgroundColor: "white",
                margin: "auto",
                marginTop: "10px",
                marginBottom: "10px",
            }}
        >

            <h1
                style={{
                    color: "black",
                    fontSize: "20px",
                    textAlign: "center",
                }}
            >New Game</h1>

            <input type="text"
                style={{
                    borderColor: "gray",
                    borderRadius: "5px",
                    borderStyle: "solid",
                    borderWidth: "1px",
                    color: "black",
                }}
                onChange={handleChanged}
                placeholder="Enter your name"
            ></input>
            <button
                style={{
                    color: "black",
                    backgroundColor: "#90EE90",
                    borderRadius: "10px",
                }}

                onClick={handleClick}
            >Submit</button>
        </div>
    )
    
}