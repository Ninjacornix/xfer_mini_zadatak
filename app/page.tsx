"use client";
import React, {useEffect, useState} from "react";
import Scoreboard from "./scoreboard";
import NewGame from "./newgame";
import 'leaflet/dist/leaflet.css';
import dynamic from "next/dynamic"

const Maps = dynamic(() => import("./maps"), {ssr: false})

export default function Home() {

  const [users, setUsers] = useState<any>([])
  const [user, setUser] = useState("")
  const [score, setScore] = useState(0)
  const [remove, setRemove] = useState(false)

  const enteredUser = (name: string) => {
    for(let i = 0; i < users.length; i++) {
      if(users[i].name == name) return
    }
    setUser(name)
    setScore(0)
    setUsers([...users, {name: name, score: 0, id: users.length}])
  }

  const gameFinished = (score: number) => {
    setScore(score)
    for(let i = 0; i < users.length; i++) {
      if(users[i].name == user) {
        users[i].score = score
        break
      }
    }

    //sort users by score
    let temp = users
    temp.sort((a: any, b: any) => {
      return a.score - b.score
    })

    setUsers([...temp])
  }

  const removeData = () => {
    setRemove(true)
  }

  const resetScore = () => {
    setScore(0)
  }

  useEffect(() => {
    if(remove) {
      setRemove(false)
    }
  } , [remove])

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        backgroundColor: "black",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          width: "20%",
          zIndex: "5",
          backgroundColor: "white",
          borderRadius: "10px",
        }}
      >
        <NewGame user={{enteredUser, resetScore, removeData}} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: "1",
        }}
      >
        <Maps score={{gameFinished, remove, user}} />
      </div>
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          width: "20%",
          zIndex: "5",
          backgroundColor: "white",
          borderRadius: "10px",
        }}
      >
        <Scoreboard data={{users}} />
      </div>
    </div>
  );
}
