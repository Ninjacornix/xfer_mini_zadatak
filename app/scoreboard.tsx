import React, { useState } from "react";

export default function Scoreboard({ data }: { data: any }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
        }}
      >
        Scoreboard
      </h1>

      {data.users.length != 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: "5px",
            width: "100%",
            height: "90%",
            backgroundColor: "white",
            borderColor: "orange",
            borderRadius: "10px",
            borderWidth: "1px",
            paddingTop: "10px",
            maxHeight: "300px",
            overflowY: "scroll",
          }}
        >
          {data?.users?.map((user: any) => (
            <div key={user.id}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "94%",
                marginLeft: "10px",
                marginRight: "10px",
              }}
            >
              <h2
                style={{
                  color: "black",
                  fontSize: "15px",
                }}
              
              >{user.name}</h2>
              <h3
                style={{
                  color: "black",
                  fontSize: "15px",
                }}
              >{user.score} m</h3>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
