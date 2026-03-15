"use client"

import React from "react";
import { useEffect, useState } from "react"
import { FiActivity, FiAlertTriangle, FiHeart } from "react-icons/fi";
import { getRisk } from "./api";

export default function TopBar() {
      const [data, setData] = useState({
        risk: 0
      })
    
      async function load() {
        try {
          const res = await getRisk()
          setData(res)
        } catch (err) {
          console.error("API failed", err)
        }
      }
      
      useEffect(() => {
    
        load() // first load immediately
    
        const interval = setInterval(() => {
          load()
        }, 30000) // refresh every 30 seconds
    
        return () => clearInterval(interval)
    
      }, [])

      const riskType = (score:number) => {
        if (score < 1.5 && score > -1.5) return "MODERATE"
        if (score < -1.5) return "OFF"
        return "ON"
  }

  return (
    <div className="border-b px-4 mt-2 border-stone-200 flex justify-between">
        <div className="pt-1 px-4 pb-3 text-2xl font-bold flex items-center gap-2">
            <FiActivity/>
            <span>MarketPulse</span>
        </div>

        <div className={`flex text-sm items-center gap-2 mb-2 px-3 rounded
        ${riskType(data.risk) == "MODERATE" ? "bg-stone-100 text-stone-700"  : riskType(data.risk) == "OFF" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"} `}>
            <FiAlertTriangle />
            <span>RISK: {riskType(data.risk)}</span>
        </div>
        
    </div>
  );
}